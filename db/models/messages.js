// TODOS
// Figure out how to reference anoter schema in Mongoose
// Explore populate to use with the reference https://mongoosejs.com/docs/populate.html
// TODO: user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  user: String,
  ts: String,
  type: String,
  text: String,
  channelName: String,
  files: [{ id: String, displayName: String, fileType: String, downloadUrl: String }],
  replies: [
    {
      user: String,
      ts: String,
      type: String,
      channelName: String,
      text: String,
      files: [{ id: String, displayName: String, fileType: String, downloadUrl: String }],
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
      return err;
    }
  },
};
