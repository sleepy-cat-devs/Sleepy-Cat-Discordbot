//voiceStateUpdate.js

//通話の入退出，画面共有を感知し，通知を行う

const name = 'voiceStateUpdate'
const options = require("../options")

const messagepost = require("../messagepost")
const logger = require("../logger").logger

const handler = (oldStatus, newStatus) => {
    //対象がbotの場合はスルー
    if (newStatus.member.user.bot)
        return

    logger.debug("change voice status")
    if (oldStatus.channel != newStatus.channel) {
        //ボイチャ参加  対象がbotの場合は判定なし
        if (newStatus.channel != null && !newStatus.member.user.bot) __join_vc(newStatus)
        //ボイチャ退出
        else if (oldStatus.channel != null) __leave_vc(oldStatus)
    }
    //画面共有の開始
    if (oldStatus.streaming != newStatus.streaming && newStatus.streaming) {
        const channel = __getVoiceDefaultChannel(newStatus)
        messagepost.send_message(channel, `${newStatus.member.displayName} が ${newStatus.channel} で画面共有を開始しました`)
    }
    //サーバーミュート（VoiseStatueのコンソール出力用）
    if (oldStatus.serverMute != newStatus.serverMute && newStatus.serverMute) {
        logger.debug("\nserverMute")
        console.dir(newStatus.member.presences, {
            depth: 3
        })
        logger.debug("\n")
    }
    //カメラ共有の開始
    if (oldStatus.selfVideo != newStatus.selfVideo && newStatus.selfVideo) {
        const channel = __getVoiceDefaultChannel(newStatus)
        messagepost.send_message(channel, `${newStatus.member.displayName} が ${newStatus.channel} でカメラ共有を開始しました`)
    }
}

module.exports = {
    name,
    handler
}

function __getVoiceDefaultChannel(status) {
    return options.get_voice_default_channel(status.guild["id"], status.channelId)
}

let vcDict = new Object();
/*{
    ボイチャチャンネルID（数字列）:{
        members (Setオブジェクト 重複なし):{}
        startTime:VCの開始時間
        vcBeginTime:2名以上が参加した時刻
        totalTime:2名以上のボイチャが継続された時間
    }
}*/

//通話参加時
function __join_vc(status) {
    logger.debug("join_vc");
    messagepost.send_message(
        __getVoiceDefaultChannel(status),
        `${status.member.displayName} が ${status.channel} に参加しました`)
    if (String(status.channelId) in vcDict) {
        vcDict[status.channelId].members.add(status.member.id)
        if (__getUserLen(status) == 2) {
            vcDict[status.channelId].vcBeginTime = new Date()
        }
    } else {
        let entry = new Object();
        entry.members = new Set([status.member.id])
        entry.startTime = new Date()
        entry.totalTime = 0
        vcDict[status.channelId] = entry
    }
    logger.debug(vcDict)
}

//通話退出
function __leave_vc(status) {
    logger.debug("leave_vc");
    if (String(status.channelId) in vcDict) {
        let entry = vcDict[status.channelId]
        if (__getUserLen(status) == 0) {
            if (entry.members.size >= 2) {
                logger.debug(entry.totalTime)
                logger.debug(__getHMS(entry.totalTime))
                let mes = `${status.channel}の通話が終了しました\n>>> `
                mes += `通話時間:${__getHMS(entry.totalTime)}\n`
                mes += `参加人数:${entry.members.size}人\n`
                mes += "参加者:"
                membersArray = Array.from(entry.members)
                membersArray.forEach(member => {
                    logger.debug(member)
                    logger.debug(status.guild.members.cache.get(member).displayName)
                    mes += status.guild.members.cache.get(member).displayName + (member != membersArray[membersArray.length - 1] ? ", " : "")
                });
                messagepost.send_message(__getVoiceDefaultChannel(status), mes)
                delete vcDict[status.channelId]
            }
            delete vcDict[status.channelId]
        } else if (__getUserLen(status) == 1) {
            entry.totalTime += new Date() - entry.vcBeginTime
        }
    }
}

//時分秒,ミリ秒を返却
function __getHMS(tt) {
    let ms = tt % 1000
    tt = Math.trunc(tt / 1000)
    let s = tt % 60
    tt = Math.trunc(tt / 60)
    let m = tt % 60
    tt = Math.trunc(tt / 60)
    let h = tt
    let text = `${(h > 0 ? `${h}時間` : "")}${(m > 0 ? `${m}分` : "")}${s}.${ms}秒`
    return text
}

//BOT以外のユーザーの人数を返す関数
function __getUserLen(status) {
    let members = status.channel.members;
    let val = 0;
    members.forEach(member => {
        if (!member.user.bot) val++
    });
    return val;
}