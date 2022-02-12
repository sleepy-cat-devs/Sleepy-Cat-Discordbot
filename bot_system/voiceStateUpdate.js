const name = 'voiceStateUpdate'
const options=require("./options")

const messagepost=require("./messagepost.js")

const handler = (oldStatus,newStatus) => {
    console.log("change voice status")
    //ボイチャ参加
    if (oldStatus.channel!=newStatus.channel && oldStatus.channel==null){
        const channel=options.getvoicedefaultchannel(newStatus.guild["id"],newStatus.channelId)
        messagepost.send_message(channel,`${newStatus.member.displayName} が ${newStatus.channel} に参加しました`)
    }
    //画面共有の開始
    if (oldStatus.streaming!=newStatus.streaming && newStatus.streaming){
        const channel=options.getvoicedefaultchannel(newStatus.guild["id"],newStatus.channelId)
        messagepost.send_message(channel,`${newStatus.member.displayName} が ${newStatus.channel} で画面共有を開始しました`)
        //console.dir(newStatus.member,{depth:3})
    }
    //サーバーミュート（VoiseStatueのコンソール出力用）
    if (oldStatus.serverMute!=newStatus.serverMute && newStatus.serverMute){
        //const channel=options.getvoicedefaultchannel(newStatus.guild["id"],newStatus.channelId)
        console.log("\nserverMute")
        console.dir(newStatus.member.presences,{depth:3})
        console.log("\n")
    }
    //カメラ共有の開始
    if (oldStatus.selfVideo!=newStatus.selfVideo && newStatus.selfVideo){
        const channel=options.getvoicedefaultchannel(newStatus.guild["id"],newStatus.channelId)
        messagepost.send_message(channel,`${newStatus.member.displayName} が ${newStatus.channel} でカメラ共有を開始しました`)
    }

}

module.exports = {name, handler}