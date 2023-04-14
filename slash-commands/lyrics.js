const {SlashCommandBuilder} = require('@discordjs/builders');
const {EmbedBuilder} = require('discord.js');
const {lyricsExtractor} = require('@discord-player/extractor');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('lyrics')
		.setDescription('Muestra la letra una canción.')
        .addStringOption(option =>
            option.setName('input')
                .setDescription("Ingresa el nombre de la canción.")
                .setRequired(false)),
	async execute(interaction, bot) {
        const lyricsFinder = lyricsExtractor();
        let args = interaction.options.getString('input');
        let query;

        if (args) {
            query = args.trim();
        } else {
            let queue = await bot.player.nodes.get(interaction.guildId);
            if (!queue && !queue?.node.isPlaying()) return interaction.reply(`**${interaction.user.username}**, no se está reproduciendo ninguna canción ahora mismo.`);

            query = queue.currentTrack.title;
        }

        const lyrics = await lyricsFinder.search(query).catch(() => null);
        if (!lyrics) return interaction.reply('No se encontró la letra! 💢');

        const trimmedLyrics = lyrics.lyrics.substring(0, 1997);

        const embed = new EmbedBuilder()
            .setColor(process.env.BOT_COLOR)
            .setTitle(lyrics.title)
            .setURL(lyrics.url)
            .setThumbnail(lyrics.thumbnail)
            .setAuthor({
                name: lyrics.artist.name,
                iconURL: lyrics.artist.image,
                url: lyrics.artist.url
            })
            .setDescription(trimmedLyrics.length === 1997 ? `${trimmedLyrics}...` : trimmedLyrics)

        interaction.reply({
            embeds: [embed]
        });
	},
}
