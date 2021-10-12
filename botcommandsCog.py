import discord
from discord.ext import commands

import traceback

from messagepost import MessagePost
from options import Options
from utility import Utility

class BotCommandsCog(commands.Cog):

    def __init__(self,bot):
        self.bot=bot

    @commands.Cog.listener()
    async def on_message(self,message):
        try:
            #botか否か
            if message.author.bot:
                return
            print(message)
            print(message.content,'\n')
            #test版は#bot-testでのみ反応
            if not Options.get_is_release() and message.channel.id!=Options.get_channel_id('bot-test'):
                return
            #リリース版は#bot-testで反応しない
            elif Options.get_is_release() and message.channel.id==Options.get_channel_id('bot-test'):
                return

            #このBotがmentionされたか
            if str(self.bot.user.id)+'>' in message.content or '<@&'+str(792767547388854304)+'>' in message.content:
                mes='<@'+str(message.author.id)+'>：眠いからまたあとにしてにゃ'
                emoji='\N{Yawning Face}'
                await message.add_reaction(emoji)
                await MessagePost.message_send(mes,str(message.channel.id))
                return

        except:
            await Utility.send_error(traceback.format_exc())

    #botのニックネーム変更
    @commands.command()
    async def chnick(self,ctx,new_name):
        if not Utility.is_commander(ctx.author):#権限がなければ終了
            return
        if new_name is None:
            await MessagePost.message_send('botの名前を入力してください',str(ctx.channel.id))
            return
        me=Options.get_guild().me
        await me.edit(nick=new_name)
        await MessagePost.message_send('botのニックネームを'+new_name+'に変更しました',str(ctx.channel.id))
        return

    #botのゲームアクティビティの変更
    @commands.command()
    async def chgame(self,ctx,new_game):
        if not Utility.is_commander(ctx.author):#権限がなければ終了
            return
        if new_game is None:
            await MessagePost.message_send('アクティビティ名を入力してください',str(ctx.channel.id))
            return
        await self.bot.change_presence(activity=discord.Game(name=new_game))
        await MessagePost.message_send('botのステータスアクティビティを変更しました',str(ctx.channel.id))
        return

    #botversionの表示
    @commands.command()
    async def showver(self,ctx):
        await MessagePost.message_send('ver '+Options.options["version"],str(ctx.channel.id))

    #権限付きコマンドの使用権限の確認
    @commands.command()
    async def cancommand(self,ctx):
        if Utility.is_commander(ctx.author):
            mes=Utility.member_display_name(ctx.author)+'は権限が必要なコマンドの使用ができます'
        else:
            mes=Utility.member_display_name(ctx.author)+'は権限が必要なコマンドの使用ができません'
        await MessagePost.message_send(mes,str(ctx.channel.id))
        return


def setup(bot):
    print('load BotCommandsCog')
    return bot.add_cog(BotCommandsCog(bot))