import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

const TeamChatList = ({ 
  teamChats, 
  selectedChat, 
  loading 
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-primary/10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <MessageCircle className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">Teams</h2>
            <p className="text-xs text-muted-foreground">Select a team to chat</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
                <p className="text-sm text-muted-foreground">Loading teams...</p>
              </div>
            </div>
          ) : teamChats.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="p-4 rounded-full bg-muted/50 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <MessageCircle className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="font-medium text-sm mb-1">No team chats available</p>
              <p className="text-xs text-muted-foreground">You'll see your team chats here</p>
            </div>          ) : (
            <div className="p-3 space-y-2">
              {teamChats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => navigate(`/chat/team/${chat.team_id}`)}
                  className={cn(
                    "w-full text-left p-4 rounded-lg transition-all duration-200 group relative",
                    "hover:bg-primary/5 hover:border-primary/20 border border-transparent",
                    selectedChat?.id === chat.id && "bg-gradient-to-r from-primary/10 to-secondary/5 border-primary/30 shadow-sm"
                  )}
                >
                  {/* Selection indicator */}
                  {selectedChat?.id === chat.id && (
                    <div className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-primary to-secondary rounded-r-full"></div>
                  )}
                  
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {chat.logo ? (
                        <div className="relative">
                          <img 
                            src={chat.logo} 
                            alt={`${chat.team_name} logo`}
                            className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/20"
                          />
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                          <span className="text-xs font-bold text-primary">
                            {chat.team_name?.charAt(0) || 'T'}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                          {chat.team_name}
                        </p>
                      </div>
                    </div>
                    
                    {chat.unread_count > 0 && (
                      <div className="flex items-center gap-1">
                        <Badge 
                          variant="secondary" 
                          className="h-6 px-2 text-xs bg-gradient-to-r from-primary/80 to-secondary/80 text-white border-0 animate-pulse"
                        >
                          {chat.unread_count > 99 ? '99+' : chat.unread_count}
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  {chat.latest_message && (
                    <div className="text-xs text-muted-foreground truncate pl-11">
                      <span className="font-medium text-primary/80">{chat.latest_message.sender_name}:</span>{' '}
                      {chat.latest_message.message}
                    </div>
                  )}
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
