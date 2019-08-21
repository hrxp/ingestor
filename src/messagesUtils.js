// TODO: Add attachments property and a method to format each attachment.
//TODO: Write tests for each method.

const formatReply = reply => {
  const formattedReply = {
    slackId: reply.id,
    ts: reply.ts,
    text: reply.text,
    thread_ts: reply.thread_ts,
    type: 'reply',
    channelName: reply.channel,
  };

  if (reply.files) {
    formatted.files = formatFiles(reply.files);
    return formattedReply;
  } else {
    return formattedReply;
  }
};

const formatThread = thread => {
  const formattedThread = {
    slackId: thread.id,
    ts: thread.ts,
    text: thread.text,
    type: 'thread',
    channelName: thread.channel,
    replies: thread.replies,
  };

  if (thread.files) {
    formattedThread.files = formatFiles(thread.files);
    return formattedThread;
  } else {
    return formattedThread;
  }
};

const formatMessage = message => {
  const formattedMessage = {
    slackId: message.id,
    ts: message.ts,
    text: message.text,
    type: 'message',
    channelName: message.channel,
    replies: null,
  };

  if (message.files) {
    formattedMessage.files = formatFiles(message.files);
    return formattedMessage;
  } else {
    return formattedMessage;
  }
};

const repliesHelper = (threadReplies, replies) => {
  const formattedReplies = [];

  // A message timestamp and reply timestamp is what connects a reply to a thread.
  for (let i = 0; i < threadReplies.length; i++) {
    for (let j = 0; j < replies.length; j++) {
      if (replies[j].ts === threadReplies[i].ts) {
        formattedReplies.push(replies[j]);
        // Delete the reply from the replies list.
        replies.splice(j, 1);
      } else {
        replies[j] = formatReply(replies[j]);
      }
    }
  }

  return formattedReplies;
};

const formatFiles = files => {
  const formatedFiles = [];
  for (let i = 0; i < files.length; i++) {
    formatedFiles.push({
      slackId: files.id,
      displayName: files.username,
      fileType: files.filetype,
      downloadUrl: files.url_private_download,
    });
  }

  return formatedFiles;
};

const formatMessagesHelper = messages => {
  const formatMessages = messages => {
    const threads = [];
    const replies = [];
    const regular = [];

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

    // Format each thread
    for (let i = 0; i < threads.length; i++) {
      threads[i] = formatThread(threads[i]);
    }

    // Format each message
    for (let i = 0; i < regular.length; i++) {
      regular[i] = formatMessage(regular[i]);
    }

    // For each thread, find replies for this file
    for (let i = 0; i < threads.length; i++) {
      let currentThread = threads[i];

      currentThread.replies = repliesHelper(currentThread.replies, replies);
    }

    // Spread all the different types of messages into a new list, and for any thread replies that are not in the list,  add them here as well.
    const formattedMessages = [...threads, ...regular, ...replies];

    formattedMessages.sort((a, b) => {
      return a.ts - b.ts;
    });

    return formattedMessages;
  };

  const completeFormattedMessages = formatMessages(messages);

  return completeFormattedMessages;
};

// This utility function will be invoked once there all the messages for every channel are read and formatted.
// Because replies can be in different files, we will have reply messages left over after we format messages. This fucntion will solve that problem
const findAllThreadReplies = messages => {
  for (let channelMessages in messages) {
    const channelReplies = [];

    // For each channel, find all left over replies
    for (let i = 0; i < messages[channelMessages].length; i++) {
      if (messages[channelMessages][i].type === 'reply') {
        channelReplies.push(messages[channelMessages][i]);
        // Remove leftover reply from the channel messages list
        messages[channelMessages].splice(i, 1);
      }
    }

    // After we find all leftover replies in a channel, we then search for the tread the channel belongs to then push into the threads replies property
    for (let i = 0; i < channelReplies.length; i++) {
      // For each reply, iterate thorugh messages[channelMessages] and find matching thread
      for (let j = 0; j < messages[channelMessages].length; j++) {
        if (messages[channelMessages][j].ts === channelReplies[i].thread_ts) {
          if (messages[channelMessages][j].replies === null) {
            messages[channelMessages][j].replies = [];
          }
          messages[channelMessages][j].replies.push(channelReplies[i]);
        }
      }
    }
  }
  return messages;
};

module.exports = { formatMessagesHelper, findAllThreadReplies };
