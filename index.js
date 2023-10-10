/**index.js
 * botのmainプログラム
 * 起動時に実行するファイル
**/

const fs = require("fs")

const events = require("./bot_system/event")
const options = require("./bot_system/options")

const DEFAULT_OPTION_DIR = require("os").homedir() + "/Documents/Discord_App/Praxi"

// コマンドラインのオプション引数設定
const cli_option = require("commander")
cli_option
    .option("-r, --release_mode", "リリースモードで起動します", false)
    .option("-d, --option_dir <optionValue>", "設定ディレクトリパスを指定", DEFAULT_OPTION_DIR)

cli_option.parse()
const cli_option_val = cli_option.opts()

options.is_release = cli_option_val.is_release
options.option_dir = cli_option_val.option_dir
options.client = null

console.log(`${options.is_release ? "リリース" : "テスト"}モードで起動しました`)

// 新しいDiscordクライアントを作成
const { Client, GatewayIntentBits } = require("discord.js")
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
    ],
})
options.client = client

// eventsを全てclientに登録
events.forEach(({ name, handler }) => client.on(name, handler))

console.log(`設定を次のディレクトリから取得します：${options.option_dir}`)

let bot_token_file_path = options.option_dir + "/token"
//tokenファイルの有無確認
if (!fs.existsSync(bot_token_file_path)) {
    fs.writeFileSync(bot_token_file_path, "")
    console.log(`"${bot_token_file_path}"にBotのトークンを保存してください`)
    process.exit()
} else {
    const token = fs.readFileSync(bot_token_file_path, "utf8")
    // トークンを使ってDiscordにログイン
    client.login(token)
}
//フォルダの自動生成
let guilds_option_dir_path = options.option_dir + "/guilds"
if (!fs.existsSync(guilds_option_dir_path)) {
    fs.mkdirSync(guilds_option_dir_path, {
        recursive: true,
    })
}
