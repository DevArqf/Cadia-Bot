const mongoose = require('mongoose');

const guildSchema = new mongoose.Schema({
	id: { type: String, unique: true, required: true },
	countChannel: String,
	countHighscore: { type: Number, default: 0 },
	countLastScore: { type: Number, default: 0 },
	countLastUser: String,
	countLastDate: { type: Date, default: Date.now },
	countGoal: { type: Number, default: 100 },
	count: { type: Number, default: 0 },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now }
});

const GuildSchema = mongoose.model('Guild', guildSchema);

module.exports = {
	GuildSchema
};
