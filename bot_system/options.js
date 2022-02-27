const fs = require("fs")

exports.version
exports.isrelease
exports.client
exports.optionsdir

exports.getvoicedefaultchannel = (guildid, channelid) => {
    console.log(guildid, channelid)
    for (const vc_ch of this.guild_data[guildid]["GUILD_VOICE"]) {
        if (vc_ch["ch_id"] == channelid) {
            const ch = this.client.channels.cache.get(vc_ch["default_textchid"])
            return ch
        }
    }
}

exports.getupdate = () => {
    return this.update
}

exports.startup = () => {

    this.guild_data = {}
    //updateデータの読み込み
    this.update = JSON.parse(fs.readFileSync('./update.json', 'utf8'))
    this.update = this.update["data"]

    let d = this.client.guilds.cache.map(a => [a.id, a.name])
    let guild_list = []

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
    if (fs.existsSync(this.optionsdir + "guilds_list.json")) { //ファイルの有無
        console.log(this.optionsdir + "guilds_list.json\" is found")
    } else {
        console.log(this.optionsdir + "guilds_list.json\" is not found")
        fs.writeFileSync(this.optionsdir + "guilds_list.json", JSON.stringify(guild_list, null, 2))
    }

    //サーバーデータの取得
    d = Object.keys(this.guild_data)
    for (let i = 0; i < d.length; i++) {
        //サーバーオプションデータの出力、データ取得済みチャンネルはパス
        if (fs.existsSync(this.optionsdir + "guilds/" + d[i] + ".json")) {
            console.log(this.optionsdir + "guilds/" + d[i] + ".json\" is found")
            this.guild_data[d[i]] = JSON.parse(fs.readFileSync(this.optionsdir + "guilds/" + d[i] + ".json", 'utf8'))
            //console.log(this.guild_data)
            break
        } else {
            console.log(this.optionsdir + "guilds/" + d[i] + ".json\" is not found")
            this.guild_data[d[i]]["GUILD_TEXT"] = []
            this.guild_data[d[i]]["GUILD_VOICE"] = []
            const guild = this.client.guilds.cache.get(d[i])
            const syschid = guild.systemChannelId
            const channels = guild.channels.cache.map(a => [a.type, a.id, a.name])
            //console.log(channels)
            for (let j = 0; j < channels.length; j++) {
                if (channels[j][0] == "GUILD_TEXT")
                    this.guild_data[d[i]]["GUILD_TEXT"].push({
                        "ch_id": channels[j][1],
                        "name": channels[j][2]
                    })
                else if (channels[j][0] == "GUILD_VOICE")
                    this.guild_data[d[i]]["GUILD_VOICE"].push({
                        "ch_id": channels[j][1],
                        "name": channels[j][2]
                    })
            }
            for (let j = 0; j < this.guild_data[d[i]]["GUILD_VOICE"].length; j++) {
                this.guild_data[d[i]]["GUILD_VOICE"][j]["default_textchid"] = syschid
            }
            fs.writeFileSync(this.optionsdir + "guilds/" + d[i] + ".json", JSON.stringify(this.guild_data[d[i]], null, 2))
        }

    }
}