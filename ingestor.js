// TODOs
// We should add the unzipper somewhere in here as well
// Find out if we can get the relative file path instead of absolute
// Next step after we've recursed over the archive would be to insert all the parsed data into the data base, aligning data with our mongoDB data model

const fs = require('fs');
const path = require('path');
const { processFileController } = require('./utils.js');

// Local State
let state = {};
state.users = [];
state.channels = [];
state.messages = [];

const filewalker = (dir, done) => {
  let results = [];

  fs.readdir(dir, (err, list) => {
    // If at any point there is an error, invoke the callback function with the error as the argument
    if (err) return done(err);

    var listLength = list.length;

    if (!listLength) return done(null, results);

    list.forEach(file => {
      // The fileName with be an argument in the processFileController.
      let fileName = file;
      // The fs.state method requeires the absolute path of a file, we grab that with path.resolve.
      file = path.resolve(dir, file);
      // Use fs.state to grab a particular files stats. Essentially, we want to find out if this file is a folder.
      fs.stat(file, async (err, stat) => {
        // If directory, execute a recursive call
        if (stat && stat.isDirectory()) {
          // Add directory to array
          results.push(file);
          // We know this file is a directory, and we recuseively call filewalker with the directory
          filewalker(file, (err, res) => {
            results = results.concat(res);
            if (!--listLength) done(null, results);
          });
        } else {
          /*
           ** Here is where we would read each file and parse the data, there are 4 different cases
           */
          let fileName = path.basename(file);
          switch (fileName) {
            case 'users.json':
              const users = await processFileController(file);
              state.users.push(users);
              break;
            case 'channels.json':
              const channels = await processFileController(file);
              state.channels.push(channels);
              break;
            case 'integration_logs.json':
              // Do nothing
              break;
            default:
              const messages = await processFileController(file);
              state.messages.push(messages);
          }

          results.push(file);

          if (!--listLength) done(null, results);
        }
      });
    });
  });
};

filewalker('./unzippedArchive', (err, data) => {
  if (err) {
    throw err;
  }
});
