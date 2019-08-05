const fs = require('fs');

export const DEFAULT_FILENAME = 'some string'; // TODO: Filled me in.

class FileUtils {
  constructor() {
    this.fileContents;
    this.setFileContents(DEFAULT_FILENAME);
  }

  // Read a file and saved its contents into fileContents.
  __setFileContents(filename) {
    return new Promise((resolve, reject) => {
      fs.createReadStream(filename)
        .on('data', chunk => {
          this.fileContents = JSON.parse(chunk.toString());
        })
        .on('close', () => {
          resolve(this.fileContents);
        })
        .on('error', err => {
          reject(err);
        });
    });
  }

 getFileContents() {
   return this.fileContents;
 }
  
 setFileContents(filename) {
   const setFileContentsPromise = this.__setFileContents(filename);
   setFileContentsPromise
     .then((fileContents) => this.fileContents = fileContents)
     .catch((err) => {
       // TODO: Handle error
     });
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
