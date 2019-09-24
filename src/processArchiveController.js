const { filewalker, state } = require('./fileWalker');
const { findAllThreadReplies } = require('./messagesUtils');
const { insertArchiveData } = require('../db/index');
const archiveDirectory = `${__dirname}/:archiveName`;

// Used to control the flow of reading an archive directory
const processArchiveController = async directory => {
  filewalker(directory, async (err, data) => {
    if (err) {
      throw err;
    }

    try {
      // Find the thread leftover replies belong to in each channel.
      state.messages = findAllThreadReplies(state.messages);
      // Insert data into the database
      await insertArchiveData(state);
    } catch (err) {
      throw err;
    }
  });
};

processArchiveController(archiveDirectory);
