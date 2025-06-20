import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatTime } from "@/utils/formatDate";
import { formatDateLabel } from "./utils";

const ChatMessage = ({
  message,
  currentUser,
  showDate,
  dateLabel,
  activeTimeId,
  setActiveTimeId,
}) => {
  const isCurrentUser = message.sender_id === currentUser?.id;

  // Provide fallback for setActiveTimeId to avoid errors if not passed
  const handleShowTime = () => {
    if (activeTimeId === message.id) {
      setActiveTimeId(null);
    } else {
      setActiveTimeId(message.id);
    }
  };
  return (
    <div>
      {" "}
      {(showDate || activeTimeId === message.id) && (
        <div className="flex items-center justify-center my-4">
          <span className="text-xs sm:text-sm text-muted-foreground">
            {showDate ? dateLabel : formatDateLabel(message.timestamp)}
          </span>
        </div>
      )}
      <div
        className={cn(
          "flex gap-2 items-end",
          isCurrentUser ? "justify-end" : "justify-start"
        )}
      >
        {/* Avatar for other users */}
        {!isCurrentUser && (
          <Avatar className="size-9">
            <AvatarImage
              src={message.sender_profile}
              alt={`${message.sender_name}'s profile picture`}
            />
            <AvatarFallback className="text-xs">
              {message.sender_name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
        )}
        <div>
          {/* Sender name for others */}
          {!isCurrentUser && (
            <p className="text-sm font-semibold mb-1 text-muted-foreground flex items-center gap-0.5">
              {message.sender_name}
              {message.sender_role !== "Player" && (
                <span className="text-sm text-primary/80">
                  ({message.sender_role})
                </span>
              )}
            </p>
          )}
          <div
            onClick={handleShowTime}
            className={cn(
              "relative max-w-[70%] px-4 py-2 rounded-2xl shadow-sm cursor-pointer select-text",
              isCurrentUser
                ? "bg-primary/90 text-primary-foreground rounded-br-md ml-auto border border-primary/30"
                : "bg-muted rounded-bl-md border border-muted-foreground/10"
            )}
          >
            <p className="text-sm break-words whitespace-pre-line">
              {message.message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
