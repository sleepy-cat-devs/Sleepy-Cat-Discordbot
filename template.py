import discord
from discord.ext import commands
from discord.ext import tasks
import feedparser

client = discord.Client()
token=#token (int)自分のはファイル読み込みにした

guri_rss_url = 'https://www.youtube.com/feeds/videos.xml?channel_id=UCM1VDkI02dK0BV-e8nyYobQ'
guri_rss_link=[]

#rss
@tasks.loop(seconds=60)
async def getRSS():
    global guri_rss_url
    global guri_rss_link
    if len(guri_rss_link)==0:#起動時一回目の時
        rss_reply=feedparser.parse(guri_rss_url)
        guri_rss_link.append(rss_reply.entries[0]['link'])
        guri_rss_link.append(rss_reply.entries[1]['link'])
        guri_rss_link.append(rss_reply.entries[2]['link'])
    elif not rss_reply.entries[0]['link'] in guri_rss_link:
        rss_reply=feedparser.parse(guri_rss_url)
        guri_rss_link[0]=rss_reply.entries[0]['link']
        guri_rss_link[1]=rss_reply.entries[1]['link']
        guri_rss_link[2]=rss_reply.entries[2]['link']
        me="guriの動画が更新されました\n"+guri_rss_link[0]
        if getBot()=="testbot":
            await client.get_channel(テキストチャンネルのID).send(me)
    
#起動時
@client.event
async def on_ready():
    print('Logged in')
    print('name:',client.user.name)
    print('id:',client.user.id)
    await client.change_presence(activity=discord.Game(name="Bot"))
    getRSS.start()
    print('------')

client.run(token)
