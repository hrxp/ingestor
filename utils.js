// TODO
// await use axios post seedData fn to push data to db
// done: delete file directory(or add to gitignore so zip files doesn’t push to Github) + drain

const fs = require('fs');
const path = require('path');
const unzipper = require('unzipper'); // npm lib used to unzip files
const { createReadStream } = require('fs');

// Async fs reads and unzip files to a directory
const folderName = 'Archive.zip';
const pathToExtract = 'unzippedArchive';

const unzipFolder = (zippedFolder, destination) => {
  fs.createReadStream(`./${zippedFolder}`).pipe(
    unzipper.Extract({ path: __dirname + `/${destination}` })
  );
};

class File {
  constructor(filename) {
    this.filename = filename;
    this.fileContents;
  }

  // Read a file and save into the constructor
  readFile() {
    return new Promise((resolve, reject) => {
      try {
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
      } catch (err) {
        reject();
      }
    });
  }

  // This method is here in the case we wanted to do invoke a function on the this.fileContents
  async processFile(processFileFunction, ...otherArgs) {
    const results = processFileFunction(...otherArgs);
    return results;
  }
}

// Used to control the flow of reading a file.
const processFileController = async fileName => {
  let file = new File(fileName);
  try {
    // Read the file and store in the File object
    const results = await file.readFile();
    return results;
  } catch (err) {
    throw err;
  }
};

module.exports = { File, processFileController };
