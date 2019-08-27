//TODO: Add test for a thread and replies to a thread

const expect = require('chai').expect;
const { filewalker, state } = require('../src/fileWalker.js');
const { findAllThreadReplies } = require('../src/messagesUtils');

describe('File Walker Ingestor', () => {
  const testDirectory = `${__dirname}/testArchive`;
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

  it('shoud output a messages object where the properties are channel names and he values are an array of messages', () => {
    expect(testState.messages.general[0].text).to.be.equal('testMessage1');
    expect(testState.messages.random[0].text).to.be.equal('testMessage3');
    expect(testState.messages[`hrxp-general`][0].text).to.be.equal('testMessage2');
    //TODO: Refactor into it's own test
    testState.messages = findAllThreadReplies(testState.messages);
    expect(testState.messages.general[0].replies).to.have.lengthOf(2);
  });

  it('it should ouput a users array with a length of 2', () => {
    expect(testState.users).to.have.lengthOf(2);
    expect(testState.users[0].slackId).to.equal('testUser1');
  });

  it('it should ouput a channels array with a length of 3', () => {
    expect(testState.channels).to.have.lengthOf(3);
    expect(testState.channels[0].name).to.equal('testChannel1');
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

  // TODO: Add tests for the rest of the incorrect cases in the filewalker function
});
