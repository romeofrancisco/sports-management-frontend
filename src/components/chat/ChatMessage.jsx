import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const ChatMessage = ({ message, currentUser, showDate, dateLabel }) => {
  const isCurrentUser = message.sender_id === currentUser?.id;

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      {showDate && (
        <div className="flex items-center justify-center my-4">
          <Badge variant="secondary" className="px-3 py-1">
            {dateLabel}
          </Badge>
        </div>
      )}
      <div className={cn(
        "flex gap-2 items-end",
        isCurrentUser ? "justify-end" : "justify-start"
      )}>
        {/* Avatar for other users */}
        {!isCurrentUser && (
          <Avatar className="h-8 w-8">
            <AvatarImage src={message.profile} />
            <AvatarFallback className="text-xs">
              {message.sender_name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
        )}
        <div className={cn(
          "relative max-w-[70%] px-4 py-2 rounded-2xl shadow-sm",
          isCurrentUser
            ? "bg-primary text-primary-foreground rounded-br-md ml-auto border border-primary/30"
            : "bg-muted rounded-bl-md border border-muted-foreground/10"
        )}>
          {/* Sender name for others */}
          {!isCurrentUser && (
            <p className="text-xs font-semibold mb-1 text-muted-foreground flex items-center gap-1">
              {message.sender_name}
              <Badge variant="outline" className="ml-1 text-xs">
                {message.sender_role}
              </Badge>
            </p>
          )}
          <p className="text-sm break-words whitespace-pre-line">{message.message}</p>
          <div className={cn(
            "flex w-full mt-1",
            isCurrentUser ? "justify-end" : "justify-start"
          )}>
            <span className="text-[11px] opacity-60">
              {formatTime(message.timestamp)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
