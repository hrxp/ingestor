const fs = require('fs');

// export const DEFAULT_FILENAME = 'some string'; // TODO: Filled me in.

class FileUtils {
  constructor() {
    // this.setFileContents(DEFAULT_FILENAME);
  }

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
    // TODO: Format the inputted Users data.
  }

  formatChannels(channels) {
    // TODO: Format the inputted Channels data.
  }

  formatMessagess(messages) {
    // TODO: Format the inputted Messages data.
  }
}

// Reading and parsing from a file is an expensive operation. To ensured the `__setFileContents` method does not
// get needlessly run we export a Singleton.
const fileUtils = new FileUtils();

module.exports = { fileUtils };
