const fs = require("fs")
const yaml = require("js-yaml")
const cli_option = require("commander")

const options = require("./options")
const consts = require("./consts")
const events = require("./events")
const logger = require("./logger").logger

exports.load_cli = () => {
    // コマンドラインのオプション引数設定
    cli_option
        .option("-r, --release_mode", "リリースモードで起動します", false)
        .option("-d, --option_dir <optionValue>", "設定ディレクトリパスを指定", consts.DEFAULT_OPTION_DIR)

    cli_option.parse()

    const cli_option_val = cli_option.opts()
    options.is_release = cli_option_val.is_release
    logger.info(`${options.is_release ? "リリース" : "テスト"}モードで起動します`)

    options.option_dir = cli_option_val.option_dir
    options.client = null
}

exports.create_client = () => {
    // Discordクライアントを作成
    const { Client, GatewayIntentBits } = require("discord.js")
    options.client = new Client({
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
    events.forEach(({ name, handler }) => options.client.on(name, handler))
}

exports.load_settings_file = () => {
    logger.info(`設定を次のディレクトリから取得します：${options.option_dir}`)

    let bot_token_file_path = options.parse_option_path(consts.SETTING_FILENAME)

    const settings = fs.readFileSync(bot_token_file_path, "utf8")
    const token = yaml.load(settings)["token"]
    options.client.login(token)
    try {
        const settings = fs.readFileSync(bot_token_file_path, "utf8")
        const token = yaml.load(settings)["token"]
        // トークンを使ってDiscordにログイン
        options.client.login(token)
    } catch {
        logger.warn(`"${bot_token_file_path}"にBotのトークンを保存してください`)
        process.exit()
    }
    //フォルダの自動生成
    let guilds_option_dir_path = options.parse_option_path(consts.GUILDS_DIRNAME)
    if (!fs.existsSync(guilds_option_dir_path)) {
        fs.mkdirSync(guilds_option_dir_path, {
            recursive: true,
        })
    }
}
