//options.js

//データファイルの読み込み，変更をするプログラムを集約

const { ChannelType } = require("discord.js")
const fs = require("fs")

exports.version
exports.is_release
exports.client
exports.option_dir

exports.update

exports.guild_list = []

exports.get_voice_default_channel = (guildid, channelid) => {
    for (const vc_ch of this.guild_data[guildid]["GUILD_VOICE"]) {
        if (vc_ch["ch_id"] == channelid) {
            const ch = this.client.channels.cache.get(vc_ch["default_textchid"])
            return ch
        }
    }
}

//TODO startupは名称から機能が推測できないため変更する
exports.initialize = () => {
    this.guild_data = {}
    //updateデータの読み込み
    this.update = JSON.parse(fs.readFileSync("./update.json", "utf8"))["data"]

    let d = this.client.guilds.cache.map(a => [a.id, a.name])

    for (let i = 0; i < d.length; i++) {
        this.guild_data[d[i][0]] = {
            "guild_name": d[i][1]
        }
    }
    //サーバーリストの書き出し
    for (let i = 0; i < d.length; i++) {
        this.guild_list.push({
            "name": d[i][1],
            "id": d[i][0]
        })
    }

    // ボットが参加しているサーバー一覧のファイルを保存
    const guilds_list_file_path = `${this.option_dir}/guilds_list.json`
    fs.writeFileSync(guilds_list_file_path, JSON.stringify(this.guild_list, null, 2))

    //サーバーデータの取得
    d = Object.keys(this.guild_data)
    for (let i = 0; i < d.length; i++) {
        //サーバーオプションデータの出力、データ取得済みチャンネルはパス
        const guild_channels_file_path = `${this.option_dir}/guilds/${d[i]}.json`
        if (fs.existsSync(guild_channels_file_path)) {
            console.log(`${guild_channels_file_path} is found`)

            this.guild_data[d[i]] = JSON.parse(fs.readFileSync(guild_channels_file_path, "utf8"))
        } else {
            console.log(`${guild_channels_file_path} is not found`)

            this.guild_data[d[i]]["GUILD_TEXT"] = []
            this.guild_data[d[i]]["GUILD_VOICE"] = []

            const guild = this.client.guilds.cache.get(d[i])
            const syschid = guild.systemChannelId
            const channels = guild.channels.cache.map(ch => { return { ch_type: ch.type, ch_id: ch.id, ch_name: ch.name } })
            // console.log(guild.channels.cache)
            console.dir(channels, { depth: 2 })

            for (let j = 0; j < channels.length; j++) {
                let channel_type_text = null;
                switch (channels[j]["ch_type"]) {
                    case ChannelType.GuildText:
                        channel_type_text = "GUILD_TEXT"
                        break
                    case ChannelType.GuildVoice:
                        channel_type_text = "GUILD_VOICE"
                        break
                }

                if (channel_type_text != null) {
                    this.guild_data[d[i]][channel_type_text].push({
                        "ch_id": channels[j]["ch_id"],
                        "name": channels[j]["ch_name"]
                    })
                }
            }
            for (let j = 0; j < this.guild_data[d[i]]["GUILD_VOICE"].length; j++) {
                this.guild_data[d[i]]["GUILD_VOICE"][j]["default_textchid"] = syschid
            }
            fs.writeFileSync(guild_channels_file_path, JSON.stringify(this.guild_data[d[i]], null, 2))
        }
    }
    console.log(this.guild_data)
}

exports.guild_data_update = (guild_id) => {
    fs.writeFileSync(this.option_dir + "/guilds/" + String(guild_id) + ".json", JSON.stringify(this.guild_data[guild_id], null, 2))
}

exports.get_version = () => {
    return this.update[0]["ver"]
}

//NOTE  作成と削除で別々の関数にするべき
exports.channel_data_update = (type, channel_type, channel) => {
    let ch_data = {}
    ch_data["ch_id"] = channel.id
    ch_data["name"] = channel.name
    //チャンネル作成時
    if (type == "Create") {
        //VCのみデフォルトの通知チャンネルを設定
        if (channel_type == "GUILD_VOICE") {
            ch_data["default_textchid"] = channel.guild.systemChannelId
        }
        this.guild_data[channel.guildId][channel_type].push(ch_data)
        console.log(channel.name, "を", channel_type, "として追加しました")
    }
    //チャンネル削除時
    else if (type == "Delete") {
        const ch_index = this.guild_data[channel.guildId][channel_type].map(ch => ch["ch_id"]).indexOf(channel.id)
        if (ch_index != -1) {
            this.guild_data[channel.guildId][channel_type].splice(ch_index, 1)
        }
        console.log(`${channel.name}を${channel_type}から削除しました`)
    }
    this.guild_data_update(channel.guildId)
}

exports.get_channels = (guildid, channeltype) => {
    return this.guild_data[guildid][channeltype]
}
