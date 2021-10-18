#need to pip install discord
import discord
from discord.ext import commands

import sys
import os

from discord.ext.commands.errors import EmojiNotFound

from options import Options
from messagepost import MessagePost

# 実行時に テスト版 or リリース版 を指定
isRelease=False
try:
    if sys.argv[1]=="test":
        isRelease=False
    elif sys.argv[1]=="release":
        isRelease=True
    else:
        raise Exception
except:
    print("リリース状況を正しく入力してください{test/release}")
    exit(1)

Options.set_is_release(isRelease)

os.chdir(os.path.split(os.path.abspath(__file__))[0])

intents = discord.Intents.default()
intents.members = True
bot = commands.Bot(command_prefix="!",intents=intents)

#起動時
@bot.event
async def on_ready():
    print("Logged in")
    print("name:",bot.user.name)
    print("id:",bot.user.id)
    await bot.change_presence(activity=discord.Game(name="Plaxi"))
    print("------")

    global slc,guild_id
    slc=bot.get_guild(Options.get_guild_id())
    Options.set_guild(slc)
    print("サーバー:",slc)
    print("所有者:",slc.owner)

    bot.load_extension("vcsupportCog")
    bot.load_extension("botcommandsCog")
    MessagePost.bot=bot
    print()

    mes=bot.user.name+"("+sys.argv[1]+"版)が起動しました\n"+"`ver. "+Options.get_version()+"`"
    await MessagePost.message_send(mes,"bot-test")
    #print(options)

bot.run(Options.get_token())
