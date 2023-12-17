class db_simplifier {
    static get FOREIGN_KEYS() {
        return "PRAGMA foreign_keys=true"
    }

    static get PREFIX_NEW_TABLE() {
        return "CREATE TABLE IF NOT EXISTS"
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
    static get SHORT() {
        return {
            INSERT: `${this.NAME}(${this.KEYS.VOICE_ID}, ${this.KEYS.TEXT_ID}, ${this.KEYS.SERVER_ID}) values (?, ?, ?)`
        }
    }
}


module.exports = {
    DB_SIMPLIFIER: db_simplifier,
    M_SERVERS: m_servers,
    M_NOTIFY_CHANNELS: m_notify_channels
}
