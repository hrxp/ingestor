// TODO: Add attachments property and a method to format each attachment.

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
      type: 'reply',
      channelName: reply.channel,
    };
  };

  const formatThread = thread => {
    if (thread.files) {
      thread.files = formatFiles(thread.files);
      return {
        ts: thread.ts,
        text: thread.text,
        type: 'thread',
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
        type: 'message',
        channelName: message.channel,
        files: message.files,
        replies: null,
      };
    } else {
      return {
        ts: message.ts,
        text: message.text,
        type: 'message',
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
          // Format reply
          formattedReplies.push(replies[j]);
          // Delete reply for the replies list.
          replies.splice(j, 1);
        } else {
          replies[j] = formatReply(replies[j]);
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

    // Formate each reply
    for (let i = 0; i < replies.length; i++) {
      replies[i] = formatReply(replies[i]);
    }

    // For each thread, find replies for this file
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
    // Spread all the different types of messages into a new list, and for any thread replies that are not in the list,  add them here as well.
    const formattedMessages = [...threads, ...regular, ...replies];
    formattedMessages.sort((a, b) => {
      return a.ts - b.ts;
    });

    return formattedMessages;
  };
  const test = formatMessages(messages);
  return test;
};

const findAllThreadReplies = messages => {
  // Loop through the messages list for each channel and find leftover replies
  for (let channelMessages in messages) {
    const channelReplies = [];

    for (let i = 0; i < messages[channelMessages].length; i++) {
      if (messages[channelMessages][i].type === 'reply') {
        channelReplies.push(messages[channelMessages][i]);
        // Remove reply from the channel messages list
        messages[channelMessages].splice(i, 1);
      }
    }
    // After we find all leftover replies in a channel, we then search for the tread the channel belongs to then push into the threads replies property
    for (let i = 0; i < channelReplies.length; i++) {
      // For each reply, iterate thorugh messages[channelMessages] and find matching thread
      for (let j = 0; j < messages[channelMessages].length; j++) {
        if (messages[channelMessages][j].ts === channelReplies[i].thread_ts) {
          messages[channelMessages][j].replies.push(channelReplies[i]);
        }
      }
    }
  }
  return messages;
};

module.exports = { formatMessagesHelper, findAllThreadReplies };
