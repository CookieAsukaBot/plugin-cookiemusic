const {embedCurrentTrack} = require('../utils/embeds');

module.exports = {
	name: 'playing',
    category: 'Música',
	description: 'Info. de la canción que se está reproduciendo.',
    aliases: ['nowplaying', 'currentsong', 'shazam'],
	async execute (message, args, bot) {
        let queue = await bot.player.nodes.get(message.guild);
        if (!queue) return message.channel.send(`**${message.author.username}**, no se está reproduciendo ninguna canción ahora mismo.`);

        if (queue.node.isPlaying()) {
            message.channel.send({
                embeds: [embedCurrentTrack(queue)]
            });
        } else {
            message.channel.send(`**${message.author.username}**, no hay ninguna canción reproduciéndose.`);
        }
	}
}
