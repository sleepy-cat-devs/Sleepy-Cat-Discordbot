//channelDelete.js

//チャンネルが作成されたイベントを取得
//bot用データからチャンネルデータを削除する指示

const path = require("path")
const { ChannelType } = require("discord.js")

const options = require("../options")

const name = path.basename(__filename, ".js")

const handler = (channel) => {
    if (channel.type == ChannelType.GuildText)//ChannelType.GuildText = 0
        options.channel_data_update(1, "GUILD_TEXT", channel)
    else if (channel.type == ChannelType.GuildVoice)
        options.channel_data_update(1, "GUILD_VOICE", channel)
}

module.exports = {
    name,
    handler
}