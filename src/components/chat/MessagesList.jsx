import React, { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";

const MessagesList = ({ messages, currentUser }) => {
  const scrollRef = useRef(null);
  const prevLength = useRef(0);

  // Sort messages by timestamp (oldest first)
  const sortedMessages = React.useMemo(() => {
    return [...messages].sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );
  }, [messages]);

  // Scroll to bottom on mount and when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    prevLength.current = sortedMessages.length;
  }, [sortedMessages.length]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div
      ref={scrollRef}
      className="h-full overflow-y-auto p-4 space-y-4 scroll-smooth"
    >
      {sortedMessages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-muted-foreground">No messages yet</p>
            <p className="text-sm text-muted-foreground">Start the conversation!</p>
          </div>
        </div>
      ) : (
        sortedMessages.map((message, index) => {
          const showDate =
            index === 0 ||
            formatDate(message.timestamp) !==
              formatDate(sortedMessages[index - 1]?.timestamp);

          return (
            <ChatMessage
              key={message.id}
              message={message}
              currentUser={currentUser}
              showDate={showDate}
              dateLabel={formatDate(message.timestamp)}
            />
          );
        })
      )}
    </div>
  );
};

export default MessagesList;
