// TODO
// await use axios post seedData fn to push data to db
// done: delete file directory(or add to gitignore so zip files doesn’t push to Github) + drain

const fs = require('fs');
const unzipper = require('unzipper'); // npm lib used to unzip files
const fileUtils = require('./FileUtils').fileUtils;
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
  try {
    // Set the file contents
    await fileUtils.setFileContents(fileName);

    // TODO: filter and format data

    // Get the file contents
    const results = await fileUtils.getFileContents();

    return results;
  } catch (err) {
    throw err;
  }
};

module.exports = { unzipFolder, processFileController };
