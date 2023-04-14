const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const schema = new Schema({
    guild: {
        type: String,
        required: true
    },
    volumen: {
        type: Number,
        default: 100
    },
    // Excluded / Included from channels?
    // Excluded / Included from roles?
    // Excluded / Included from rusers?
}, {
    timestamps: true
});

module.exports = model('music_config', schema);
