const mongoose = require('mongoose');
 
const welcomeSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true,
    unique: true,
  },
  welcomeChannelId: {
    type: String,
    required: true,
    unique: false,
  },
  messageType: {
    type: String,
    required: true,
    unique: false,
  },
    title: {
        type: String,
        required: false,
        unique: false,
    },
    message: {
        type: String,
        required: true,
        unique: false,
    },
    footer: {
        type: String,
        required: false,
        unique: false
    },
    thumbnailImage: {
      type: String,
      required: false,
      unique: false
    },
    iconURL: {
      type: String,
      required: false,
      unique: false
    },
    authorName: {
      type: String,
      required: false,
      unique: false
    },
    hexCode: {
      type: String,
      required: false,
      unique: false,
    }
});
 
const WelcomeSchema = mongoose.model('Multi-Server-Welcome', welcomeSchema);
 
module.exports = { WelcomeSchema };