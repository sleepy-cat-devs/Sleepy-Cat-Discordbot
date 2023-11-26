// events.js

//DiscordAPIのイベントを登録

const fs = require("fs")
const logger = require("./logger").logger

events_data = []


fs.readdirSync(__dirname + '/events').forEach(file => {
    events_data.push(require("./events/" + file))
})
logger.info("event list:", events_data)

module.exports = events_data