const sqlite3 = require("sqlite3")
const praxi_db = new sqlite3.Database("./praxi.db")

const { DB_SIMPLIFIER, M_SERVERS, M_NOTIFY_CHANNELS } = require("./db_const")


// TODO テーブルの初期化
exports.create_tables = () => {
    praxi_db.serialize(() => {
        for (const setting of DB_SIMPLIFIER.db_settings()) {
            praxi_db.run(setting)
        }
        praxi_db.run(DB_SIMPLIFIER.create_table(M_SERVERS))
        praxi_db.run(DB_SIMPLIFIER.create_table(M_NOTIFY_CHANNELS))
    })
}

// TODO サーバー一覧の同期処理
exports.sync_joined_servers = (server_ids) => {
    // TODO 除外されたサーバーがあった場合、通知チャンネル一覧から関連のエントリーをすべて削除する
    praxi_db.serialize(() => {
        for (const server_id of server_ids) {
            praxi_db.run(...M_SERVERS.add_server(server_id))
        }
    })
}

// TODO 通知チャンネルの変更
exports.update_notify_ch = (voice_ch, text_ch) => {
    guild_id = voice_ch.guildId
    ch_id = voice_ch.id
    notify_ch_id = text_ch.id
}

// TODO 通知チャンネルの取得
exports.get_notify_text_ch_id = (voice_ch) => {
    ch_id = voice_ch.id
}

/**
 * ボイスチャットをテーブルに追加する
 * @param {*} voice_ch ボイスチャンネルのインスタンス
 */
exports.voice_ch_created = (voice_ch) => {
    guild_id = voice_ch.guildId
    ch_id = voice_ch.id
    notify_ch_id = voice_ch.g.systemChannelId
    praxi_db.serialize(() => {
        praxi_db.get(
            ...M_SERVERS.get_server_id(guild_id, (err, row) => {
                if (err || row === undefined) {
                    // TODO エラーログ
                    return
                }
                praxi_db.run(...M_NOTIFY_CHANNELS.add_voice_ch(ch_id, notify_ch_id, row.id))
            })
        )
    })
}

// TODO ボイスチャンネル削除時の処理
exports.voice_ch_deleted = (voice_ch) => {
    ch_id = voice_ch.id
    praxi_db.serialize(() => {
        praxi_db.run(...M_NOTIFY_CHANNELS.del_voice_ch(ch_id, err => { }))
    })
}

// TODO 通知設定一覧の取得
exports.get_notify_settings = () => {
}

praxi_db.serialize(() => {
    this.create_tables()
    this.sync_joined_servers(["ABC", "DEF"])
    voice_ch = {
        guildId: "DEF",
        id: "beta",
        g: { systemChannelId: "hoge" }
    }
    this.voice_ch_created(voice_ch)
})
