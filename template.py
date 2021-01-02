import discord
from discord.ext import commands
from discord.ext import tasks

client = discord.Client()
token="NjM0Nzg2NzM2NjY0NDc3NzA2.XanlNw.gz3P2RL1f_trXeNR4xxFgOY_raA"

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
