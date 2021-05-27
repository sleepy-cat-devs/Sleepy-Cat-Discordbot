#need to pip install discord , feedparser

import copy
from inspect import Traceback
import discord
from discord import channel
from discord.activity import Streaming
from discord.ext import commands
from discord.ext import tasks
import feedparser
import re
import traceback
import os
import json
from distutils.util import strtobool

os.chdir(os.path.split(os.path.abspath(__file__))[0])

intents = discord.Intents.default()
intents.members = True
client = discord.Client(intents=intents)

with open('options.json','r',encoding='utf-8')as f:
    options=json.load(f)

slc=None

#YouTubeRSSに使う変数
youtube_chID_dic = {
    'NKRB':'UCklp1bp2imJmqK40wtTUvwA',#NKRBチャンネル
    'mokume':'UC0wBELuVlX1FbfpFRK8XoXg',#mokumeチャンネル
    'guri':'UCM1VDkI02dK0BV-e8nyYobQ'#guriチャンネル
}
youtube_Rss_Contents={}

web_Rss_dic={
    'SteamGroup':'https://steamcommunity.com/groups/sleepy_cat/rss/'
}
web_Rss_Contents={}

"""
#YouTubeのrss
@tasks.loop(seconds=60)
async def getYouTubeRSS():
    global youtube_chID_dic
    global youtube_Rss_Contents
    for ch_name in list(youtube_chID_dic.keys()):
        rss_reply=feedparser.parse('https://www.youtube.com/feeds/videos.xml?channel_id='+youtube_chID_dic[ch_name])
        #チャンネルの動画が1つ以上 and 記録されてない動画(最大5本)
        entLen=len(rss_reply.entries)
        if entLen>0:
            for entry in rss_reply.entries[0:min(5,entLen)]:
                if not entry['link'] in youtube_Rss_Contents[ch_name]:
                    mes=entry['authors'][0]['name']+'の動画が更新されました\n'+entry['link']
                    await client.get_channel(options['bot-test']).send(mes)
            contentsUpdate(youtube_Rss_Contents,rss_reply,ch_name)

#WebサイトのRSS
@tasks.loop(seconds=60)
async def getWebRSS():
    global web_Rss_dic
    global web_Rss_Contents
    try:
        for web_link in list(web_Rss_dic.keys()):
            rss_reply=feedparser.parse(web_Rss_dic[web_link])
            entLen=len(rss_reply.entries)
            #記事が1つ以上ある，記録されていない記事(最大5本)
            if entLen>0:
                for entry in rss_reply.entries[0:min(5,entLen)]:
                    if not entry['link'] in web_Rss_Contents[web_link]:
                        title=entry['title']
                        link='[リンク]('+entry['link']+')'
                        text=entry['summary']
                        mes=''
                        l=re.findall('<div.*?/div>',text)
                        if len(l)>0:
                            text=re.sub(l[0],'',text)
                            l[0]=re.sub('<.*?>','',l[0])
                            mes+='**'+l[0]+'**\n'
                        text=re.sub('<.*?>','',text)
                        mes+=text[0:min(20,len(text))]+'...\n'+link
                        e=discord.Embed(title=title,description=mes,color=0x000080)
                        await client.get_channel(options['bot-test']).send(embed=e)
                contentsUpdate(web_Rss_Contents,rss_reply,web_link)
    except:
        me='エラー\n>>> ```'+traceback.format_exc()+'```'
        await client.get_channel(794872991037128704).send(me)

    return

#コンテンツ一覧更新
def contentsUpdate(contents,rss_reply,ch_name):
    contents[ch_name]=[i['link'] for i in rss_reply.entries]
"""

#コマンドの実行権限の確認
def isCommander(user):
    if user.id==slc.owner.id:#サーバー所有者
        return True
    role=slc.get_role(592960800935903242)#役職guri
    for member in slc.members:
        if member.id==user.id and role in member.roles:
            return True
    return False

