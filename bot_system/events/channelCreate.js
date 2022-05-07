const path = require("path")

const options = require("../options")

const name = path.basename(__filename, ".js")

const handler = (channel) => {
    if (channel.type == "GUILD_TEXT" || channel.type == "GUILD_VOICE") {
        options.channelCreate(channel.type, channel)
    }
}

module.exports = {
    name,
    handler
}