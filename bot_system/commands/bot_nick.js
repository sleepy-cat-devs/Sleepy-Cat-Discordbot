const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const options = require("../options")

module.exports = {
    command: {
        name: "bot_nick",
        description: "botニックネームの変更",
        options: [{
            type: ApplicationCommandOptionType.String,
            name: "name",
            description: "\"ニックネーム\" を入力",
            required: true
        }]
    }
}

options.client.on("interactionCreate", async (interaction) => {
    console.dir(this.command)
    if (!interaction.isCommand()) {
        return;
    }
    if (interaction.commandName === "bot_nick") {
        await interaction.reply("bot_rename 未実装");
    }
});