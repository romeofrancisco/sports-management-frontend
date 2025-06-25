import React, { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircleMore, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "../ui/input";
import { filterAndSortTeamChats } from "./utils";

const TeamChatList = ({ teamChats, selectedChat, loading }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  // Filter and sort chats
  const filteredChats = useMemo(
    () => filterAndSortTeamChats(teamChats, search),
    [teamChats, search]
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-2 lg:p-4 border-b-2 border-primary/20">
        <div className="flex justify-center lg:justify-start items-center gap-2">
          <div className="p-3 aspect-square size-full lg:size-auto grid place-content-center rounded-lg bg-primary/20">
            <MessageCircleMore className="size-6 sm:size-9 lg:size-6 text-primary" />
          </div>
          <div className="hidden lg:block">
            <h2 className="font-semibold text-lg">Teams</h2>
            <p className="text-xs text-muted-foreground">
              Select a team to chat
            </p>
          </div>
        </div>
        <div className="hidden lg:block relative mt-2">
          <Search className="size-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-7"
            placeholder="Search teams..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Content */}
      <div className="overflow-hidden">
        <ScrollArea className="h-full">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
                <p className="text-sm text-muted-foreground">
                  Loading teams...
                </p>
              </div>
            </div>
          ) : teamChats.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="p-4 rounded-full bg-muted/50 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <MessageCircleMore className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="font-medium text-sm mb-1">
                No team chats available
              </p>
              <p className="text-xs text-muted-foreground">
                You'll see your team chats here
              </p>
            </div>
          ) : (
            <div className="p-1 sm:p-2 lg:p-3 grid gap-1">
              {filteredChats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => navigate(`/chat/team/${chat.team_id}`)}
                  className={cn(
                    "text-left py-2  lg:px-4 lg:py-2.5 rounded-lg transition-all duration-500 group relative",
                    selectedChat?.id === chat.id
                      ? "bg-gradient-to-r from-primary/20 to-primary/15 shadow-sm"
                      : "hover:bg-gradient-to-r hover:from-secondary/10 hover:to-secondary/5"
                  )}
                >
                  <div className="flex items-center justify-between relative">
                    <div className="flex items-center justify-center lg:justify-start gap-3 flex-1 min-w-0">
                      <Avatar className="size-8 sm:size-9 md:size-12 ring-2 ring-primary/20">
                        <AvatarImage
                          src={chat.logo}
                          alt={`${chat.team_name} logo`}
                        />
                        <AvatarFallback>{chat.team_name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="hidden lg:block truncate w-0 flex-1 min-w-0">
                        <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors truncate">
                          {chat.team_name}
                        </p>
                        {chat.latest_message ? (
                          <div className="text-xs text-muted-foreground truncate w-full">
                            <span className="font-medium text-primary/80">
                              {chat.latest_message.sender_name}:
                            </span>{" "}
                            {chat.latest_message.message}
                          </div>
                        ) : (
                          <div className="text-xs text-muted-foreground truncate w-full">
                            No messages yet
                          </div>
                        )}
                      </div>

                      {chat.unread_count > 0 && (
                        <div className="absolute -top-1 -right-1 lg:relative flex items-center gap-1">
                          <div className="rounded-full bg-destructive size-5 grid place-content-center text-[0.6rem] lg:text-xs text-white">
                            {chat.unread_count > 99 ? "99+" : chat.unread_count}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

export default TeamChatList;
