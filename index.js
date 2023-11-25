/**index.js
 * botのmainプログラム
 * 起動時に実行するファイル
**/
const fs = require("fs")
const yaml = require("js-yaml")
const cli_option = require("commander")
const log4js = require("log4js")

const logger = log4js.getLogger()

const events = require("./bot_system/event")
const options = require("./bot_system/options")

const DEFAULT_OPTION_DIR = "/praxi"

// コマンドラインのオプション引数設定
cli_option
    .option("-r, --release_mode", "リリースモードで起動します", false)
    .option("-d, --option_dir <optionValue>", "設定ディレクトリパスを指定", DEFAULT_OPTION_DIR)

cli_option.parse()
const cli_option_val = cli_option.opts()

options.is_release = cli_option_val.is_release
options.option_dir = cli_option_val.option_dir
options.client = null

logger.info(`${options.is_release ? "リリース" : "テスト"}モードで起動しました`)

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
        GatewayIntentBits.MessageContent
    ],
})
options.client = client

// eventsを全てclientに登録
events.forEach(({ name, handler }) => client.on(name, handler))

logger.info(`設定を次のディレクトリから取得します：${options.option_dir}`)

let bot_token_file_path = options.option_dir + "/settings.yml"
try {
    const settings = fs.readFileSync(bot_token_file_path, "utf8")
    const token = yaml.load(settings)["token"]
    // トークンを使ってDiscordにログイン
    client.login(token)
} catch {
    // 設定ファイルの読み込みに失敗した場合
    fs.writeFileSync(bot_token_file_path, "")
    logger.warn(`"${bot_token_file_path}"にBotのトークンを保存してください`)
    process.exit()
}
//フォルダの自動生成
let guilds_option_dir_path = options.option_dir + "/guilds"
if (!fs.existsSync(guilds_option_dir_path)) {
    fs.mkdirSync(guilds_option_dir_path, {
        recursive: true,
    })
}
