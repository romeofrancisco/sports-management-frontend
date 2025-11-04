import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TrophyIcon, Medal } from "lucide-react";

const TournamentTopTeams = ({ standings }) => {
  // Get top 5 teams from standings
  const topTeams = standings?.slice(0, 5) || [];

  if (topTeams.length === 0) {
    return <EmptyState />;
  }

  return (
    <Card className="bg-gradient-to-br from-card via-card to-card/95 shadow-xl border-2 border-primary/20 transition-all duration-300 hover:shadow-2xl hover:border-primary/30 relative overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/10 to-transparent rounded-full blur-2xl opacity-70"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-xl opacity-60"></div>
      
      <CardHeader className="relative pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-secondary to-secondary/80 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110">
            <TrophyIcon className="h-5 w-5 text-secondary-foreground" />
          </div>
          <div>
            <CardTitle className="text-xl md:text-2xl font-bold tracking-tight text-gradient">
              Top Teams
            </CardTitle>
            <CardDescription>
              Current standings leaders
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="relative p-6 pt-0">
        <div className="space-y-3">
          {topTeams.map((team, index) => (
            <TeamItem key={team.team_id} team={team} rank={index + 1} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Empty state component
const EmptyState = () => (
  <Card className="bg-gradient-to-br from-card via-card to-card/95 shadow-xl border-2 border-primary/20 transition-all duration-300 hover:shadow-2xl hover:border-primary/30 relative overflow-hidden">
    {/* Enhanced background effects */}
    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/10 to-transparent rounded-full blur-2xl opacity-70"></div>
    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-xl opacity-60"></div>
    
    <CardHeader className="relative pb-4">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-gradient-to-br from-secondary to-secondary/80 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110">
          <TrophyIcon className="h-5 w-5 text-secondary-foreground" />
        </div>
        <div>
          <CardTitle className="text-xl md:text-2xl font-bold tracking-tight text-gradient">
            Top Teams
          </CardTitle>
          <CardDescription>
            Current standings leaders
          </CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent className="relative p-6 flex items-center justify-center h-48">
      <div className="text-center text-muted-foreground">
        No standings data available
      </div>
    </CardContent>
  </Card>
);

// Team item component
const TeamItem = ({ team, rank }) => {
  const getTeamInitials = (teamName) => {
    if (!teamName) return "?";
    return teamName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return "from-yellow-500/20 to-yellow-600/20 border-yellow-500/30";
      case 2:
        return "from-slate-400/20 to-slate-500/20 border-slate-400/30";
      case 3:
        return "from-orange-600/20 to-orange-700/20 border-orange-600/30";
      default:
        return "from-muted/20 to-muted/10 border-border/30";
    }
  };

  const getRankIcon = (rank) => {
    if (rank <= 3) {
      return <Medal className="h-4 w-4" />;
    }
    return <span className="text-sm font-bold">{rank}</span>;
  };

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 hover:shadow-md bg-gradient-to-r ${getRankColor(
        rank
      )}`}
    >
      {/* Rank Badge */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${
          rank === 1
            ? "bg-gradient-to-br from-yellow-500 to-yellow-600 text-white"
            : rank === 2
            ? "bg-gradient-to-br from-slate-400 to-slate-500 text-white"
            : rank === 3
            ? "bg-gradient-to-br from-orange-600 to-orange-700 text-white"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {getRankIcon(rank)}
      </div>

      {/* Team Logo/Avatar */}
      <Avatar className="h-10 w-10 border-2 border-primary/20">
        <AvatarImage src={team.team_logo} alt={team.team_name} />
        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-sm font-semibold">
          {getTeamInitials(team.team_name)}
        </AvatarFallback>
      </Avatar>

      {/* Team Info */}
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm truncate">{team.team_name}</div>
        <div className="text-xs text-muted-foreground">
          {team.wins || 0}W - {team.losses || 0}L
        </div>
      </div>

      {/* Points */}
      <div className="flex-shrink-0 text-right">
        <div className="font-bold text-lg">{team.points || 0}</div>
        <div className="text-xs text-muted-foreground">pts</div>
      </div>
    </div>
  );
};

export default TournamentTopTeams;
