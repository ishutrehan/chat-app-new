// models/Message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  user: String,
  content: String,
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
