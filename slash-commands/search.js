const {EmbedBuilder,ButtonStyle,ComponentType} = require('discord.js');
const {SlashCommandBuilder,ActionRowBuilder,ButtonBuilder} = require('@discordjs/builders');
const {play,volumen} = require('../controller/music.controller');

let config = {
	resultSize: 5,
	time: 50, // segundos
}

const generateButton = (song) => {
	return new ButtonBuilder({
		style: ButtonStyle.Primary
	})
		.setCustomId(song)
		.setLabel(song);
}

const generateComponent = () => {
	const row = new ActionRowBuilder();

	row.addComponents(generateButton("1"));
	row.addComponents(generateButton("2"));
	row.addComponents(generateButton("3"));
	row.addComponents(generateButton("4"));
	row.addComponents(generateButton("5"));

	return row;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('search')
		.setDescription('Busca una canción por su título.')
        .addStringOption(option =>
            option.setName('input')
                .setDescription("Ingresa el nombre de la canción.")
                .setRequired(true)),
	async execute(interaction, bot) {
        let args = interaction.options.getString('input');
        // Canal de voz
        let voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) return interaction.reply(`**${interaction.user.globalName}**, no estás en un canal de voz!`);

		// Comprobar args
		if (args.length < 1) return interaction.reply(`¡**${interaction.user.globalName}**, escribe el nombre de una canción!`);

        // Variables
        let song = null;

		// Buscar
        const results = await bot.player.search(args.trim(), {
            requestedBy: interaction.user
        });

		// Comprobar búsqueda
		if (!results) return interaction.reply('No se se encontró ningún resultado.');

		let parsed = results.tracks
			.map((track, index) => {
				// Limite de canciones a mostrar
				if (1 + index <= config.resultSize) return `**${index + 1}**. [**${track.title}**](${track.url}) de *${track.author}*`
			})
			.join('\n');

		// Embed
		let embed = new EmbedBuilder()
			.setColor(process.env.BOT_COLOR)
			.setTitle('🔎 Resultados de la búsqueda')
			.setDescription(parsed);

		// Responder
		const message = await interaction.reply({
			embeds: [embed],
			components: [generateComponent()]
		});

		// Button collector
        const collector = message.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: config.time * 1000 // se multplica por 1 segundo
        });

		collector.on('collect', async i => {
			let song = results.tracks[parseInt(i.customId) - 1];

			try {
				// Reproducir
				let { track } = await play(
					bot.player,
					voiceChannel,
					song.url,
					interaction,
					interaction.user
				);
				await volumen(interaction.guildId, await bot.player.nodes.get(interaction.guildId));
				embed.setDescription("Tu canción se agregará a la lista. ✅");
			} catch (error) {
				console.log(error);
			}

			await collector.stop();
		});

        collector.on('end', collected => {
            try {
                interaction.editReply({
                    embeds: [embed],
                    components: []
                });
            } catch (error) {}
        });
	},
}
