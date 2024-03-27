const { Schema, mongoose } = require('mongoose');

let releasenotes = new Schema({
    Updates: String,
    Date: String,
    Developer: String,
    Version: Number
});

const ReleaseNotesSchema = mongoose.model('releasenoteSchema', releasenotes);

module.exports = { ReleaseNotesSchema };