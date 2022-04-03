module.exports = {
    command: {
        name: "notify_ch",
        description: "VC通知をするチャンネルの変更",
        options: [{
            type: "CHANNEL",
            name: "textchannel",
            description: "TextChannel を選択",
            required: true
        }]
    }
}