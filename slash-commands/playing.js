const {SlashCommandBuilder} = require('@discordjs/builders');
const {embedCurrentTrack} = require('../utils/embeds');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('playing')
		.setDescription('Info. de la canción que se está reproduciendo.'),
	async execute(interaction, bot) {
        let queue = await bot.player.nodes.get(interaction.guildId);
        if (!queue) return interaction.reply(`**${message.author.globalName}**, no se está reproduciendo ninguna canción ahora mismo.`);

        if (queue.node.isPlaying()) {
            interaction.reply({
                embeds: [embedCurrentTrack(queue)]
            });
        } else {
            interaction.reply(`**${interaction.user.globalName}**, no hay ninguna canción reproduciéndose.`);
        }
	},
}
