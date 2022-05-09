const options = require("../options")
const commands = require("../commands")
const name = 'ready'

const handler = () => {

    options.startup()

    set_commands()

    console.log("Logged in")
    console.log("name:", options.client.user.tag)
    console.log("id:", options.client.user.id)
    console.log("version:", options.version)
    console.log("-----------------------------------------------")
    console.log("bot is online");

}

async function set_commands() {
    for (const guild_d of options.getGuildlist()) {
        await options.client.application.commands.set(commands.getCommands(), guild_d["id"])
    }
    console.log("command set")
}

module.exports = {
    name,
    handler
}