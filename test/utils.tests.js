const { processFileController } = require('../src/utils.js');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const expect = chai.expect;
chai.use(chaiAsPromised);

const testFilePath = `${__dirname}/testFile.json`;
const invalidFilePath = './invalidPath';

describe('FileProcessController utility', () => {
  it("it should pass in a valid file path and output the file's contentes", async () => {
    const results = await processFileController(testFilePath);
    expect(results.test).to.equal('testMessage');
  });

  it('it should catch an error if the file path is incorrect', async () => {
    await expect(processFileController(invalidFilePath)).to.be.rejected;
  });
});
