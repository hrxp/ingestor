// TODOS
// Figure out how to reference anoter schema in Mongoose
// Explore populate to use with the reference https://mongoosejs.com/docs/populate.html
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: { type: String, unique: true },
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
      return err;
    }
  },
  User,
};
