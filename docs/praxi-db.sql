-- Praxi用テーブル初期化DDL(SQLite向け)

-- ボイスチャンネルとテキストチャンネルの対応関係のみ記録する形式

-- 外部キー制約を有効化
PRAGMA foreign_keys=true;

-- ギルドテーブルを作成
CREATE TABLE guilds(
    id text primary key
);

-- ボイチャの通知テキストチャンネル指定テーブル
CREATE TABLE notify_channels(
    voice_channel_id text primary key,
    text_channel_id text not null,
    guild_id text not null,
    foreign key (guild_id) references guilds(id) 
);