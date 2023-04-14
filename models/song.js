const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const schema = new Schema({
    guild: {
        type: String,
        required: true
    },
    userID: {
        type: String,
        required: true
    },
    metadata: {
        title: {
            type: String
        },
        url: {
            type: String,
            required: true
        },
        duration: {
            type: String
        },
    },
    played: {
        type: Number,
        default: 1
    }
}, {
    timestamps: true
});

module.exports = model('music_song', schema);
