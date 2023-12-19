class db_simplifier {
    static db_settings() {
        return ["PRAGMA foreign_keys=true"]
    }

    static create_table(table) {
        return `CREATE TABLE IF NOT EXISTS ${table.SCHEMA}`
    }
}

class m_servers {
    static get NAME() {
        return "m_servers"
    }
    static get KEYS() {
        return {
            ID: "id",
            GUILD_REAL_ID: "guild_real_id"
        }
    }
    static get SCHEMA() {
        return `${this.NAME}(
            ${this.KEYS.ID} integer primary key autoincrement,
            ${this.KEYS.GUILD_REAL_ID} text not null unique
        );`
    }
    static get QUERY() {
        return {
            INSERT: `INSERT INTO ${this.NAME}(${this.KEYS.GUILD_REAL_ID}) values($guild_real_id) ON CONFLICT(${this.KEYS.GUILD_REAL_ID}) DO NOTHING`,
            SELECT: `SELECT ${this.KEYS.ID} from ${this.NAME} WHERE ${this.KEYS.GUILD_REAL_ID} == $guild_real_id`
        }
    }
    static add_server(server_id, func = err => { }) {
        return [this.QUERY.INSERT, { $guild_real_id: server_id }, func]
    }
}

class m_notify_channels {
    static get NAME() {
        return "m_notify_channels"
    }
    static get KEYS() {
        return {
            VOICE_ID: "voice_id",
            TEXT_ID: "text_id",
            SERVER_ID: "server_id",
            IS_NOTIFY: "is_notify"
        }
    }
    static get SCHEMA() {
        return `${this.NAME}(
            ${this.KEYS.VOICE_ID} text primary key,
            ${this.KEYS.TEXT_ID} text not null,
            ${this.KEYS.SERVER_ID} integer not null,
            ${this.KEYS.IS_NOTIFY} integer default 1,
            foreign key (server_id) references m_servers(id)
        );`
    }
    static get QUERY() {
        return {
            INSERT: `INSERT INTO ${this.NAME} (${this.KEYS.VOICE_ID}, ${this.KEYS.TEXT_ID}, ${this.KEYS.SERVER_ID}) VALUES ($voice_id, $text_id, (${m_servers.QUERY.SELECT})) ON CONFLICT (${this.KEYS.VOICE_ID}) DO NOTHING`,
            UPDATE: `UPDATE ${this.NAME} SET ${this.KEYS.TEXT_ID} = $text_id WHERE ${this.KEYS.VOICE_ID} = $voice_id`,
            DELETE: `DELETE from ${this.NAME} WHERE ${this.KEYS.VOICE_ID} = $voice_ch`
        }
    }
    static add_voice_ch(ch_id, notify_ch_id, server_real_id, func = err => { }) {
        return [this.QUERY.INSERT, { $voice_id: ch_id, $text_id: notify_ch_id, $guild_real_id: server_real_id }, func]
    }
    static update_notify_ch(ch_id, notify_ch_id, func = err => { }) {
        return [this.QUERY.UPDATE, { $voice_id: ch_id, $text_id: notify_ch_id }, func]
    }
    static del_voice_ch(ch_id, func = err => { }) {
        return [this.QUERY.DELETE, { $voice_id: ch_id }, func]
    }
}


module.exports = {
    DB_SIMPLIFIER: db_simplifier,
    M_SERVERS: m_servers,
    M_NOTIFY_CHANNELS: m_notify_channels
}
