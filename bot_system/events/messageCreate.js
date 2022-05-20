const name = 'messageCreate'

const Discord = require("discord.js")

const options = require("../options")

const handler = (message) => {
    if (message.system || message.author.bot)
        return
    let mes = `${message.author.tag} in #${message.channel.name} sent: ${message.content}`
    console.log(mes)

    //update内容の表示
    if (message.content === "!update") {
        const update = options.getupdate()
        if (update.length == 0)
            return
        const e = new Discord.MessageEmbed()
            .setTitle("update内容")
            .setThumbnail("https://cdn.discordapp.com/app-icons/634786736664477706/12d661873400eb964fb20a6447732488.png?size=64")
        let j = 3;
        for (let i = Math.max(0, update.length - 3); i < update.length; i++) {
            if (j == 0)
                break
            let date = String(update[i - 1]["date"][0]) + "/" + String(update[i]["date"][1]) + "/" + String(update[i]["date"][2])
            mes = ""
            for (let k = 0; k < update[i]["text"].length; k++) {
                mes += update[i]["text"][k]
                if (k != update[i].length - 1)
                    mes += "\n"
            }
            e.addField(date, mes, false)
            j--
        }
        message.channel.send({
            embeds: [e]
        })
        return
    }

    //botのニックネーム変更

    //メンション時応答
    if (message.mentions.has(options.client.user.id)) {
        message.channel.send("<@!" + message.member.id + ">：眠いからまたあとにしてにゃ")
    }

    //message.channel.send(mes)
}

module.exports = {
    name,
    handler
}