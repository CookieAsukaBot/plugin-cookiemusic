const {EmbedBuilder} = require('discord.js');
const Song = require('../controller/song.controller');

/**
 * Genera un embed con el color de el bot.
 */
const generateEmbed = () => {
    return new EmbedBuilder().setColor(process.env.BOT_COLOR);
}

module.exports = (bot) => {
    bot.player.events
        .on('audioTrackAdd', async (queue, track) => {
            // Mensaje
            let embed = generateEmbed()
                .setAuthor({
                    name: '🎶 Lista',
                    url: track.url
                })
                .setDescription(`Se agregó **${track.title}** \`(${track.duration})\` a la lista. ✅`);

            // Enviar mensaje
            queue.metadata.channel.send({
                embeds: [embed]
            });
        })
        .on('playerStart', async (queue, track) => {
            // Mensaje
            let embed = generateEmbed()
                .setAuthor({
                    name: '🎶 Nueva canción',
                    url: track.url
                })
                .setDescription(`Ahora reproduciendo **${track.title}** \`(${track.duration})\`. 💞`);

            // Enviar mensaje
            queue.metadata.channel.send({
                embeds: [embed]
            });

            // Agregar a la DB
            await Song.findOne({
                guild: queue.metadata.guild?.id || queue.metadata.channel?.guildId,
                userID: queue.metadata.author?.id || queue.metadata.user.id,
                metadata: {
                    title: track.title,
                    url: track.url,
                    duration: track.duration
                }
            });
        })
        .on('playerSkip', (queue, track) => {
            // Emitted when the audio player fails to load the stream for a song
            console.log({
                message: `@playerSkip: Skipping **${track.title}** due to an issue!`
            })
        })
        .on('error', (queue, error) => {
            // Emitted when the player queue encounters error
            console.log({
                event: `General player error event: ${error.message}`,
                error
            })
        })
        .on('playerError', (queue, error) => {
            // Emitted when the audio player errors while streaming audio track
            console.log({
                message: `Player error event: ${error.message}`,
                error
            })
        });
}
