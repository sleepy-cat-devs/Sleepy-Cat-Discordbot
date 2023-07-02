//options.js

//データファイルの読み込み，変更をするプログラムを集約

const fs = require("fs")

exports.version
exports.is_release
exports.client
exports.option_dir

exports.get_voice_default_channel = (guildid, channelid) => {
    //console.log(guildid, channelid)
    for (const vc_ch of this.guild_data[guildid]["GUILD_VOICE"]) {
        if (vc_ch["ch_id"] == channelid) {
            const ch = this.client.channels.cache.get(vc_ch["default_textchid"])
            return ch
        }
    }
}

exports.get_update = () => {
    return this.update
}

//TODO startupは名称から機能が推測できないため変更する
exports.initialize = () => {
    this.guild_data = {}
    //updateデータの読み込み
    this.update = JSON.parse(fs.readFileSync("./update.json", "utf8"))
    this.update = this.update["data"]

    let d = this.client.guilds.cache.map(a => [a.id, a.name])
    guild_list = []

    for (let i = 0; i < d.length; i++) {
        this.guild_data[d[i][0]] = {
            "guild_name": d[i][1]
        }
    }
    //サーバーリストの書き出し
    for (let i = 0; i < d.length; i++) {
        guild_list.push({
            "name": d[i][1],
            "id": d[i][0]
        })
    }
    console.log(this.option_dir + "/guilds_list.json\" is not found")
    fs.writeFileSync(this.option_dir + "/guilds_list.json", JSON.stringify(guild_list, null, 2))

    //サーバーデータの取得
    d = Object.keys(this.guild_data)
    for (let i = 0; i < d.length; i++) {
        //サーバーオプションデータの出力、データ取得済みチャンネルはパス
        if (fs.existsSync(this.option_dir + "/guilds/" + d[i] + ".json")) {
            console.log(this.option_dir + "/guilds/" + d[i] + ".json\" is found")
            this.guild_data[d[i]] = JSON.parse(fs.readFileSync(this.option_dir + "/guilds/" + d[i] + ".json", "utf8"))
        } else {
            console.log(this.option_dir + "/guilds/" + d[i] + ".json\" is not found")
            this.guild_data[d[i]]["GUILD_TEXT"] = []
            this.guild_data[d[i]]["GUILD_VOICE"] = []
            const guild = this.client.guilds.cache.get(d[i])
            const syschid = guild.systemChannelId
            const channels = guild.channels.cache.map(a => [a.type, a.id, a.name])
            console.dir(channels, { depth: 2 })
            for (let j = 0; j < channels.length; j++) {
                if (channels[j][0] == 0)
                    this.guild_data[d[i]]["GUILD_TEXT"].push({
                        "ch_id": channels[j][1],
                        "name": channels[j][2]
                    })
                else if (channels[j][0] == 2)
                    this.guild_data[d[i]]["GUILD_VOICE"].push({
                        "ch_id": channels[j][1],
                        "name": channels[j][2]
                    })
            }
            for (let j = 0; j < this.guild_data[d[i]]["GUILD_VOICE"].length; j++) {
                this.guild_data[d[i]]["GUILD_VOICE"][j]["default_textchid"] = syschid
            }
            fs.writeFileSync(this.option_dir + "/guilds/" + d[i] + ".json", JSON.stringify(this.guild_data[d[i]], null, 2))
        }
    }
}

//NOTE 変数の値をそのまま返す関数の必要性は疑わしい
exports.get_guild_list = () => {
    return guild_list
}

exports.guild_data_update = (guild_id) => {
    fs.writeFileSync(this.option_dir + "/guilds/" + String(guild_id) + ".json", JSON.stringify(this.guild_data[guild_id], null, 2))
}

exports.get_version = () => {
    return this.update[0]["ver"]
}

exports.channel_data_update = (type, channel_type, channel) => {
    let ch_data = {}
    ch_data["ch_id"] = channel.id
    ch_data["name"] = channel.name
    //チャンネル作成時
    if (type == 0) {
        //VCのみデフォルトの通知チャンネルを設定
        if (channel_type == "GUILD_VOICE") {
            ch_data["default_textchid"] = channel.guild.systemChannelId
        }
        this.guild_data[channel.guildId][channel_type].push(ch_data)
        console.log(channel.name, "を", channel_type, "として追加しました")
    }
    //チャンネル削除時
    else if (type == 1) {
        for (d of this.guild_data[channel.guildId][channel_type]) {
            if (d["ch_id"] == channel.id) {
                let del_d = d
                let index = this.guild_data[channel.guildId][channel_type].indexOf(del_d)
                this.guild_data[channel.guildId][channel_type].splice(index, 1)
            }
        }
        console.log(channel.name, "を", channel_type, "から削除しました")
    }
    this.guild_data_update(channel.guildId)
}

exports.get_channels = (guildid, channeltype) => {
    return this.guild_data[guildid][channeltype]
}
