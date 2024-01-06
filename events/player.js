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
        .on('playerSkip', (queue, track, reason, description) => {
            let responses = {
                'ERR_NO_STREAM': `Problema al intentar reproducir **${track.title}**; será **saltada**. ❌`,
                'MANUAL': `Se saltó la canción **${track.title}**. ✅`,
                'SEEK_OVER_THRESHOLD': `Problema al intentar reproducir **${track.title}**; será **saltada**. ❌`,
                'JUMPED_TO_ANOTHER_TRACK': `Se saltó la canción **${track.title}**. ✅`,
                'SKIP_TO_ANOTHER_TRACK': `Se saltó la canción **${track.title}**. ✅`,
                'HISTORY_NEXT_TRACK': `Se saltó la canción **${track.title}**. ✅`,
            }

            let embed = generateEmbed()
                .setAuthor({
                    name: '⏩ Saltada',
                    url: track.url
                })
                .setDescription(responses[reason]);
            queue.metadata.channel.send({
                embeds: [embed]
            });
        })
        .on('emptyQueue', (queue) => {
            let embed = generateEmbed()
                .setAuthor({
                    name: '📀 Música'
                })
                .setDescription(`Se acabaron las canciones de la lista. 💔`);
            queue.metadata.channel.send({
                embeds: [embed]
            });
        })
        .on('emptyChannel', (queue) => {
            // Mensaje
            let embed = generateEmbed()
                .setAuthor({
                    name: '💥 Fin de la lista'
                })
                .setDescription(`Todos se salieron del canal de voz. 💢`);
            queue.metadata.channel.send({
                embeds: [embed]
            });
        })
        .on('error', (queue, error) => {
            // Emitted when the player queue encounters error
            console.log({
                event: `General player error event: ${error.message}`,
                error
            });
        })
        .on('playerError', (queue, error) => {
            // Emitted when the audio player errors while streaming audio track
            console.log({
                message: `Player error event: ${error.message}`,
                error
            });
        });
}
