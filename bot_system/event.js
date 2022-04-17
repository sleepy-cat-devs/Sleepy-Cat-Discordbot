// events.js

// イベント
const events = [
    require("./events/on_ready.js"),
    require("./events/on_message.js"),
    require("./events/voiceStateUpdate.js"),
    require("./events/channelCreate.js")
]

module.exports = events