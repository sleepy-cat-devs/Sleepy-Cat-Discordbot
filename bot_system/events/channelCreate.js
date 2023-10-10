//channelCreate.js

//チャンネルが作成されたイベントを取得
//bot用データにチャンネルデータを追加する指示
//ステージチャンネル未対応（フォーラムも）

const path = require("path")
const { ChannelType } = require("discord.js")

const options = require("../options")

const name = path.basename(__filename, ".js")

const handler = (channel) => {
    if (channel.type == ChannelType.GuildText)
        options.channel_data_update("Create", "GUILD_TEXT", channel)
    else if (channel.type == ChannelType.GuildVoice)
        options.channel_data_update("Create", "GUILD_VOICE", channel)
    //ステージチャンネル未対応
    //else if (channel.type == ChannelType.GuildStageVoice)
    //    options.channel_data_update("Create", "GUILD_STAGE", channel)
}

module.exports = {
    name,
    handler
}