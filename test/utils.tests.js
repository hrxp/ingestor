const { File, processFileController } = require('../utils.js');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const expect = chai.expect;
chai.use(chaiAsPromised);

const testFilePath = `${__dirname}/testFile.json`;
const invalidFilePath = './invalidPath';

describe('File Class', () => {
  const newFile = new File(testFilePath);

  it('it should be an object that containts a filename property', () => {
    expect(newFile).to.be.an('object');
    expect(newFile.filename).to.be.equal(testFilePath);
  });

  it('it should read a file and parse the json data and store in the filecontents property', async () => {
    const results = await newFile.readFile();
    expect(results)
      .to.be.an('object')
      .to.have.property('test');
    expect(results.test).to.equal('testMessage');
  });

  it('it should catch an error if the file path is incorrect', async () => {
    const newFile = new File(invalidFilePath);
    await expect(newFile.readFile()).to.be.rejected;
  });
});
describe('fileProcessController Utility', () => {
  it("it should pass in a valid file path and output the file's contentes", async () => {
    const results = await processFileController(testFilePath);
    expect(results)
      .to.be.an('object')
      .to.have.property('test');
    expect(results.test).to.equal('testMessage');
  });

  it('it should catch an error if the file path is incorrect', async () => {
    await expect(processFileController(invalidFilePath)).to.be.rejected;
  });
});
