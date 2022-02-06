// events.js

// イベント
const events = [
    require("./bot_system/on_ready.js"),
    require("./bot_system/on_message.js"),
    require("./bot_system/voiceStateUpdate.js"),
]

module.exports = events