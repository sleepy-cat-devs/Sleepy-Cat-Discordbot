//notify_ch.js

//VC参加時の参加通知を行うテキストチャンネルの指定

const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const { ChannelType } = require('discord.js');
const options = require("../options")

module.exports = {
    command: {
        type: ApplicationCommandType.ChatInput,
        name: "notify_ch",
        description: "VC通知をするチャンネルの変更",
        options: [{
            type: ApplicationCommandOptionType.Channel,
            channel_types: [ChannelType.GuildText],
            name: "textchannel",
            description: "TextChannel を選択"
        }, {
            type: ApplicationCommandOptionType.Channel,
            channel_types: [ChannelType.GuildVoice],
            name: "voicechannel",
            description: "VoiceChannel を選択"
        }]
    }
}

options.client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) {
        return;
    }
    if (interaction.commandName === "notify_ch") {
        textch_id = null
        voicech_id = null
        //vcに入っているとき
        if (interaction.member.voice.channelId !== null)
            voicech_id = interaction.member.voice.channelId
        //コマンドでの指定チャンネルidを取得，あれば優先
        for (commandoption of interaction.options._hoistedOptions) {
            if (commandoption.channel.type == ChannelType.GuildText)
                textch_id = commandoption.value
            else if (commandoption.channel.type == ChannelType.GuildVoice)
                voicech_id = commandoption.value
        }
        //textchの指定がないとき
        if (textch_id === null)
            textch_id = interaction.channelId

        if (voicech_id === null) {
            await interaction.reply("VoiceChannelを指定,またはVoiceChannelに参加した状態で実行してください");
            return
        } else {
            for (let i = 0; i < options.guild_data[interaction.guildId]["GUILD_VOICE"].length; i++) { //TODO
                if (options.guild_data[interaction.guildId]["GUILD_VOICE"][i]["ch_id"] === voicech_id) {
                    options.guild_data[interaction.guildId]["GUILD_VOICE"][i]["default_textchid"] = textch_id
                    options.guild_data_update(interaction.guildId)
                    interaction.reply("<#" + voicech_id + "> の通知チャンネルを <#" + textch_id + "> に変更しました")
                    return
                }
            }
        }
    }
});