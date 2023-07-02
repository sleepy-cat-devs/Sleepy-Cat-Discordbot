//messagepost.js

//botのテスト時，テキストを送信する代わりにコンソールに出力
//コマンド処理になってきているので使われることはほぼない

const options = require("./options")

exports.send_message = (channel, mes) => {
    if (options.isrelease && channel !== undefined) {
        channel.send(mes)
    } else {
        //テスト中はコンソールにログが出る
        console.log(`チャンネル:${channel===undefined?"未定義":channel}\nメッセージ:${mes}を投稿しようとしました`)
    }
}