const fs = require('fs');
const { formatMessagesHelper } = require('./messagesUtils');

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
        slackId: user.id,
        profilePhoto: user.profile.image_72,
        displayName: user.profile.display_name,
        realName: user.real_name,
      };
    });

    return filteredUsers;
  }

  formatChannels(channels) {
    const filteredChannels = channels.map(channel => {
      return {
        slackId: channel.id,
        name: channel.name,
        topic: channel.topic.value,
        purpose: channel.purpose.value,
        members: channel.members,
        isArchived: channel.is_archived,
      };
    });

    return filteredChannels;
  }

  formatMessages(messages) {
    return formatMessagesHelper(messages);
  }
}

// Reading and parsing from a file is an expensive operation. To ensured the `__setFileContents` method does not
// get needlessly run we export a Singleton.
const fileUtils = new FileUtils();

module.exports = { fileUtils };
