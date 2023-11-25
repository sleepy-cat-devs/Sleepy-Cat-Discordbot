// events.js

//DiscordAPIのイベントを登録

const fs = require('fs')

events_data = []


fs.readdirSync(__dirname + '/events').forEach(file => {
    //console.log(file)
    events_data.push(require("./events/" + file))
})
console.log("event list:", events_data)


module.exports = events_data