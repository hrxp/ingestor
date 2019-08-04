const expect = require('chai').expect;
const { filewalker, state } = require('../ingestor.js');

describe('File Walker Ingestor', () => {
  const testDirectory = './unzippedArchive';
  let testState;

  beforeEach(done => {
    filewalker(testDirectory, (err, data) => {
      if (err) {
        throw err;
        done();
      }
      testState = state;
      done();
    });
  });
  it('it should ouput a messages array with a length of 9', () => {
    expect(testState.messages).to.have.lengthOf(3);
    expect(testState.messages[0].text).to.be.equal('testMessage1');
  });
  it('it should input a directory and output a state object that has a users key, a channels key, & a messages key', () => {
    expect(testState.users).to.be.an('array');
    expect(testState.channels).to.be.an('array');
    expect(testState.messages).to.be.an('array');
  });

  it('it should ouput a users array with a length of 2', () => {
    expect(testState.users).to.have.lengthOf(2);
    expect(testState.users[0].id).to.equal('testUser1');
  });

  it('it should ouput a channels array with a length of 3', () => {
    expect(testState.channels).to.have.lengthOf(3);
  });
});

describe('It should return an error if the file directory is incorrect', () => {
  const badDirectory = './incorrectDirectory';
  let error = false;

  // Before the test starts, run this.
  before(() => {
    filewalker(badDirectory, (err, data) => {
      if (err) {
        error = true;
      }
    });
  });

  it('it should output an err if the archive directory is incorrect', () => {
    expect(error).to.be.equal(true);
  });
});
