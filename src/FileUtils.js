const fs = require('fs');
const formatMessagesHelper = require('./messagesUtils');

// export const DEFAULT_FILENAME = 'some string'; // TODO: Filled me in.

class FileUtils {
  constructor() {}

  // Read a file and saved its contents into fileContents.
  __setFileContents(filename) {
    var contents = fs.readFileSync(filename);
    this.fileContents = JSON.parse(contents);
    return;
  }

  getFileContents() {
    return this.fileContents;
  }

  async setFileContents(filename) {
    try {
      await this.__setFileContents(filename);
      return;
    } catch (err) {
      throw err;
    }
  }

  formatUsers(users) {
    const filteredUsers = users.map(user => {
      return {
        id: user.id,
        profilePhoto: user.profile.image_72,
        displayName: user.profile.display_name,
        realName: user.real_name,
      };
    });
    return filteredUsers;
  }

  formatChannels(channels) {
    // TODO: Format the inputted Channels data.
    const filteredChannels = channels.map(channel => {
      return {
        id: channel.id,
        name: channel.name,
        topic: channel.topic.value,
        purpose: channel.purpose.value,
        members: channel.memebers,
        isArchived: channel.isArchived,
      };
    });
    return filteredChannels;
  }

  formatMessages(messages) {
    const res = formatMessagesHelper(messages);
  }
}

// Reading and parsing from a file is an expensive operation. To ensured the `__setFileContents` method does not
// get needlessly run we export a Singleton.
const fileUtils = new FileUtils();

module.exports = { fileUtils };
