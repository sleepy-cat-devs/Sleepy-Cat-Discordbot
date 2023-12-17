const sqlite3 = require("sqlite3")
const praxi_db = new sqlite3.Database("./praxi.db")

const { DB_SIMPLIFIER, M_SERVERS, M_NOTIFY_CHANNELS } = require("./db_const")


// TODO 登録データ一覧の表示
exports.show_all_entry = () => {
}

// TODO テーブルの初期化
exports.create_tables = () => {
    praxi_db.serialize(() => {
        praxi_db.run(DB_SIMPLIFIER.FOREIGN_KEYS)
        praxi_db.run(`${DB_SIMPLIFIER.PREFIX_NEW_TABLE} ${M_SERVERS.SCHEMA}`)
        praxi_db.run(`${DB_SIMPLIFIER.PREFIX_NEW_TABLE} ${M_NOTIFY_CHANNELS.SCHEMA}`)
    })
}

// TODO サーバー一覧の同期処理
exports.sync_joined_servers = (server_ids) => {
    // TODO 除外されたサーバーがあった場合、通知チャンネル一覧から関連のエントリーをすべて削除する
    praxi_db.serialize(() => {
        for (const server_id of server_ids) {
            praxi_db.run(`INSERT INTO ${M_SERVERS.NAME}(${M_SERVERS.KEYS.GUILD_REAL_ID}) values(?) ON CONFLICT(${M_SERVERS.KEYS.GUILD_REAL_ID}) DO NOTHING;`, server_id)
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
        praxi_db.get("SELECT * from m_servers WHERE guild_real_id == ?", [guild_id],)
        praxi_db.get(`SELECT * from ${M_SERVERS.NAME} WHERE ${M_SERVERS.KEYS.GUILD_REAL_ID} == ?`, [guild_id], (err, row) => {
            if (err || row === undefined) {
                // TODO エラーログ
                return
            }
            praxi_db.run(`INSERT INTO ${M_NOTIFY_CHANNELS.SHORT.INSERT} ON CONFLICT (${M_NOTIFY_CHANNELS.KEYS.VOICE_ID}) DO NOTHING;`, ch_id, notify_ch_id, row.id)
        })
    })
}

// TODO ボイスチャンネル削除時の処理
exports.voice_ch_deleted = (voice_ch) => {
    ch_id = voice_ch.id
    console.log(ch_id)
    praxi_db.serialize(() => {
        praxi_db.run(`DELETE from ${M_NOTIFY_CHANNELS.NAME} WHERE ${M_NOTIFY_CHANNELS.KEYS.VOICE_ID} = ?`, ch_id, err => {
        })
    })
}

// TODO 通知設定一覧の取得
exports.get_notify_settings = () => {
}

praxi_db.serialize(() => {
    voice_ch = {
        guildId: "DEF",
        id: "beta",
        g: { systemChannelId: "hoge" }
    }
    this.voice_ch_deleted(voice_ch)
})
