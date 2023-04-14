const {EmbedBuilder} = require('discord.js');

module.exports = {
	name: 'stop',
    category: 'Música',
	description: 'Detiene y remueve la lista de reproducción.',
	aliases: ['disconnect', 'detener'],
	async execute (message, args, bot) {
        let queue = await bot.player.nodes.get(message.guild);
        if (!queue) return message.channel.send(`**${message.author.username}**, no se está reproduciendo ninguna canción ahora mismo.`);

        let embed = new EmbedBuilder()
            .setColor(process.env.BOT_COLOR)
            .setAuthor({
                name: '💥 Expulsado'
            })
            .setDescription(`La lista se termina, **${message.author.username}** me sacó. 💢`);

        if (queue) {
            await queue.delete();
            message.channel.send({
                embeds: [embed]
            });
        }
	}
}
