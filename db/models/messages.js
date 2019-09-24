// TODOS
// Add tests for a message with a file property a

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  ts: String,
  type: String,
  text: String,
  channelName: String,
  channelId: String,
  files: [{ slackId: String, displayName: String, fileType: String, downloadUrl: String }],
  replies: [
    {
      createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      ts: String,
      type: String,
      channelName: String,
      channelId: String,
      text: String,
      files: [{ slackId: String, displayName: String, fileType: String, downloadUrl: String }],
    },
  ],
});

// Create an instance (document) of the messageSchema
const Message = mongoose.model('Message', messageSchema);

module.exports = {
  insertMessages: async channels => {
    try {
      // Channels is an object where each property is a specific channels messages
      for (let messages in channels) {
        await Message.collection.insertMany(channels[messages]);
      }
      return;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
};
