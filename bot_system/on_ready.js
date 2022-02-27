const options = require("./options")
const name = 'ready'

const handler = () => {

    options.startup()

    console.log("Logged in")
    console.log("name:", options.client.user.tag)
    console.log("id:", options.client.user.id)
    console.log("version:", options.version)
    console.log("-----------------------------------------------")
    console.log('bot is online');
}

module.exports = {
    name,
    handler
}