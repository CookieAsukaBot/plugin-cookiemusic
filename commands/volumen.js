const {EmbedBuilder} = require('discord.js');
const Config = require('../controller/config.controller');
const clamp = require('../utils/clamp');

module.exports = {
	name: 'volumen',
    category: 'Música',
	description: 'Asigna o muestra el volumen de la música.',
    aliases: ['volume', 'v'],
    usage: '<opcional: valor del 1 al 100>',
	async execute (message, args, bot) {
        let queue = await bot.player.nodes.get(message.guild);
        let hasValue = clamp(parseInt(args[0]), 0, 100);

        if (queue) {

            let statusName, statusDescription;
            let embed = new EmbedBuilder()
                .setColor(process.env.BOT_COLOR);

            if (hasValue && hasValue != NaN) { // Mejorar comprobación de NaN
                // Actualizar local
                await queue.node.setVolume(hasValue);
                // Actualizar DB
                await Config.setVolumen(message.guild.id, hasValue);

                statusName = `🔼 Cambiando volumen`;
                statusDescription = `El volumen se asignó a **${hasValue}**. ✅`;
            } else {
                // Responder con el volúmen actual
                let config = await Config.getConfig(message.guild.id);

                statusName = `🧻 Mostrando volumen`;
                statusDescription = `El volumen se encuentra en **${config.volumen}**.`;
            }

            embed.setAuthor({
                name: statusName
            });
            embed.setDescription(statusDescription);

            message.channel.send({
                embeds: [embed]
            });
        } else {
            message.channel.send(`**${message.author.username}**, no hay ninguna canción reproduciendose.`);
        }
    }
}