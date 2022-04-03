const Discord = require("discord.js")
const options = require("./options.js")

exports.send_message = (channel, mes) => {
    if(!options.isrelease){
        //テスト中はコンソールにログが出る
        console.log("チャンネル："+channel+"\n"+mes+" を投稿しようとしました")
    }else{
        channel.send(mes)
    }
}