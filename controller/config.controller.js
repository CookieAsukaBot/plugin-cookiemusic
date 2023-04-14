const Config = require('../models/config');
const clamp = require('../utils/clamp');

/**
 * Comprueba la existencia de la configuración, si no se encuentra lo crea.
 * 
 * @param {String} guild ID del servidor.
 */
const getConfig = async (guild) => {
    try {
        let config = await Config.findOne({ guild });

        if (!config) {
            config = new Config({ guild })
            await config.save();
        }

        return config;
    } catch (error) {
        console.error(error);
        return false;
    }
}

/**
 * Guarda el volumen
 * 
 * @param {String} guild ID del servidor
 * @param {Int} value asigna el valor de la música
 * @returns
 */
const setVolumen = async (guild, value) => {
    value = parseInt(clamp(value, 0, 100));

    // Permite poder actualizarlo si no existe
    await getConfig(guild);

    try {
        await Config.updateOne({ guild },
            {
                volumen: parseInt(clamp(value, 0, 100))
            }
        );

        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

module.exports = {
    getConfig,
    setVolumen
}
