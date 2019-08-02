const expect = require('chai').expect;
const { filewalker, state } = require('../ingestor.js');

describe('File Walker Ingestor', () => {
  const testDirectory = './unzippedArchive';
  let testState;

  before(done => {
    filewalker(testDirectory, (err, data) => {
      if (err) {
        throw err;
      }
      testState = state;
      done();
    });
  });
  after(done => {
    testState;
    done();
  });

  it('it should input a directory and output a state object that has a users key, a channels key, & a messages key', () => {
    expect(testState).to.be.an('object');
    expect(testState.users).to.be.an('array');
    expect(testState.channels).to.be.an('array');
    expect(testState.messages).to.be.an('array');
  });

  it('it should ouput a users array with a length of 2', () => {
    expect(testState.users).to.have.lengthOf(2);
  });

  it('it should ouput a messages array with a length of 3', () => {
    expect(testState.messages).to.have.lengthOf(3);
  });

  it('it should ouput a channels array with a length of 3', () => {
    expect(state.channels).to.have.lengthOf(3);
  });
});

describe('It should return an error if the file directory is incorrect', () => {
  const badDirectory = './incorrectDirectory';
  let error = false;

  // Before the test starts, run this.
  before(done => {
    filewalker(badDirectory, (err, data) => {
      if (err) {
        error = true;
        done();
        return;
      }
      done();
    });
  });

  it('it should output an err if the archive directory is incorrect', () => {
    expect(error).to.be.equal(true);
  });
});
