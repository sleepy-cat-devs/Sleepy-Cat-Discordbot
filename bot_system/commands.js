//commands.js

//ボットにコマンドを登録する処理

const fs = require("fs")
const logger = require("./logger").logger

commands_data = []
logger.info(__dirname)

fs.readdir(__dirname + '/commands', (err, files) => {
    files.forEach(file => {
        commands_data.push(require("./commands/" + file)["command"])
    })
})

exports.get_commands = () => {
    return commands_data
}