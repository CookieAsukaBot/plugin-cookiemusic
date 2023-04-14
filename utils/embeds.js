const {EmbedBuilder} = require('discord.js');

/**
 * 
 * @param {Object} queue 
 * @returns embed
 */
const embedCurrentTrack = (queue) => {
    const progressBar = queue.node.createProgressBar({
        timecodes: true,
        length: 8
    });

    return embed = new EmbedBuilder()
        .setColor(process.env.BOT_COLOR)
        .setAuthor({
            name: '💿 Reproduciendo'
        })
        .setTitle(`${queue.currentTrack.title}`)
        .setURL(`${queue.currentTrack.url}`)
        .setThumbnail(`${queue.currentTrack.thumbnail}`)
        .addFields(
            {name: 'Pedida por', value: `<@${queue.currentTrack.requestedBy.id}>`},
            {name: 'Duración', value: `${progressBar}`}
        );
}

module.exports = {
    embedCurrentTrack,
}
