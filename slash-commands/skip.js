const {SlashCommandBuilder} = require('@discordjs/builders');
const {skip} = require('../controller/music.controller');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('Salta la canción que se está reproduciendo.'),
	async execute(interaction, bot) {
        let queue = await bot.player.nodes.get(interaction.guildId);
        if (!queue) return interaction.reply(`**${message.author.globalName}**, no se está reproduciendo ninguna canción ahora mismo.`);

        // Skip
        await queue.node.skip();

        // Responder
        interaction.reply({
            embeds: [skip()]
        });
	},
}
