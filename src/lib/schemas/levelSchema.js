const mongoose = require('mongoose');

const levelSchema = new mongoose.Schema({
    guildId: {
        type: String,
        required: true,
    },
    channelId: {
        type: String,
        required: true,
    },
    useEmbed: {
        type: Boolean,
        default: false,
    },
    userId: {
        type: String,
    },
    userXp: {
        type: Number,
        default: 0,
    },
    userLevel: {
        type: Number,
        default: 1,
    },
    messges: [
        {
            content: {
                type: String,
                required: true,
            },
        },
    ],
});

module.exports = mongoose.model('levelSchema', levelSchema);