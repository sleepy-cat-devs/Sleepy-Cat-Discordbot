/**index.js
 * botのmainプログラム
 * 起動時に実行するファイル
**/
const consts = require("./bot_system/consts")
const initializer = require("./bot_system/initializer")
const options = require("./bot_system/options")

initializer.set_cli_options(options)

options.client = initializer.create_client()

initializer.load_settings_file(options.parse_option_path(consts.SETTING_FILENAME))

// トークンを使用してログイン
options.client.login(initializer.token)