const path = require('node:path');
const {Player} = require('discord-player');

module.exports = {
    name: 'Music',
    version: '0.1.6',
    cookiebot: '1.4.0',
    description: 'Plugin de música.',
    dependencies: [
        'discord-player',
        '@discord-player/extractor',
        'mediaplex',
        'opusscript',
        'play-dl',
        'soundcloud-scraper',
        'youtube-sr'
    ],
    enabled: true,
    async plugin (bot) {
        // Cargar comandos
        require('../../events/commands')(bot, path.join(__dirname, 'commands'));
        require('../../events/commands')(bot, path.join(__dirname, 'slash-commands'), true);

        // Reproductor
        const player = new Player(bot, {
            ytdlOptions: {
                quality: 'highestaudio'
            }
        });

        // Utilizar los extractores (para buscar y reproducir)
        await player.extractors.loadDefault();

        // Eventos
        bot.player = player;
        require('./events/player')(bot);
    }
}
