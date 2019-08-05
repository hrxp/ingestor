// TODO
// await use axios post seedData fn to push data to db
// done: delete file directory(or add to gitignore so zip files doesn’t push to Github) + drain

const fs = require('fs');
const unzipper = require('unzipper'); // npm lib used to unzip files
const File = require('./File').File;
// Async fs reads and unzip files to a directory
const folderName = 'Archive.zip';
const pathToExtract = 'unzippedArchive';

const unzipFolder = (zippedFolder, destination) => {
  fs.createReadStream(`./${zippedFolder}`).pipe(
    unzipper.Extract({ path: __dirname + `/${destination}` })
  );
};

// Used to control the flow of reading a file.
const processFileController = async fileName => {
  let file = new File(fileName);
  try {
    // Read the file and store in the File object
    const results = await file.getFileContents();
    return results;
  } catch (err) {
    throw err;
  }
};

module.exports = { unzipFolder, processFileController };
