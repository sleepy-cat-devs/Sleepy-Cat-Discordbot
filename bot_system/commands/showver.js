//showver.js

//botに関する情報を表示したい

const options = require("../options")
const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    command: {
        type: ApplicationCommandType.ChatInput,
        name: "showver",
        description: "実行中のbotのVersionを表示します"
    }
}

options.client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) {
        return;
    }
    if (interaction.commandName === "showver") {
        text = "Bot ver. " + "???" + "\n"
        text += "discord.js@" + "14.3.0"
        await interaction.reply(text);
    }
});