import discord
from options import Options

class MessagePost:

    bot=None

    #メッセージ送信
    @classmethod
    async def message_send(self,mes,channel):
        channel_type=type(channel)
        # 送信先チャンネルを格納する変数
        target_channel=None
        if channel_type==discord.channel.TextChannel:
            target_channel=channel
        elif channel_type==int:
            target_channel=self.bot.get_channel(channel)
        elif channel_type==str:
            target_channel=self.bot.get_channel(Options.get_channel_id(channel))
        else:
            target_channel=None
        if target_channel==None:
            mes="不正なチャンネルを指定しています\n指定チャンネル:"+str(channel)+","+str(type(channel))+"\n"+mes
            await self.bot.get_channel(Options.get_channel_id("bot-test")).send(mes)
            return

        if Options.get_is_release():
            await target_channel.send(mes)
        else:
            mes=target_channel.name+":"+mes
            await self.bot.get_channel(Options.get_channel_id("bot-test")).send(mes)
        return
