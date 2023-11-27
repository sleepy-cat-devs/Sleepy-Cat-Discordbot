const fs = require("fs")
const yaml = require("js-yaml")
const cli_option = require("commander")
const { Client, GatewayIntentBits } = require("discord.js")

const consts = require("./consts")
const events = require("./events")
const logger = require("./logger").logger

exports.token = ""

/**
 * 起動時のオプション引数を取得する
 */
exports.set_cli_options = (options) => {
    // コマンドラインのオプション引数設定
    cli_option
        .option("-r, --release_mode", "リリースモードで起動します", false)
        .option("-d, --option_dir <optionValue>", "設定ディレクトリパスを指定", consts.DEFAULT_OPTION_DIR)

    cli_option.parse()

    const cli_option_val = cli_option.opts()
    options.is_release = cli_option_val.release_mode
    logger.info(`${options.is_release ? "リリース" : "テスト"}モードで起動開始`)

    options.option_dir = cli_option_val.option_dir
    options.client = null
}

/**
 * ボットの権限を設定し、クライアントのインスタンスを生成する
 */
exports.create_client = () => {
    // Discordクライアントを作成
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
    // eventsを全てclientに登録
    events.forEach(({ name, handler }) => client.on(name, handler))
    return client
}

/**
 * 設定ファイルの読み込み
 */
exports.load_settings_file = (bot_token_file_path) => {
    logger.info(`設定を次のファイルから取得します：${bot_token_file_path}`)

    try {
        const settings = fs.readFileSync(bot_token_file_path, "utf8")
        this.token = yaml.load(settings)["token"]
    } catch {
        logger.critical(`"${bot_token_file_path}"にBotのトークンを保存してください\n起動を中止します`)
        process.exit()
    }
}
