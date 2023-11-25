/**index.js
 * botのmainプログラム
 * 起動時に実行するファイル
**/
const initializer = require("./bot_system/initializer")

initializer.load_cli()
initializer.create_client()
initializer.load_settings_file()