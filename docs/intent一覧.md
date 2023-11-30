# intent一覧

* ボットが持つDiscordに対する権限の指定
  * [公式ガイド](https://discord.com/developers/docs/topics/gateway#gateway-intents)
* [options.js](../bot_system/options.js)のcreate_client()で指定
* discord.jsのGatewayIntentBitsから取得して指定する

| 名称                   | 内容                                 |
| :--------------------- | :----------------------------------- |
| Guilds                 | サーバー設定の取得                   |
| GuildMembers           | サーバー所属メンバーの取得           |
| GuildMessages          | メッセージ投稿                       |
| GuildMessageReactions  | メッセージへのリアクション付与       |
| GuildVoiceStates       | ボイスチャットの状態                 |
| DirectMessages         | ダイレクトメッセージ                 |
| DirectMessageReactions | ダイレクトメッセージへのリアクション |
| MessageContent         | メッセージ本文の取得                 |
