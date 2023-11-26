//options.js

//データファイルの読み込み，変更をするプログラムを集約

const { ChannelType } = require("discord.js")
const yaml = require("js-yaml")
const fs = require("fs")
const path = require("path")

const consts = require("./consts")
const logger = require("./logger").logger

const GUILD_TEXT = "GUILD_TEXT"
const GUILD_VOICE = "GUILD_VOICE"
let CHANNEL_TYPE_DICT = {}
CHANNEL_TYPE_DICT[ChannelType.GuildText] = GUILD_TEXT
CHANNEL_TYPE_DICT[ChannelType.GuildVoice] = GUILD_VOICE

const DEFAULT_TEXTCHID = "default_textchid"

logger.debug(CHANNEL_TYPE_DICT)

// 実行時定数
exports.version
exports.is_release
exports.client
exports.option_dir

// 更新内容ファイル
exports.update

// 参加したDiscordサーバーの一覧
exports.guild_list = []

exports.get_voice_default_channel = (guildid, channelid) => {
    for (const vc_ch of this.guild_data[guildid][GUILD_VOICE]) {
        if (vc_ch["ch_id"] == channelid) {
            const ch = this.client.channels.cache.get(vc_ch[DEFAULT_TEXTCHID])
            return ch
        }
    }
}

exports.initialize = () => {
    this.guild_data = {}
    //ボット更新情報の読み込み
    this.update = yaml.load(fs.readFileSync(this.parse_option_path(consts.UPDATE_FILENAME), "utf8"))

    this.version = this.get_version()

    this.guild_list = this.client.guilds.cache.map(a => [a.id, a.name])

    for (const g of this.guild_list) {
        this.guild_data[g[0]] = { "guild_name": g[1] }
    }

    //guildsフォルダの自動生成
    let guilds_option_dir_path = this.parse_option_path(consts.GUILDS_DIRNAME)
    if (!fs.existsSync(guilds_option_dir_path)) {
        fs.mkdirSync(guilds_option_dir_path, {
            recursive: true,
        })
    }

    // ボットが参加しているサーバー一覧のファイルを保存
    const guilds_list_file_path = this.parse_option_path(consts.GUILDS_FILENAME)
    fs.writeFileSync(guilds_list_file_path, JSON.stringify(this.guild_list, null, 2))

    for (const g_id in this.guild_data) {
        const guild_channels_file_path = this.parse_option_path(consts.GUILDS_DIRNAME, `${g_id}.json`)
        const target_guild = this.guild_data[g_id]

        // サーバーに存在するチャンネル一覧の取得
        target_guild[GUILD_TEXT] = []
        target_guild[GUILD_VOICE] = []

        let saved_voicech_setting = {}

        if (fs.existsSync(guild_channels_file_path)) {
            // ボイスチャット設定済みのチャンネルを読み込み
            logger.debug(`${guild_channels_file_path}から設定済みのチャンネル一覧を読み込みます`)
            const voice_chs = JSON.parse(fs.readFileSync(guild_channels_file_path, "utf8"))[GUILD_VOICE]
            for (const voice_ch of voice_chs) {
                // 保存されたファイルの設定を取得
                saved_voicech_setting[voice_ch["ch_id"]] = voice_ch[DEFAULT_TEXTCHID]
            }
        } else {
            logger.debug(`${guild_channels_file_path}は存在しません`)
        }

        const guild = this.client.guilds.cache.get(g_id)
        const system_ch_id = guild.systemChannelId
        // JSONファイル内の形式のの変換処理まで一気にできそうな気がするが
        // NOTE sqliteでの管理に変更予定（別ブランチ）
        const channels = guild.channels.cache.map(ch => { return { ch_type: ch.type, ch_id: ch.id, ch_name: ch.name } })

        for (const ch of channels) {
            const ch_type_str = String(ch["ch_type"])
            if (!(ch_type_str in CHANNEL_TYPE_DICT)) {
                continue
            }
            ch_type_text = CHANNEL_TYPE_DICT[ch_type_str]
            let ch_entry = {
                ch_id: ch["ch_id"],
                name: ch["ch_name"]
            }
            if (ch_type_text !== GUILD_VOICE) {
                // デフォルトの通知先はシステムチャンネル（generalなど）を指定
                ch_entry[DEFAULT_TEXTCHID] = system_ch_id
                if (ch["ch_id"] in saved_voicech_setting) {
                    // ファイルに保存されている内容がある場合はそのままコピー
                    ch_entry[DEFAULT_TEXTCHID] = saved_voicech_setting[ch["ch_id"]]
                }
            }

            target_guild[ch_type_text].push(ch_entry)
        }

        // 更新済みの設定ファイルを保存
        fs.writeFileSync(guild_channels_file_path, JSON.stringify(target_guild, null, 2))
    }
    logger.debug(this.guild_data)
}

exports.guild_data_update = (guild_id) => {
    fs.writeFileSync(this.parse_option_path(consts.GUILDS_DIRNAME, `${guild_id}.json`), JSON.stringify(this.guild_data[guild_id], null, 2))
}

exports.get_version = () => {
    return this.update[0]["ver"]
}

//NOTE  作成と削除で別々の関数にするべきでは
exports.channel_data_update = (type, channel_type, channel) => {
    let ch_data = {}
    ch_data["ch_id"] = channel.id
    ch_data["name"] = channel.name
    //チャンネル作成時
    if (type == "Create") {
        //VCのみデフォルトの通知チャンネルを設定
        if (channel_type == GUILD_VOICE) {
            ch_data[DEFAULT_TEXTCHID] = channel.g.systemChannelId
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

exports.parse_option_path = (...paths) => {
    let joined_path = this.option_dir
    paths.forEach(function (element) {
        joined_path = path.join(joined_path, element)
    })
    console.log(joined_path)
    return joined_path
}