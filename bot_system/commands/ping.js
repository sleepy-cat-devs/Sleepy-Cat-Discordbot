const options = require("../options.js")

module.exports = {
    command: {
        name: "ping",
        description: "Replies with Pong!"
    }
}

options.client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) {
        return;
    }
    if (interaction.commandName === "ping") {
        await interaction.reply("眠いからまた後にしてにゃ");
    }
});