const {SlashCommandBuilder} = require('@discordjs/builders');
const {pause} = require('../controller/music.controller');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('Pausa o reanuda la canción.'),
	async execute(interaction, bot) {
        let queue = await bot.player.nodes.get(interaction.guildId);
        if (!queue) return interaction.reply(`**${interaction.user.username}**, no se está reproduciendo ninguna canción ahora mismo.`);

        let embed = await pause(queue);

        interaction.reply({
            embeds: [embed]
        });
	},
}
