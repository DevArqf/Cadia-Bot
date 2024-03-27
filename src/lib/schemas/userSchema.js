const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	id: { type: String, unique: true, required: true },
	balance: { type: Number, default: 0 },
	bank: { type: Number, default: 0 },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now }
});

const UserSchema = mongoose.model('CountingUserSchema', userSchema);

module.exports = {
	UserSchema
};
