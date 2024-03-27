const { default: mongoose } = require('mongoose');

const countingRewardSchema = new mongoose.Schema({
	id: { type: String, unique: true, required: true },
	guildId: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
	milestone: { type: Number, required: true },
	reward: { type: Number, required: true }
});

const countActivitySchema = new mongoose.Schema({
	userId: { type: String, required: true },
	guildId: { type: String, required: true },
	count: { type: Number, required: true }
});

const CountingReward = mongoose.model('CountingRewardSchema', countingRewardSchema);
const CountActivity = mongoose.model('CountActivitySchema', countActivitySchema);

module.exports = {
	CountingReward,
	CountActivity
};
