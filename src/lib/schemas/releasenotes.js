const mongoose = require('mongoose');

let releasenotes = new mongoose.Schema({
    Updates: String,
    Date: String,
    Developer: String,
    Version: Number
});

const ReleaseNotesSchema = mongoose.model('ReleaseNotes', releasenotes);

module.exports = {
    ReleaseNotesSchema
};