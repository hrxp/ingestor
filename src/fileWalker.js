// TODOs
// We should add the unzipper somewhere in here as well
// Next step after we've recursed over the archive would be to insert all the parsed data into the data base, aligning data with our mongoDB data model
// Formate Threads and replies?!?
const fs = require('fs');
const path = require('path');
const fileUtils = require('./FileUtils.js').fileUtils;

// Local State
const state = { users: null, channels: null, messages: {} };

const filewalker = (dir, done) => {
  let results = [];

  fs.readdir(dir, (err, list) => {
    if (err) return done(err);

    let listLength = list.length;

    if (!listLength) return done(null, results);

    list.forEach(file => {
      const absolutePath = path.resolve(dir, file);

      fs.stat(absolutePath, async (err, stat) => {
        // If directory, execute a recursive call
        if (stat && stat.isDirectory()) {
          results.push(absolutePath);

          filewalker(absolutePath, (err, res) => {
            results = results.concat(res);
            if (!--listLength) done(null, results);
          });
        } else {
          /*
           ** Here is where we would read each file and parse the data, there are 4 different cases
           */

          // Find out if the file is contents of a channel folder
          var arr = absolutePath.split('/');
          let folder = arr[arr.length - 2];
          let channel;
          // The test archive is the entry into the directory, and we know that it is not a channel folder
          if (folder !== 'testArchive2') {
            channel = folder;
          }

          const fileName = path.basename(absolutePath);
          // console.log('folder: ', channel, 'fileName: ', fileName);
          switch (fileName) {
            case 'users.json':
              await fileUtils.setFileContents(absolutePath);
              const users = fileUtils.getFileContents();
              state.users = fileUtils.formatUsers(users);
              break;
            case 'channels.json':
              await fileUtils.setFileContents(absolutePath);
              const channels = fileUtils.getFileContents();
              state.channels = fileUtils.formatChannels(channels);
              break;
            case 'integration_logs.json':
              // Skip over integration logs, we don't need them
              break;
            default:
              try {
                await fileUtils.setFileContents(absolutePath);
                // There are multiple files with messages

                const messages = await fileUtils.getFileContents();
                // For each message, add the channel it belongs to
                messages.forEach(message => {
                  message.channel = channel;
                });

                const formattedMessages = await fileUtils.formatMessages(messages);

                if (state.messages.hasOwnProperty(channel)) {
                  state.messages[`${channel}`].push(...formattedMessages);
                } else {
                  state.messages[`${channel}`] = formattedMessages;
                }
              } catch (err) {
                console.log(err);
                throw err;
              }
          }

          results.push(absolutePath);

          if (!--listLength) done(null, results);
        }
      });
    });
  });
};

module.exports = { filewalker, state };
