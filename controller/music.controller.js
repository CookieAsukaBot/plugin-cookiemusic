const {EmbedBuilder} = require('discord.js');
const Config = require('../controller/config.controller');

/**
 * Reproduce una canción.
 * 
 * @param {Object} player bot.player
 * @param {String} voiceChannel
 * @param {String} query args
 * @param {Object} message or interaction
 * @param {Object} user message.author / interaction.user
 */
const play = async (player, voiceChannel, query, message, user) => {
    return await player.play(voiceChannel, query, {
        requestedBy: user,
        nodeOptions: {
            metadata: message,
            selfDeaf: false,
            // volume: 100,
            leaveOnEmpty: true,
            leaveOnEnd: false,
            skipOnNoStream: true // this is a workaround for the error: ERR_NO_RESULT
        }
    });
}

/**
 * Embed con el mensaje satisfactorio de "saltar" una canción.
 * 
 * @returns Embed
 */
const skip = () => {
    return embed = new EmbedBuilder()
        .setColor(process.env.BOT_COLOR)
        .setAuthor({
            name: '⏩ Saltada'
        })
        .setDescription(`Se **saltó** la canción. ✅`);
}

/**
 * Pausa o reanuda la canción y retorna un embed con el estado.
 * 
 * @param {Object} queue
 * @returns embed
 */
const pause = async (queue) => {
    let statusName, statusDescription;
    let isPaused = queue.node.isPaused();

    if (!isPaused) {
        await queue.node.pause();
        statusName = "⏸ Pause";
        statusDescription = `Se **pausó** la canción. ✅`;
    } else {
        await queue.node.resume();
        statusName = "▶ Reanudado";
        statusDescription = `Se **reanudó** la canción. ✅`;
    }

    return embed = new EmbedBuilder()
        .setColor(process.env.BOT_COLOR)
        .setAuthor({
            name: statusName
        })
        .setDescription(statusDescription);
}

/**
 * Reordena la lista de manera aleatoria y retorna un embed con el estado.
 * 
 * @returns embed
 */
const shuffle = () => {
    return embed = new EmbedBuilder()
        .setColor(process.env.BOT_COLOR)
        .setAuthor({
            name: '🔀 Shuffle'
        })
        .setDescription(`Se activó el modo **Shuffle**. ✅`);
}

/**
 * Asigna el volumen del bot.
 * 
 * @param {String} guild ID del servidor
 * @param {Object} bot 
 */
const volumen = async (guild, queue) => {
    let config = await Config.getConfig(guild);
    await queue.node.setVolume(config.volumen);
    return config;
}


module.exports = {
    play,
    skip,
    pause,
    shuffle,
    volumen,
    // getQueue,
}
