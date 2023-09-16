const {EmbedBuilder} = require('discord.js');
const {play,volumen} = require('../controller/music.controller');

let config = {
    resultCount: 9,
    time: 50, // segundos
}

let footer = `__Escribe el **número** de la canción que quieres...__\nTienes **${config.time}** ⏳ segundos para elegir una canción.`;

module.exports = {
    name: 'search',
    category: 'Música',
    description: 'Busca una canción, después selecionala (de la lista).',
    aliases: ['buscar'],
    usage: ['<nombre de la canción>'],
    cooldown: 1,
	async execute (message, args, bot) {
        // Canal de voz
        let voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.channel.send(`**${message.author.globalName}**, no estás en un canal de voz!`);

        // Buscar
        if (!args.length) return message.channel.send(`**${message.author.globalName}**, escribe el nombre de una canción.`);
        const results = await bot.player.search(args.join(' ').trim(), {
            requestedBy: message.author
        });

        // Input
        let input = await new Promise((res, rej) => {
            if (!results.tracks.length) return rej("No se se encontró ningún resultado.");

            let parsed = results.tracks
                .map((track, index) => `**${index + 1}**. [**${track.title}**](${track.url}) de *${track.author}*`)
                .join('\n');

            let embed = new EmbedBuilder()
                .setColor(process.env.BOT_COLOR)
                .setTitle('🔎 Resultados de la búsqueda')
                .setDescription(`${parsed}\n\n${footer}`);

            return message.channel.send({
                    embeds: [embed]
                })
                .then(msg => {
                    let collector = msg.channel.createMessageCollector({
                        filter: m => (m.author.id == message.author.id) && (parseInt(m.content) - 1 in results.tracks),
                        time: config.time * 1000,
                        maxProcessed: 1
                    });

                    // Esperando mensaje
                    return new Promise((res, rej) => {
                        collector.on('collect', m => (collector.removeAllListeners(), res(m)));
                        collector.on('end', () => rej(''))
                    })
                        .then(res)
                        .catch(rej);
                });
            })
        .catch(err => {
            if (err) throw err
            return {}
        });

        let song = results.tracks[parseInt(input.content) - 1];

        if (song) {
            await play(bot.player, voiceChannel, song.url, message, message.author);
            await volumen(message.guild.id, await bot.player.nodes.get(message.guild));
        }
    }
}
