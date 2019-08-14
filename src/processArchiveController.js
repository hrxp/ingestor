const { filewalker, state } = require('./ingestor');
const { findAllThreadReplies } = require('./messagesUtils');
const testDirectory = `${__dirname}/testArchive`;

// Used to control the flow of reading an archive directory
const processArchiveController = async directory => {
  filewalker(directory, (err, data) => {
    if (err) {
      throw err;
    }
    // For each channel's messages, find any leftover replies and then add them to the correct thread
    state.messages = findAllThreadReplies(state.messages);

    // TODO: Insert into the database

    // Now we want use the me
  });
};

processArchiveController(testDirectory);
