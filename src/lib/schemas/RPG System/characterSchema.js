const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
        unqiue: true
    },
    Age: Number,
    Gender: String,
    UserId: String,
    UCID: String
});

module.exports = mongoose.model('characterSchema', characterSchema);
