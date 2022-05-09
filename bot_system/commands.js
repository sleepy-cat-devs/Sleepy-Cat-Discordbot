const fs = require('fs')

commands_data = []
console.log(__dirname)

fs.readdir(__dirname + '/commands', (err, files) => {
    files.forEach(file => {
        //console.log(file)
        commands_data.push(require("./commands/" + file)["command"])
        //console.dir(commands_data)
    })
})

exports.getCommands = () => {
    return commands_data
}