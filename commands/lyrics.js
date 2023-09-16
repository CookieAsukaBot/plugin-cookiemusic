const {EmbedBuilder} = require('discord.js');
const {lyricsExtractor} = require('@discord-player/extractor');

module.exports = {
	name: 'lyrics',
    category: 'Música',
	description: 'Muestra la letra de una canción.',
    aliases: ['letra'],
    usage: ['<opcional: nombre de la canción>'],
    cooldown: 8,
	async execute (message, args, bot) {
        const lyricsFinder = lyricsExtractor();
        let query;

        if (args.length >= 1) {
            query = args.join(' ').trim();
        } else {
            let queue = await bot.player.nodes.get(message.guild);
            if (!queue && !queue?.node.isPlaying()) return message.channel.send(`**${message.author.globalName}**, no se está reproduciendo ninguna canción ahora mismo.`);

            query = queue.currentTrack.title;
        }

        const lyrics = await lyricsFinder.search(query).catch(() => null);
        if (!lyrics) return message.channel.send('no se encontró la letra!');

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

        message.channel.send({
            embeds: [embed]
        });
	}
}
