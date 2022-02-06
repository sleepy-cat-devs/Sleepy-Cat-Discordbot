const name = 'voiceStateUpdate'
const options=require("./options")

const messagepost=require("./messagepost.js")

const handler = (oldStatus,newStatus) => {
    console.log("change voice status")
    if (oldStatus.channel!=newStatus.channel && oldStatus.channel==null){
        const channel=options.getvoicedefaultchannel(newStatus.guild["id"],newStatus.channelId)
        messagepost.send_message(channel,`${newStatus.member.displayName} が ${newStatus.channel} に参加しました`)
    }

    if (oldStatus.streaming!=newStatus.streaming && newStatus.streaming==true){
        const channel=options.getvoicedefaultchannel(newStatus.guild["id"],newStatus.channelId)
        messagepost.send_message(channel,`${newStatus.member.displayName} が ${newStatus.channel} で画面共有を開始しました`)
    }

    if (oldStatus.selfVideo!=newStatus.selfVideo && newStatus.selfVideo==true){
        const channel=options.getvoicedefaultchannel(newStatus.guild["id"],newStatus.channelId)
        messagepost.send_message(channel,`${newStatus.member.displayName} が ${newStatus.channel} でカメラ共有を開始しました`)
    }

}

module.exports = {name, handler}