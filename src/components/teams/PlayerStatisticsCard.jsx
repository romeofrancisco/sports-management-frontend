import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Users, Target, Activity, Award } from "lucide-react";

const PlayerStatisticsCard = ({ players = [], stats = {} }) => {
  const {
    total_players = players.length,
    active_players = 0,
    average_performance = 0,
    top_performer = null
  } = stats;

  const getPlayerInitials = (player) => {
    if (player.name) {
      return player.name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return 'NA';
  };

  const getPerformanceBadge = (performance) => {
    if (performance >= 80) return { variant: "default", color: "text-green-600", label: "Excellent" };
    if (performance >= 60) return { variant: "secondary", color: "text-blue-600", label: "Good" };
    if (performance >= 40) return { variant: "outline", color: "text-yellow-600", label: "Average" };
    return { variant: "destructive", color: "text-red-600", label: "Needs Improvement" };
  };

  return (
    <Card className="bg-gradient-to-br from-card via-card to-card/95 shadow-xl border-2 border-primary/20 transition-all duration-500 hover:shadow-2xl hover:border-primary/30">
      <CardHeader>
        <CardTitle className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Player Statistics
        </CardTitle>
        <CardDescription>
          Team player performance overview
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Users className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium">Total Players</p>
              <p className="text-lg font-bold">{total_players}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Activity className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-sm font-medium">Active</p>
              <p className="text-lg font-bold">{active_players}</p>
            </div>
          </div>
        </div>

        {/* Average Performance */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-secondary" />
              <span className="text-sm font-medium">Team Performance</span>
            </div>
            <span className="text-sm font-bold">{average_performance}%</span>
          </div>
          <Progress value={average_performance} className="h-2" />
        </div>

        {/* Top Performer */}
        {top_performer && (
          <div className="p-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Top Performer</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={top_performer.avatar} />
                <AvatarFallback className="text-xs">
                  {getPlayerInitials(top_performer)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-semibold">{top_performer.name}</p>
                <p className="text-xs text-muted-foreground">{top_performer.position}</p>
              </div>
              <Badge variant="outline" className="text-green-600 border-green-600">
                {top_performer.performance}%
              </Badge>
            </div>
          </div>
        )}

        {/* Recent Players List */}
        {players.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Recent Players
            </h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {players.slice(0, 3).map((player, index) => {
                const badge = getPerformanceBadge(player.performance || 0);
                return (
                  <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={player.avatar} />
                      <AvatarFallback className="text-xs">
                        {getPlayerInitials(player)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-xs font-medium">{player.name || 'Unknown Player'}</p>
                      <p className="text-xs text-muted-foreground">{player.position || 'Position'}</p>
                    </div>
                    <Badge variant={badge.variant} className={`text-xs ${badge.color}`}>
                      {badge.label}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {players.length === 0 && (
          <div className="text-center py-6">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No player data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlayerStatisticsCard;