import React, { useMemo } from "react";
import { MessageCircleMore, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRolePermissions } from "@/hooks/useRolePermissions";
import { useTeamChats } from "@/hooks/useChat";
import { filterAndSortTeamChats, formatDateLabel } from "./utils";
import { ScrollArea } from "../ui/scroll-area";

const NavbarMessages = () => {
  const navigate = useNavigate();
  const { isPlayer } = useRolePermissions();
  const { data: teamChats = [], isLoading: loading } = useTeamChats();
  // Calculate total unread messages
  const unreadCount = useMemo(() => {
    const total = teamChats.reduce(
      (sum, chat) => sum + (chat.unread_count || 0),
      0
    );
    return total;
  }, [teamChats]);

  const filteredChats = useMemo(
    () => filterAndSortTeamChats(teamChats),
    [teamChats]
  );

  // For players, redirect directly to their team chat
  const handlePlayerChatClick = () => {
    if (teamChats.length > 0) {
      navigate(`/chat/team/${teamChats[0].team_id}`);
    }
  };

  // For admin/coach, navigate to specific team chat
  const handleTeamChatClick = (teamId) => {
    navigate(`/chat/team/${teamId}`);
  };

  // If user is a player, render simple button that redirects directly
  if (isPlayer()) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={handlePlayerChatClick}
        className="relative h-10 w-10 rounded-xl bg-gradient-to-r from-background/80 to-background/60 border border-border/50 hover:from-primary/10 hover:to-primary/5 hover:border-primary/30 transition-all duration-300"
        disabled={loading || teamChats.length === 0}
      >
        <MessageCircleMore className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </Badge>
        )}
      </Button>
    );
  }

  // For admin/coach, render dropdown with team list
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-10 w-10 rounded-xl bg-gradient-to-r from-background/80 to-background/60 border border-border/50 hover:from-primary/10 hover:to-primary/5 hover:border-primary/30 transition-all duration-300"
        >
          <MessageCircleMore className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-80 h-96 flex flex-col bg-gradient-to-br from-card via-card to-card/95 shadow-2xl border-2 border-primary/20 rounded-2xl backdrop-blur-md"
        sideOffset={8}
      >
        <DropdownMenuLabel className="font-semibold text-lg bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Team Messages
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

        {loading ? (
          <div className="flex items-center justify-center py-8 flex-1">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : teamChats.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground flex-1">
            <MessageCircleMore className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No team chats available</p>
          </div>
        ) : (
          <ScrollArea className="flex-1 min-h-0">
            {filteredChats.slice(0, 5).map((chat) => (
              <DropdownMenuItem
                key={chat.id}
                onClick={() => handleTeamChatClick(chat.team_id)}
                className="p-3 cursor-pointer hover:bg-primary/10 transition-all duration-300 focus:bg-primary/10"
              >
                <div className="flex items-center gap-3 w-full">
                  {/* Team Avatar/Logo placeholder */}
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={chat.logo}
                      alt={`${chat.team_name} logo`}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-bold">
                      {chat.team_name?.charAt(0) || "T"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm truncate w-0 flex-1 min-w-0">
                        {chat.team_name}
                      </p>
                      {chat.unread_count > 0 && (
                        <Badge
                          variant="secondary"
                          className="h-5 px-2 text-xs bg-primary/20 text-primary"
                        >
                          {chat.unread_count}
                        </Badge>
                      )}
                    </div>

                    {chat.latest_message ? (
                      <div className="flex items-center gap-1 mt-1">
                        <p className="text-xs text-muted-foreground truncate w-0 flex-1 min-w-0">
                          <span className="font-medium">
                            {chat.latest_message.sender_name}:
                          </span>{" "}
                          {chat.latest_message.message}
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 mt-1">
                        <p className="text-xs text-muted-foreground truncate w-0 flex-1 min-w-0">
                          No messages yet
                        </p>
                      </div>
                    )}

                    {chat.latest_message?.timestamp && (
                      <p className="text-xs text-muted-foreground">
                        {formatDateLabel(chat.latest_message.timestamp)}
                      </p>
                    )}
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </ScrollArea>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => navigate("/chat/team")}
          className="p-3 cursor-pointer hover:bg-primary/10 transition-all duration-300 text-center font-medium text-primary"
        >
          View All Chats
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavbarMessages;
