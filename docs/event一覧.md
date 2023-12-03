# event一覧

* ボットが検出するDiscordで発生したイベント
  * [公式ガイド](https://discord.com/developers/docs/topics/gateway-events)
* [eventsディレクトリ](../bot_system/events/)配下で定義し、[events.js](../bot_system/events.js)でとりまとめ、[options.js](../bot_system/options.js)で適用している

| event名称        | トリガ                      |
| :--------------- | :-------------------------- |
| ready            | ボットがDiscordに接続された |
| voiceStateUpdate | ボイスチャットの状態変化    |
| messageCreate    | メッセージの投稿            |
| channelCreate    | チャンネルの新規作成        |
| channelDelete    | チャンネルの削除            |
