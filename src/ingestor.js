// TODOs
// We should add the unzipper somewhere in here as well
// Find out if we can get the relative file path instead of absolute
// Next step after we've recursed over the archive would be to insert all the parsed data into the data base, aligning data with our mongoDB data model

const fs = require('fs');
const path = require('path');
const { processFileController } = require('./utils.js');
const fileUtils = require('./FileUtils.js').fileUtils;

// Local State
const state = { users: null, channels: null, messages: [] };

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
          const fileName = path.basename(absolutePath);
          switch (fileName) {
            case 'users.json':
              await fileUtils.setFileContents(absolutePath);
              const users = fileUtils.getFileContents();
              state.users = users;
              break;
            case 'channels.json':
              await fileUtils.setFileContents(absolutePath);
              const channels = fileUtils.getFileContents();
              state.channels = channels;
              break;
            case 'integration_logs.json':
              // Skip over integration logs, we don't need them
              break;
            default:
              await fileUtils.setFileContents(absolutePath);
              // There are multiple files with messages
              let messages = fileUtils.getFileContents();
              // Push each messages file into state;
              state.messages.push(...messages);
          }

          results.push(absolutePath);

          if (!--listLength) done(null, results);
        }
      });
    });
  });
};

filewalker(__dirname + '/testArchive', (err, data) => {
  if (err) {
    console.log(err);
  } else {
    console.log(state.messages);
  }
});

module.exports = { filewalker };
