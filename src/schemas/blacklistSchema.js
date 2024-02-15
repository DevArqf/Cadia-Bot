const mongoose = require('mongoose');

const blacklistSchema = new mongoose.Schema({
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

const Guild = mongoose.model('GuildBlacklist', blacklistSchema);

module.exports = Guild;