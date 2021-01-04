#need to pip install discord , feedparser

import discord
from discord.ext import commands
from discord.ext import tasks
import feedparser
import re

client = discord.Client()
token="NjM0Nzg2NzM2NjY0NDc3NzA2.XanlNw.gz3P2RL1f_trXeNR4xxFgOY_raA"

guild_id=584693499308539917
guild=None

test_ch=794872991037128704

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
                    await client.get_channel(test_ch).send(mes)
        contentsUpdate(youtube_Rss_Contents,rss_reply,ch_name)

#WebサイトのRSS
@tasks.loop(seconds=60)
async def getWebRSS():
    global web_Rss_dic
    global web_Rss_Contents
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
                    await client.get_channel(test_ch).send(embed=e)
        contentsUpdate(web_Rss_Contents,rss_reply,web_link)
    return

#コンテンツ一覧更新
def contentsUpdate(contents,rss_reply,ch_name):
    contents[ch_name]=[i['link'] for i in rss_reply.entries]

@client.event
async def on_message(message):
    print(message)
    #botか否か
    if message.author.bot:
        return
    #print(message)
    #このBotがmentionされたか
    if str(client.user.id)+'>' in message.content or '<@&'+str(792767547388854304)+'>' in message.content:
        me='<@'+str(message.author.id)+'>：眠いからまたあとにしてにゃ'
        emoji='\N{Yawning Face}'
        await message.add_reaction(emoji)
        await message.channel.send(me)

#起動時
@client.event
async def on_ready():
    print('Logged in')
    print('name:',client.user.name)
    print('id:',client.user.id)
    await client.change_presence(activity=discord.Game(name="Bot"))
    print('------')
    for ch_name in list(youtube_chID_dic.keys()):
        rss_reply=feedparser.parse('https://www.youtube.com/feeds/videos.xml?channel_id='+youtube_chID_dic[ch_name])
        contentsUpdate(youtube_Rss_Contents,rss_reply,ch_name)

    for web_link in list(web_Rss_dic.keys()):
        rss_reply=feedparser.parse(web_Rss_dic[web_link])
        contentsUpdate(web_Rss_Contents,rss_reply,web_link)

    getYouTubeRSS.start()
    getWebRSS.start()

    global guild,guild_id
    guild=client.get_guild(guild_id)

client.run(token)
