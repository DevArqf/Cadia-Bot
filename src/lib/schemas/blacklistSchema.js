    const mongoose = require('mongoose');
    
    const blacklistSchema = new mongoose.Schema({
    guildName: {
        type: String,
        required: true,
        unique: true,
    },
    guildId: {
        type: String,
        required: true,
        unique: true,
    },
    reason: {
        type: String,
        required: false,
    },
    });
    
    const Guild = mongoose.model('blacklistSchema', blacklistSchema);
    
    module.exports = Guild;