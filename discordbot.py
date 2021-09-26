#need to pip install discord
import discord
from discord.activity import Streaming
from discord.ext import commands
from discord.ext import tasks
import sys
import re
import traceback
import os
import json
from distutils.util import strtobool

from discord.message import Message

# 実行時にバージョン指定
ver_txt='1.1'
isRelease=False
try:
    if sys.argv[1]=='test':
        isRelease=False
    elif sys.argv[1]=='release':
        isRelease=True
    else:
        raise Exception
except:
    print('リリース状況を正しく入力してください{test/release}')
    exit(1)

os.chdir(os.path.split(os.path.abspath(__file__))[0])

intents = discord.Intents.default()
intents.members = True
client = discord.Client(intents=intents)

with open('options.json','r',encoding='utf-8')as f:
    options=json.load(f)

slc=None

#メッセージ送信
async def message_send(mes,channel,*istts):
    if isRelease:
        if istts is None:
            await client.get_channel(options['chID'][channel]).send(mes)
        else:
            await client.get_channel(options['chID'][channel]).send(mes,tts=istts)
        return
    else:
        mes=channel+":"+mes;
        if istts is None:
            await client.get_channel(options['chID']['bot-test']).send(mes)
        else:
            await client.get_channel(options['chID']['bot-test']).send(mes,tts=istts)
        return
    return

#コマンドの実行権限の確認
def isCommander(user):
    if user.id==slc.owner.id:#サーバー所有者
        return True
    role=slc.get_role(592960800935903242)#役職guri
    for member in slc.members:
        if member.id==user.id and role in member.roles:
            return True
    return False

#通話ステータスの変化を取得するイベント
@client.event
async def on_voice_state_update(member,before,after):
    print(member,before,after,sep='\n',end='\n\n')
    #通話参加時
    if before.channel!=after.channel and before.channel is None:
        mes=member.name if member.nick is None else member.nick
        mes+='が<#'+str(after.channel.id)+'>に参加しました'
        if after.channel.id==844511663096463380:
            await message_send(mes,'bot-test',options['VCtts'])
        else:
            await message_send(mes,'slcls',options['VCtts'])
        return
    #画面共有開始時
    if before.self_stream!=after.self_stream and before.self_stream is False:
        mes=member.name if member.nick is None else member.nick
        mes+='が<#'+str(after.channel.id)+'>で画面共有を始めました'
        if after.channel.id==844511663096463380:
            await message_send(mes,'bot-test',options['VCtts'])
        else:
            await message_send(mes,'slcls',options['VCtts'])
        return
    #通話終了時
    if before.channel!=after.channel and after.channel is None:
        for vc in slc.voice_channels:
            if vc.name==before.channel.name and len(vc.members)==0:
                mes='<#'+str(before.channel.id)+'>の通話が終了しました'
                if vc.id==844511663096463380:
                    await message_send(mes,'bot-test',options['VCtts'])
                else:
                    await message_send(mes,'slcls',options['VCtts'])
                break
        return
    return


@client.event
async def on_message(message):
    try:
        #botか否か
        if message.author.bot:
            return
        print(message.content)
        #コマンド使用権限ありのみ
        if isCommander(message.author):
            if message.content.startswith('!vctts'):
                mes=message.content
                mes=re.sub('!vctts[ \n]','',mes)
                try:
                    me=bool(strtobool(mes))
                    if me==options['VCtts']:
                        mes='VC参加メッセージのttsは既に'
                        mes+='ON' if options['VCtts'] else 'OFF'
                        mes+='です'
                        await message.channel.send(mes)
                        return
                    options['VCtts']=mes
                    options_update()
                    mes='VC参加メッセージのttsを'
                    mes+='ON' if options['VCtts'] else 'OFF'
                    mes+='にしました'
                    await message.channel.send(mes)
                except ValueError:
                    message.channel.send('入力形式が違います')
            #botのニックネーム変更
            if message.content.startswith('!chnick'):
                mes=message.content
                mes=re.sub('!chnick[ \n]','',mes)
                me=client.get_guild(options['guild_id']).me
                await me.edit(nick=mes)
                await message.channel.send('ニックネームを'+mes+'に変更しました')
                return
            #botのゲームアクティビティの変更
            if message.content.startswith('!chgame'):
                mes=message.content
                mes=re.sub('!chgame[ \n]','',mes)
                await client.change_presence(activity=discord.Game(name=mes))
                await message.channel.send('ステータスアクティビティを変更しました')
                return
            # if message.content.startswith('!send'):
            #     try:
            #         mes=message.content
            #         mes=re.sub('!testsend[ \n]','',mes)
            #         mes=re.split('[\n ]',mes,1)
            #         if len(mes)==1:
            #             await message_send(mes[0],'random')
            #         else:
            #             await message_send(mes[1],client.get_channel(int(mes[0])))
            #     except:
            #         pass
            #     finally:
            #         return
            # if message.content.startswith('!mokume'):
            #     mes=message.content
            #     mes=re.sub('!mokume[ \n]','',mes)
            #     mem=await client.fetch_user(584692942585987090)
            #     await mem.send(mes)
            #     return
            # if message.content.startswith('!guri'):
            #     mes=message.content
            #     mes=re.sub('!guri[ \n]','',mes)
            #     mem=await client.fetch_user(371678678142418945)
            #     await mem.send(mes)
            #     return
            # if message.content.startswith('!yu'):
            #     mes=message.content
            #     mes=re.sub('!yu[ \n]','',mes)
            #     mem=await client.fetch_user(584693617281728542)
            #     await mem.send(mes)
            #     return

        #このBotがmentionされたか
        if str(client.user.id)+'>' in message.content or '<@&'+str(792767547388854304)+'>' in message.content:
            mes='<@'+str(message.author.id)+'>：眠いからまたあとにしてにゃ'
            emoji='\N{Yawning Face}'
            await message.add_reaction(emoji)
            await message.channel.send(mes)
            return

        if message.content=='!showver':
            await message.channel.send('ver '+ver_txt)

        #権限付きコマンドの使用権限の確認
        if message.content.startswith('!canCommand'):
            if isCommander(message.author):
                await message.channel.send(message.author.name+'は権限が必要なコマンドの使用ができます')
            else:
                await message.channel.send(message.author.name+'は権限が必要なコマンドの使用ができません')
            return

    except:
        me='エラー\n>>> ```'+traceback.format_exc()+'```'
        await client.get_channel(options['chID']['bot-test']).send(me)

#起動時
@client.event
async def on_ready():
    print('Logged in')
    print('name:',client.user.name)
    print('id:',client.user.id)
    await client.change_presence(activity=discord.Game(name='Bot'))
    print('------')

    global slc,guild_id
    slc=client.get_guild(options['guild_id'])
    print('サーバー:',slc)
    print('所有者:',slc.owner)
    if isRelease is False:
        await message_send(client.user.name+'(テスト版)が起動しました','bot-test')
    else:
        await message_send(client.user.name+'(リリース版)が起動しました','bot-test')
    #print(options)

#options.jsonの更新
def options_update():
    global options
    with open('options.json','w',encoding='utf-8')as f:
        json.dump(options,f,indent=4)

client.run(options['token'])
