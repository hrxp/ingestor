const fs = require('fs');

class File {
  constructor(filename) {
    this.filename = filename;
    this.fileContents;
  }

  // Read a file and save into the constructor
  getFileContents() {
    return new Promise((resolve, reject) => {
      fs.createReadStream(this.filename)
        .on('data', chunk => {
          this.fileContents = JSON.parse(chunk.toString());
        })
        .on('error', err => {
          reject(err);
        })
        .on('close', () => {
          resolve(this.fileContents);
        });
    });
  }

  // This method is here in the case we wanted to do invoke a function on the this.fileContents
  async processFile(processFileFunction, ...otherArgs) {
    const results = processFileFunction(...otherArgs);
    return results;
  }
}

module.exports = { File };
