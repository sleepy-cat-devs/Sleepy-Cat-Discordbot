//messagepost.js

//botのテスト時，テキストを送信する代わりにコンソールに出力
//コマンド処理になってきているので使われることはほぼない

const options = require("./options")
const logger = require("./logger").logger

exports.send_message = (channel, mes) => {
    if (!options.is_release) {
        //テスト中はコンソールにログが出る
        logger.debug("チャンネル：" + channel + "\n" + mes + " を投稿しようとしました")
    } else if(channel !== undefined){
        channel.send(mes)
    }
}