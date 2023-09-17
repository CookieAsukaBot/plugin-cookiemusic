const {SlashCommandBuilder} = require('@discordjs/builders');
const {shuffle} = require('../controller/music.controller');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shuffle')
		.setDescription('La lista de canciones se reproducirán en un orden aleatorio.'),
	async execute(interaction, bot) {
        let queue = await bot.player.nodes.get(interaction.guildId);
        if (!queue) return interaction.reply(`**${interaction.user.globalName}**, no se está reproduciendo ninguna canción ahora mismo.`);

        await queue.tracks.shuffle();

        interaction.reply({
            embeds: [shuffle()]
        });
	},
}
