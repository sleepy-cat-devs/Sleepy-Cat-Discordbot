// events.js
const fs = require('fs')

events_data = []


fs.readdirSync(__dirname + '/events').forEach(file => {
    //console.log(file)
    events_data.push(require("./events/" + file))
})
console.log("list:", events_data)


module.exports = events_data