const options = require("../options")

module.exports = {
    command: {
        name: "notify_ch",
        description: "VC通知をするチャンネルの変更",
        options: [{
            type: "CHANNEL",
            name: "textchannel",
            description: "TextChannel を選択",
            channel_types: [0]
        }]
    }
}

options.client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) {
        return;
    }
    if (interaction.commandName === "notify_ch") {
        invcid = interaction.member.voice.channelId
        if (invcid == null) {
            await interaction.reply("VoiceChannelに入って実行してください");
            return
        } else {
            for (let i = 0; i < options.guild_data[interaction.guildId]["GUILD_VOICE"].length; i++) { //TODO
                if (options.guild_data[interaction.guildId]["GUILD_VOICE"][i]["ch_id"] === invcid) {
                    let textch_id
                    if (interaction.options._hoistedOptions.length == 0) {
                        textch_id = interaction.channelId
                    } else {
                        textch_id = interaction.options._hoistedOptions[0].channel.id
                    }
                    options.guild_data[interaction.guildId]["GUILD_VOICE"][i]["default_textchid"] = textch_id
                    //options.guild_data_update(interaction.guildId)
                    interaction.reply("<#" + invcid + "> の通知チャンネルを <#" + textch_id + "> に変更しました")
                    return
                }
            }
        }
    }
});