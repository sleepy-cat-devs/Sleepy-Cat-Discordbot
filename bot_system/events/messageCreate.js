//messageCreate.js

//メッセージが送信されたときに反応するイベント処理

const name = 'messageCreate'

const Discord = require("discord.js")

const options = require("../options")
const logger = require("../logger").logger

const handler = (message) => {
    //システム,bot,コマンド応答のメッセージを除外
    if (message.system || message.author.bot || message.interaction !== null)
        return
    let mes = `${message.author.tag} in #${message.channel.name} sent: ${message.content}`
    logger.debug(mes)

    //メンション時応答
    if (message.mentions.has(options.client.user.id)) {
        message.channel.send("<@!" + message.member.id + ">：眠いからまたあとにしてにゃ")
    }

    //message.channel.send(mes)
}

module.exports = {
    name,
    handler
}