//ping.js

//botにpingを送るコマンド，及びbotの反応

const options = require("../options.js")

module.exports = {
    command: {
        name: "ping",
        description: "botが反応します（疎通確認にでも）"
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