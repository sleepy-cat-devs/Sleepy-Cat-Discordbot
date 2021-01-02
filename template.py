#need to pip install discord , feedparser

import discord
from discord.ext import commands
from discord.ext import tasks
import feedparser
import copy

client = discord.Client()
token="NjM0Nzg2NzM2NjY0NDc3NzA2.XanlNw.gz3P2RL1f_trXeNR4xxFgOY_raA"

youtube_rss_url = [
    'https://www.youtube.com/feeds/videos.xml?channel_id=UCklp1bp2imJmqK40wtTUvwA',#NKRBチャンネル
    'https://www.youtube.com/feeds/videos.xml?channel_id=UC0wBELuVlX1FbfpFRK8XoXg',#mokumeチャンネル
    'https://www.youtube.com/feeds/videos.xml?channel_id=UCM1VDkI02dK0BV-e8nyYobQ'#guriチャンネル
    ]
rss_links=[]
for i in range(len(youtube_rss_url)):
    rss_links.append(copy.deepcopy([]))

#rss
@tasks.loop(seconds=60)
async def getRSS():
    global youtube_rss_url
    global rss_links
    for i in range(len(youtube_rss_url)):
        if len(rss_links[i])==0:#起動時一回目の時
            rss_reply=feedparser.parse(youtube_rss_url[i])
            rss_links[i].append(rss_reply.entries[0]['link'])
            rss_links[i].append(rss_reply.entries[1]['link'])
            rss_links[i].append(rss_reply.entries[2]['link'])
        elif not rss_reply.entries[0]['link'] in rss_links[i]:
            rss_reply=feedparser.parse(youtube_rss_url)
            rss_links[i][0]=rss_reply.entries[0]['link']
            rss_links[i][1]=rss_reply.entries[1]['link']
            rss_links[i][2]=rss_reply.entries[2]['link']
            me=rss_reply.entries[0]['authors'][0]['name']+"の動画が更新されました\n"+rss_links[i][0]
            await client.get_channel(794872991037128704).send(me)

#起動時
@client.event
async def on_ready():
    print('Logged in')
    print('name:',client.user.name)
    print('id:',client.user.id)
    await client.change_presence(activity=discord.Game(name="Bot"))
    print('------')
    await client.get_channel(794872991037128704).send("Hello Discord World (φωφ)")

client.run(token)