@client.event
async def on_voice_state_update(member,before,after):
    print(member,before,after)
    if before.channel!=after.channel and before.channel is None:
        me=member.name if member.nick is None else member.nick
        me+='が<#'+str(after.channel.id)+'>に参加しました'
        print(me)
        await client.get_channel(options['chID']['slcls']).send(me,tts=['VCtts'])
        return
    if before.self_stream!=after.self_stream and before.self_stream is False:
        me=member.name if member.nick is None else member.nick
        me+='が<#'+str(after.channel.id)+'>で画面共有を始めました'
        await client.get_channel(options['chID']['slcls']).send(me)
        return


@client.event
async def on_message(message):
    print(message.content)
    try:
        #botか否か
        if message.author.bot:
            return
        #print(message)
        if isCommander(message.author):
            if message.content.startswith('!vctts'):
                me=message.content
                me=re.sub('!vctts[ \n]','',me)
                print('message:',me)
                try:
                    me=bool(strtobool(me))
                    print(me)
                    if me==options['VCtts']:
                        me='VC参加メッセージのttsは既に'
                        me+='ON' if options['VCtts'] else 'OFF'
                        me+='です'
                        await message.channel.send(me)
                        return
                    options['VCtts']=me
                    options_update()
                    me='VC参加メッセージのttsを'
                    me+='ON' if options['VCtts'] else 'OFF'
                    me+='にしました'
                    await message.channel.send(me)
                except ValueError:
                    message.channel.send('入力形式が違います')

            if message.content.startswith('!testsend'):
                me=message.content
                me=re.sub('!testsend[ \n]','',me)
                await client.get_channel(options['chID']['bot-test']).send(me)
                return

            if message.content.startswith('!send'):
                me=message.content
                me=re.sub('!send[ \n]','',me)
                await client.get_channel(584696543278399488).send(me)
                return
            if message.content.startswith('!mokume'):
                me=message.content
                me=re.sub('!mokume[ \n]','',me)
                mem=await client.fetch_user(584692942585987090)
                await mem.send(me)
                return
            if message.content.startswith('!guri'):
                me=message.content
                me=re.sub('!guri[ \n]','',me)
                mem=await client.fetch_user(371678678142418945)
                await mem.send(me)
                return
            if message.content.startswith('!yu'):
                me=message.content
                me=re.sub('!yu[ \n]','',me)
                mem=await client.fetch_user(584693617281728542)
                await mem.send(me)
                return

        #このBotがmentionされたか
        if str(client.user.id)+'>' in message.content or '<@&'+str(792767547388854304)+'>' in message.content:
            me='<@'+str(message.author.id)+'>：眠いからまたあとにしてにゃ'
            emoji='\N{Yawning Face}'
            await message.add_reaction(emoji)
            await message.channel.send(me)
    except:
        me='エラー\n>>> ```'+traceback.format_exc()+'```'
        await client.get_channel(options['chID']['bot-test']).send(me)

#起動時
@client.event
async def on_ready():
    print('Logged in')
    print('name:',client.user.name)
    print('id:',client.user.id)
    await client.change_presence(activity=discord.Game(name="Bot"))
    print('------')
    # for ch_name in list(youtube_chID_dic.keys()):
    #     rss_reply=feedparser.parse('https://www.youtube.com/feeds/videos.xml?channel_id='+youtube_chID_dic[ch_name])
    #     contentsUpdate(youtube_Rss_Contents,rss_reply,ch_name)
    #
    # for web_link in list(web_Rss_dic.keys()):
    #     rss_reply=feedparser.parse(web_Rss_dic[web_link])
    #     contentsUpdate(web_Rss_Contents,rss_reply,web_link)
    #
    # getYouTubeRSS.start()
    # getWebRSS.start()

    global slc,guild_id
    slc=client.get_guild(options['guild_id'])
    print('サーバー:',slc)
    print('所有者:',slc.owner)

    print(options)

    await client.get_channel(options['chID']['bot-test']).send(client.user.name+'が起動しました')


def options_update():
    global options
    with open('options.json','w',encoding='utf-8')as f:
        json.dump(options,f,indent=4)

client.run(options['token'])
