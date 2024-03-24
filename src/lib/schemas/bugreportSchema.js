const mongoose = require('mongoose');
 
const bugreportSchema = new mongoose.Schema({
  userID: {
      type: String,
      required: true,
      unique: true,
  },
  reason: {
    type: String,
    required: true,
  },
});
 
const BugReportBlacklist = mongoose.model('bugreportSchema', bugreportSchema);
 
module.exports = { BugReportBlacklist };