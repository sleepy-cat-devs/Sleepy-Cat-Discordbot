
from options import Options

class MessagePost:

    bot=None

    #メッセージ送信
    @classmethod
    async def message_send(self,mes,channel):
        if Options.get_is_release():
            await self.bot.get_channel(Options.get_channel_id(channel)).send(mes)
        else:
            mes=channel+":"+mes
            await self.bot.get_channel(Options.get_channel_id('bot-test')).send(mes)
        return

