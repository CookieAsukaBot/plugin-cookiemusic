const {SlashCommandBuilder} = require('@discordjs/builders');
const {EmbedBuilder} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Detiene y remueve la lista de reproducción.'),
	async execute(interaction, bot) {
        let queue = await bot.player.nodes.get(interaction.guildId);
        if (!queue) return interaction.reply(`**${interaction.user.globalName}**, no se está reproduciendo ninguna canción ahora mismo.`);

        let embed = new EmbedBuilder()
            .setColor(process.env.BOT_COLOR)
            .setAuthor({
                name: '💥 Expulsado'
            })
            .setDescription(`La lista se termina, **${interaction.user.globalName}** me sacó. 💢`);

        if (queue) {
            queue.delete();
            interaction.reply({
                embeds: [embed]
            });
        }
	},
}
