// TODOS
// Figure out how to reference anoter schema in Mongoose
// Explore populate to use with the reference https://mongoosejs.com/docs/populate.html
const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  name: String,
  topic: String,
  purpose: { type: String, unique: true, required: true },
  members: [String],
  isArchived: String,
});

// Create an instance (document) of the challelSchema
const Channel = mongoose.model('Channel', channelSchema);

module.exports = {
  insertChannels: async channels => {
    try {
      await Channel.collection.insertMany(channels);
      return;
    } catch (err) {
      return err;
    }
  },
  Channel,
};