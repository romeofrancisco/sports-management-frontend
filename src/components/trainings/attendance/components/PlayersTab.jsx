import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

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
          <div className="space-y-4">
            {playersData.map((player, index) => (
              <div 
                key={player.player_id} 
                className={cn(
                  "flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors",
                  "hover:bg-muted/50",
                  selectedPlayer?.player_id === player.player_id && "bg-muted/50 border-primary"
                )}
                onClick={() => onPlayerSelect(player)}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{player.player_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {player.total_sessions} sessions
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant={player.attendance_rate >= 80 ? "default" : "secondary"}>
                    {player.attendance_rate}%
                  </Badge>
                  <div className="text-right text-sm">
                    <div className="text-green-600">Present: {player.present_count}</div>
                    <div className="text-red-600">Absent: {player.absent_count}</div>
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
