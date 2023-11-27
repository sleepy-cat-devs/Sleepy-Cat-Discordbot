//ready.js

//bot起動時に行われる処理
//botの起動準備

const options = require("../options")
const commands = require("../commands")
const logger = require("../logger").logger
const name = 'ready'

const handler = () => {

    options.initialize()

    set_commands()

    logger.info("Logged in")
    logger.info("name:", options.client.user.tag)
    logger.info("id:", options.client.user.id)
    logger.info("version:", options.version)
    logger.info("-----------------------------------------------")
    logger.info("bot is online");

}

async function set_commands() {
    for (const guild_d of options.guild_list) {
        await options.client.application.commands.set(commands.get_commands(), guild_d["id"])
    }
    logger.info("command set")
}

module.exports = {
    name,
    handler
}