#need to pip install discord , feedparser

import discord
from discord.ext import commands
from discord.ext import tasks
import feedparser

client = discord.Client()
token="NjM0Nzg2NzM2NjY0NDc3NzA2.XanlNw.gz3P2RL1f_trXeNR4xxFgOY_raA"

test_ch=794872991037128704

#YouTubeRSSに使う変数
youtube_chID_dic = {
    'NKRB':'UCklp1bp2imJmqK40wtTUvwA',#NKRBチャンネル
    'mokume':'UC0wBELuVlX1FbfpFRK8XoXg',#mokumeチャンネル
    'guri':'UCM1VDkI02dK0BV-e8nyYobQ'#guriチャンネル
}
rss_links={}
for ch_name in list(youtube_chID_dic.keys()):
    rss_links[ch_name]=['']*3

#rss
first_getRss=True   #起動後初回のgetRSSであるか
@tasks.loop(seconds=60)
async def getRSS():
    global youtube_chID_dic
    global rss_links
    youtube_ch_name=list(youtube_chID_dic.keys())
    for ch_name in youtube_ch_name:
        rss_reply=feedparser.parse('https://www.youtube.com/feeds/videos.xml?channel_id='+youtube_chID_dic[ch_name])
        global first_getRss
        #チャンネルの動画が1つ以上 and 記録されてない動画 and 最初の1回
        if len(rss_reply.entries)>0 and not rss_reply.entries[0]['link'] in rss_links[ch_name] and not first_getRss:
            first_getRss=False
            me=rss_reply.entries[0]['authors'][0]['name']+"の動画が更新されました\n"+rss_reply.entries[0]['link']
            await client.get_channel(test_ch).send(me)
        linksUpdate(rss_links,rss_reply,ch_name)
        #if rss_links[ch_name][0]=='':#チャンネルに動画が存在してない場合
        #    print(ch_name,'の動画がないよ')

#動画が3つ未満の可能性を考慮して動画一覧更新
def linksUpdate(links,rss_reply,ch_name):
    n=0
    if len(rss_reply.entries)>=3:
        n=3
    else:
        n=len(rss_reply.entries)
    for i in range(n):
        links[ch_name][i]=rss_reply.entries[i]['link']


#起動時
@client.event
async def on_ready():
    print('Logged in')
    print('name:',client.user.name)
    print('id:',client.user.id)
    await client.change_presence(activity=discord.Game(name="Bot"))
    print('------')
    getRSS.start()
    await client.get_channel(test_ch).send("Hello Discord World (φωφ)")

client.run(token)
