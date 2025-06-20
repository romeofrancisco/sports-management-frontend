import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const TeamChatList = ({ 
  teamChats, 
  selectedChat, 
  onSelectChat, 
  loading 
}) => {
  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Teams
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-16rem)]">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : teamChats.length === 0 ? (
            <div className="text-center py-8 px-4">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm text-muted-foreground">No team chats available</p>
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {teamChats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => onSelectChat(chat)}
                  className={cn(
                    "w-full text-left p-3 rounded-lg transition-all duration-200",
                    "hover:bg-muted/50",
                    selectedChat?.id === chat.id && "bg-primary/10 border-l-2 border-primary"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {chat.logo && (
                        <img 
                          src={chat.logo} 
                          alt={`${chat.team_name} logo`}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      )}
                      <p className="font-medium text-sm">{chat.team_name}</p>
                    </div>
                    {chat.unread_count > 0 && (
                      <Badge variant="secondary" className="h-5 px-2 text-xs">
                        {chat.unread_count}
                      </Badge>
                    )}
                  </div>
                  {chat.latest_message && (
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {chat.latest_message.sender_name}: {chat.latest_message.message}
                    </p>
                  )}
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default TeamChatList;
