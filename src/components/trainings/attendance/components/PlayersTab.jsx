import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Target, Trophy, Calendar, TrendingUp, User } from 'lucide-react';

const PlayersTab = ({ playersData, selectedPlayer, onPlayerSelect }) => {
  if (!playersData || playersData.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-40">
          <p className="text-muted-foreground">No player data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Player Attendance Statistics</CardTitle>
        <p className="text-sm text-muted-foreground">Click on a player to view their detailed dashboard</p>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-4">            {playersData.map((player, index) => (
              <div 
                key={player.player_id} 
                className={cn(
                  "flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all duration-200",
                  "hover:bg-muted/50 hover:shadow-md",
                  selectedPlayer?.player_id === player.player_id && "bg-muted/50 border-primary shadow-sm"
                )}
                onClick={() => onPlayerSelect(player)}
              >                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="h-10 w-10 border-2 border-primary/20">
                      <AvatarImage 
                        src={player?.profile || player?.user?.profile} 
                        alt={player.player_name} 
                      />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-bold text-sm">
                        {player?.jersey_number || (index + 1) ? (
                          <span className="text-xs">#{player?.jersey_number || (index + 1)}</span>
                        ) : player?.profile ? (
                          <User className="h-5 w-5" />
                        ) : (
                          player.player_name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || '??'
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground truncate mb-1">
                      {player.player_name}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {player.total_sessions} sessions
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {player.present_count} present
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge 
                    variant={player.attendance_rate >= 80 ? "default" : "secondary"}
                    className={cn(
                      "font-semibold",
                      player.attendance_rate >= 80 ? "bg-green-100 text-green-800 border-green-200" :
                      player.attendance_rate >= 60 ? "bg-yellow-100 text-yellow-800 border-yellow-200" :
                      "bg-red-100 text-red-800 border-red-200"
                    )}
                  >
                    {player.attendance_rate.toFixed(1)}%
                  </Badge>
                  <div className="text-right text-sm">
                    <div className="text-green-600 font-medium">Present: {player.present_count}</div>
                    <div className="text-red-600 font-medium">Absent: {player.absent_count}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default PlayersTab;
