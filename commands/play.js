const {play,volumen} = require('../controller/music.controller');
const {getRandomSong} = require('../controller/song.controller');
const {embedCurrentTrack} = require('../utils/embeds');

module.exports = {
	name: 'play',
	category: 'Música',
	description: 'Reproduce una canción de YouTube/Spotify.',
	aliases: ['p'],
	usage: '<nombre de la canción o enlace de YouTube/Spotify>',
	async execute (message, args, bot) {
        // Canal de voz
        let voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.channel.send(`**${message.author.username}**, no estás en un canal de voz!`);

		// Comprobar args
		if (args.length < 1) {
			// Comprobar queue
			let queue = await bot.player.nodes.get(message.guild);
			if (queue.node.isPlaying()) return message.channel.send({ embeds: [embedCurrentTrack(queue)] });

			return message.channel.send(`¡**${message.author.username}**, usa \`${bot.prefix}${this.name} ${this.usage}\` para agregar una canción a la lista!`);
		}

		// Comprobar random
		let random = false;
		if (args[0].toLowerCase().trim() == "random") random = (await getRandomSong(message.guild.id))[0].metadata.url;

		// Reproducir
		let { track } = await play(
			bot.player,
			voiceChannel,
			random ? random : args.join(' ').trim(),
			message,
			message.author
		);
		await volumen(message.guild.id, await bot.player.nodes.get(message.guild));
    }
}
