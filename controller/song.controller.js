const Song = require('../models/song');

/**
 * Busca una canción y si no la encuentra la guarda en la DB.
 * 
 * @param {Object} model datos a guardar
 * @returns retorna la canción encontrada/guardada.
 */
const findOne = async (model) => {
    let {guild, userID, metadata} = model;
    let song = await Song.findOne({ "metadata.url": metadata.url });

    if (song) {
        await Song.updateOne({ "metadata.url": metadata.url }, {
            $inc: {played: 1}
        });
        return song;
    } else {
        let newSong = new Song({
            guild,
            userID,
            metadata
        });
        await newSong.save();
        return newSong;
    }
}

/**
 * Retorna una canción aleatoria guardada en la DB.
 * 
 * @param {String} guild id del servidor
 * @returns devuelve una canción aleatoria del servidor
 */
const getRandomSong = async (guild) => {
    return random = await Song.aggregate([{
        $match: {guild}
    }, {
        $sample: {size: 1}
    }]);
}

module.exports = {
    findOne,
    getRandomSong,
}
