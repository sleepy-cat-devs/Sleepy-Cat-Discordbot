//ready.js

//bot起動時に行われる処理
//botの起動準備

const options = require("../options")
const commands = require("../commands")
const name = 'ready'

const handler = () => {

    options.initialize()

    set_commands()

    console.log("Logged in")
    console.log("name:", options.client.user.tag)
    console.log("id:", options.client.user.id)
    console.log("version:", options.version)
    console.log("-----------------------------------------------")
    console.log("bot is online");

}

async function set_commands() {
    for (const guild_d of options.guild_list) {
        await options.client.application.commands.set(commands.get_commands(), guild_d["id"])
    }
    console.log("command set")
}

module.exports = {
    name,
    handler
}