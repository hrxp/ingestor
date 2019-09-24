const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  _id: Schema.Types.ObjectId,
  slackId: { type: String, unique: true },
  profilePhoto: String,
  displayName: String,
  realName: String,
});

// Create an instance (document) of the userSchema
const User = mongoose.model('User', userSchema);

module.exports = {
  insertUsers: async users => {
    try {
      await User.collection.insertMany(users);
      return;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  findMongoUserId: async slackId => {
    try {
      let results = await User.findOne({ slackId: slackId }, '_id');
      if (results === null) {
        return null;
      }
      return results._id;
    } catch (err) {
      throw err;
    }
  },
};
