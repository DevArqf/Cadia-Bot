const mongoose = require('mongoose');

const userSettingsSchema = new mongoose.Schema({
	userId: { type: String, required: true, unique: true },
	receiveDMs: { type: Boolean, required: true, default: true }
});

const UserSettingsSchema = mongoose.model('UserSettingSchema', userSettingsSchema);

module.exports = { UserSettingsSchema };
