//escape.js

//メッセージのMDエスケープ
//一部のMD記法（# や -# 始動) が discord.js の escapeMarkdown で処理できないため、独自で実装

const { escapeMarkdown } = require("discord.js")

exports.escapeHeaders = (text) => {
    return text
        .replaceAll(/^#/g, '\\#')
        .replaceAll(/^-#/g, '\\-#')
}

exports.escapeAllMarkdown = (text) => this.escapeHeaders(escapeMarkdown(text))
