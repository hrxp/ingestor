const mongoose = require('mongoose');
const { mongoURL } = require('./config');
const { insertChannels } = require('./models/channels');
const { insertMessages } = require('./models/messages');
const { insertUsers } = require('./models/users');

const insertArchiveData = state => {
  return new Promise((resolve, reject) => {
    // Make a connection
    mongoose.connect(mongoURL, { useNewUrlParser: true });

    // Get reference to database
    var db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error:'));

    db.once('open', async () => {
      try {
        await insertChannels(state.channels);

        await insertUsers(state.users);

        await insertMessages(state.messages);

        console.log('Successfully inserted dummy data into collection');
        mongoose.connection.close();
        resolve();
      } catch (err) {
        console.log('Error inserting dummy data: ', err);
        reject(err);
      }
    });
  });
};

module.exports = { insertArchiveData };
