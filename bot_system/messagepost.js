//messagepost.js

//botのテスト時，テキストを送信する代わりにコンソールに出力
//コマンド処理になってきているので使われることはほぼない

const options = require("./options")

exports.send_message = (channel, mes) => {
    if (!options.isrelease) {
        //テスト中はコンソールにログが出る
        console.log("チャンネル：" + channel + "\n" + mes + " を投稿しようとしました")
    } else {
        channel.send(mes)
    }
}