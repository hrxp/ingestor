// TODO; There might be replies for a thread in different files(days)... What to do here?
// TODO: Add attachments property and a method to format each attachment.
// TODO:
// const dummyMessages = require('../dummyMessages.js');

const formatMessagesHelper = messages => {
  const formatFiles = files => {
    const formatedFiles = [];
    for (let i = 0; i < message.files.length; i++) {
      formatedFiles.push({
        id: message.files.id,
        displayName: message.files.username,
        fileType: message.files.filetype,
        downloadUrl: message.files.url_private_download,
      });
    }
    return formatedFiles;
  };

  const formatReply = reply => {
    return {
      ts: reply.ts,
      text: reply.text,
      thread_ts: reply.thread_ts,
    };
  };

  const formatThread = thread => {
    if (thread.files) {
      thread.files = formatFiles(thread.files);
      return {
        ts: thread.ts,
        text: thread.text,
        channelName: thread.channel,
        files: thread.files,
        replies: thread.replies,
      };
    } else {
      return {
        ts: thread.ts,
        text: thread.text,
        channelName: thread.channel,
        files: null,
        replies: thread.replies,
      };
    }
  };

  const formatMessage = message => {
    if (message.files) {
      message.files = formatFiles(message.files);
      return {
        ts: message.ts,
        text: message.text,
        channelName: message.channel,
        files: message.files,
        replies: null,
      };
    } else {
      return {
        ts: message.ts,
        text: message.text,
        channelName: message.channel,
        files: null,
        replies: null,
      };
    }
  };

  const repliesHelper = (threadReplies, replies) => {
    const formattedReplies = [];
    let message;

    // A message timestamp and reply timestamp is what connects a reply to a thread.
    for (let i = 0; i < threadReplies.length; i++) {
      // Find reply message
      for (let j = 0; j < replies.length; j++) {
        if (replies[j].ts === threadReplies[i].ts) {
          // TODO: Delete reply once found
          // Format reply
          formattedReplies.push(formatReply(replies[j]));
        }
      }
    }
    return formattedReplies;
  };

  const formatMessages = messages => {
    let threads = [];
    let replies = [];
    let regular = [];

    for (let i = 0; i < messages.length; i++) {
      let currentMessage = messages[i];
      if (currentMessage.thread_ts && currentMessage.replies) {
        threads.push(currentMessage);
      } else if (currentMessage.thread_ts) {
        replies.push(currentMessage);
      } else {
        regular.push(currentMessage);
      }
    }

    // For each thread, find replies and then formate each one
    for (let i = 0; i < threads.length; i++) {
      let currentThread = threads[i];
      currentThread.replies = repliesHelper(currentThread.replies, replies);
    }

    // Format each thread
    for (let i = 0; i < threads.length; i++) {
      threads[i] = formatThread(threads[i]);
    }

    // Format each message
    for (let i = 0; i < regular.length; i++) {
      regular[i] = formatMessage(regular[i]);
    }
    //TODO Sort the messages in time and return all the of threads and messages
    const formattedMessages = [...threads, ...regular];
    formattedMessages.sort((a, b) => {
      return a.ts - b.ts;
    });

    return formattedMessages;
  };
  const test = formatMessages(messages);
  return test;
};

module.exports = formatMessagesHelper;
