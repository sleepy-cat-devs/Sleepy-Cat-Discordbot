const options = require("../options")

module.exports = {
    command: {
        name: "showver",
        description: "実行中のbotのVersionを表示します"
    }
}

options.client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) {
        return;
    }
    if (interaction.commandName === "showver") {
        await interaction.reply("ver. " + options.getVersion());
    }
});