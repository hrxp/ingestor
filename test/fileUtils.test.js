const fileUtils = require('../src/FileUtils').fileUtils;
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const expect = chai.expect;
chai.use(chaiAsPromised);

const testFilePath = `${__dirname}/testFile.json`;
const invalidFilePath = './invalidPath';

describe('FileUtils Class', () => {
  it("it should read a file's contents and save as the fileContents property", async () => {
    await fileUtils.setFileContents(testFilePath);
    expect(fileUtils.fileContents.test).to.be.equal('testMessage');
  });

  it('it should catch an error if the file path is incorrect', async () => {
    await expect(fileUtils.setFileContents(invalidFilePath)).to.be.rejected;
  });

  it('it should get file contents from the object when fileUtils.getFileContents() is invoked', () => {
    const fileContents = fileUtils.getFileContents();
    expect(fileContents.test).to.be.equal('testMessage');
  });
});
