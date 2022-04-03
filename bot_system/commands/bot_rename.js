module.exports = {
    command: {
        name: "bot_rename",
        description: "botニックネームの変更",
        options: [{
            type: "STRING",
            name: "name",
            description: "\"ニックネーム\" を入力",
            required: true
        }]
    }
}