const {pause} = require('../controller/music.controller');

module.exports = {
	name: 'pause',
    category: 'Música',
	description: 'Pausa o reanuda la canción.',
    aliases: ['resume', 'reanudar', 'pausar'],
    cooldown: 1,
	async execute (message, args, bot) {
        let queue = await bot.player.nodes.get(message.guild);
        if (!queue) return message.channel.send(`**${message.author.username}**, no se está reproduciendo ninguna canción ahora mismo.`);

        let embed = await pause(queue);

        message.channel.send({
            embeds: [embed]
        });
	}
}
