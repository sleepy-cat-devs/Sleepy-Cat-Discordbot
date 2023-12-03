/**index.js
 * botのmainプログラム
 * 起動時に実行するファイル
**/

const options = require("./bot_system/options")

// コマンドライン引数の読み込み
if (!options.get_cli_options()) {
    process.exit()
}

// 設定ファイルの読み込み
if (!options.load_settings_file()) {
    process.exit()
}

options.create_client()
