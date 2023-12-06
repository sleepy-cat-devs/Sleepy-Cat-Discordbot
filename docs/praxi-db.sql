-- Praxi用テーブル初期化DDL(SQLite向け)

-- ボイスチャンネルとテキストチャンネルの対応関係のみ記録する形式

-- 外部キー制約を有効化
PRAGMA foreign_keys=true;

-- サーバーテーブルを作成
CREATE TABLE m_servers(
    id integer primary key,
    guild_real_id text not null
);

-- ボイチャの通知テキストチャンネル指定テーブル
CREATE TABLE m_notify_channels(
    voice_id text primary key,
    text_id text not null,
    server_id integer not null,
    is_notify integer default 1,
    foreign key (server_id) references m_servers(id) 
);
