const {shuffle} = require('../controller/music.controller');

module.exports = {
	name: 'shuffle',
    category: 'Música',
	description: 'La lista de canciones se reproducirán en un orden aleatorio.',
    cooldown: 3,
	async execute (message, args, bot) {
        let queue = await bot.player.nodes.get(message.guild);
        if (!queue) return message.channel.send(`**${message.author.globalName}**, no se está reproduciendo ninguna canción ahora mismo.`);

        await queue.tracks.shuffle();

        message.channel.send({
            embeds: [shuffle()]
        });
	}
}
