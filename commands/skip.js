const {skip} = require('../controller/music.controller');

module.exports = {
	name: 'skip',
    category: 'Música',
	description: 'Salta la canción que se está reproduciendo.',
    aliases: ['saltar'],
    cooldown: 1,
	async execute (message, args, bot) {
        let queue = await bot.player.nodes.get(message.guild);
        if (!queue) return message.channel.send(`**${message.author.globalName}**, no se está reproduciendo ninguna canción ahora mismo.`);

        // Skip
        await queue.node.skip();

        // Responder
        message.channel.send({
            embeds: [skip()]
        });
	}
}
