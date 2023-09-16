const {SlashCommandBuilder} = require('@discordjs/builders');
const {play,volumen} = require('../controller/music.controller');
const {getRandomSong} = require('../controller/song.controller');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Reproduce una canción.')
        .addStringOption(option =>
            option.setName('input')
                .setDescription("Ingresa el nombre de la canción. También puedes usar un URL de YouTube, Spotify o Soundcloud.")
                .setRequired(true)),
	async execute(interaction, bot) {
        let args = interaction.options.getString('input');
        // Canal de voz
        let voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) return interaction.reply(`**${interaction.user.globalName}**, no estás en un canal de voz!`);

		// Comprobar args
		if (args.length < 1) {
			// Comprobar queue
			let queue = await bot.player.nodes.get(interaction.guildId);
			if (queue.node.isPlaying()) return interaction.reply({ embeds: [embedCurrentTrack(queue)] });

			return interaction.reply(`¡**${interaction.user.globalName}**, usa \`${bot.prefix}${this.name} ${this.usage}\` para agregar una canción a la lista!`);
		}

		// Comprobar random
		interaction.reply('Tu canción se agregará a la lista. ✅');
		let random = false;
		if (args.toLowerCase().trim() == "random") random = (await getRandomSong(interaction.guildId))[0].metadata.url;

		// Reproducir
		let { track } = await play(
			bot.player,
			voiceChannel,
			random ? random : args.trim(),
			interaction,
			interaction.user
		);
        await volumen(interaction.guildId, await bot.player.nodes.get(interaction.guildId));
	},
}
