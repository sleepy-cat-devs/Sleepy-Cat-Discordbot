
from options import Options

class MessagePost:

    bot=None

    #メッセージ送信
    @classmethod
    async def message_send(self,mes,channel):
        if Options.getisRelease():
            await self.bot.get_channel(Options.getChannelID(channel)).send(mes)
        else:
            mes=channel+":"+mes
            await self.bot.get_channel(Options.getChannelID('bot-test')).send(mes)
        return

