// TODO's
// Write tests
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const channelSchema = new mongoose.Schema({
  slackId: { type: String, unique: true },
  name: String,
  topic: String,
  purpose: String,
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  isArchived: Boolean,
});

// Create an instance (document) of the channelSchema
const Channel = mongoose.model('Channel', channelSchema);

module.exports = {
  insertChannels: async channels => {
    try {
      await Channel.collection.insertMany(channels);
      return;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  findChannelId: async channelName => {
    try {
      let results = await Channel.findOne({ name: channelName }, '_id');
      if (results === null) {
        return null;
      }
      return results._id;
    } catch (err) {
      throw err;
    }
  },
};
