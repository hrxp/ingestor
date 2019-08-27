//TODO: Add tests for database models and methods

const mongoose = require('mongoose');
const { mongoURL } = require('./config');
const { insertChannels, findChannelId } = require('./models/channels');
const { insertMessages } = require('./models/messages');
const { insertUsers, findMongoUserId } = require('./models/users');

const insertArchiveData = state => {
  return new Promise((resolve, reject) => {
    // Make a connection
    mongoose.connect(mongoURL, { useNewUrlParser: true });
    mongoose.set('useCreateIndex', true);
    // Get reference to database
    var db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error:'));

    db.once('open', async () => {
      try {
        // Declaire variables and helper funcions
        const createdByMap = new Map();

        const setChannelMemberIds = async (state, map) => {
          const channels = state.slice();
          for (let i = 0; i < channels.length; i++) {
            if (channels[i].members) {
              for (let j = 0; j < channels[i].members.length; j++) {
                console.log('before: ', channels[i].members[j]);
                channels[i].members[j];
                if (map.has(channels[i].members[j])) {
                  channels[i].members[j] = map.get(channels[i].members[j]);
                } else {
                  try {
                    memberId = await findMongoUserId(channels[i].members[j]);
                    map.set(channels[i].members[j], memberId);
                    channels[i].members[j] = memberId;
                  } catch (err) {
                    throw err;
                  }
                }
                console.log('after: ', channels[i].members[j]);
              }
            }
          }
          return channels;
        };

        await insertUsers(state.users);

        await insertChannels(await setChannelMemberIds(state.channels, createdByMap));

        await insertMessages(state.messages);

        console.log('Successfully inserted dummy data into collection');
        mongoose.connection.close();
        resolve();
      } catch (err) {
        console.log('Error inserting dummy data: ', err);
        throw err;
        reject(err);
      }
    });
  });
};

module.exports = { insertArchiveData };
