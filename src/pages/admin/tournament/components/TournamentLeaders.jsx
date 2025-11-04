import React from "react";
import { useTournamentLeaders } from "@/hooks/useTournaments";
import Loading from "@/components/common/FullLoading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import LeaderCard from "../../league/components/standings/LeaderCard";

const TournamentLeaders = ({ tournamentId }) => {
  const { data, isLoading } = useTournamentLeaders(tournamentId);

  if (isLoading) {
    return <LoadingState />;
  }
  
  if (!data?.leaders?.length) {
    return <EmptyState />;
  }

  return <LeaderContent data={data} />;
};

// Loading state component
const LoadingState = () => (
  <Card className="bg-gradient-to-br from-card via-card to-card/95 shadow-xl border-2 border-primary/20 transition-all duration-300 hover:shadow-2xl hover:border-primary/30 relative overflow-hidden">
    {/* Enhanced background effects */}
    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/10 to-transparent rounded-full blur-2xl opacity-70"></div>
    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-xl opacity-60"></div>
    
    <CardHeader className="relative pb-4">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110">
          <Trophy className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <CardTitle className="text-xl md:text-2xl font-bold tracking-tight text-gradient">
            Tournament Leaders
          </CardTitle>
          <CardDescription>
            Top performers in this tournament
          </CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent className="relative p-6 flex items-center justify-center h-48">
      <Loading size="sm" />
    </CardContent>
  </Card>
);

// Empty state component
const EmptyState = () => (
  <Card className="bg-gradient-to-br from-card via-card to-card/95 shadow-xl border-2 border-primary/20 transition-all duration-300 hover:shadow-2xl hover:border-primary/30 relative overflow-hidden">
    {/* Enhanced background effects */}
    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/10 to-transparent rounded-full blur-2xl opacity-70"></div>
    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-xl opacity-60"></div>
    
    <CardHeader className="relative pb-4">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110">
          <Trophy className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <CardTitle className="text-xl md:text-2xl font-bold tracking-tight text-gradient">
            Tournament Leaders
          </CardTitle>
          <CardDescription>
            Top performers in this tournament
          </CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent className="relative p-6 flex items-center justify-center h-48">
      <div className="text-center text-muted-foreground">
        No tournament leaders data available
      </div>
    </CardContent>
  </Card>
);

// Main content component
const LeaderContent = ({ data }) => (
  <Card className="bg-gradient-to-br from-card via-card to-card/95 shadow-xl border-2 border-primary/20 transition-all duration-300 hover:shadow-2xl hover:border-primary/30 relative overflow-hidden">
    {/* Enhanced background effects */}
    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/10 to-transparent rounded-full blur-2xl opacity-70"></div>
    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-xl opacity-60"></div>
    <CardHeader className="relative">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110">
          <Trophy className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <CardTitle className="text-xl md:text-2xl font-bold tracking-tight text-gradient">
            Tournament Leaders
          </CardTitle>
          <CardDescription>
            Top performers in this tournament
          </CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent className="relative p-6 pt-3">
      <LeaderTabs leaders={data.leaders} />
    </CardContent>
  </Card>
);

// Tabs component
const LeaderTabs = ({ leaders }) => (
  <Tabs
    defaultValue={leaders[0]?.category_id?.toString() || ""}
    className="w-full"
  >
    <TabsList className="w-full mb-4 h-9 bg-muted/30">
      {leaders.map((leader) => (
        <TabsTrigger
          key={leader.category_id}
          value={leader.category_id.toString()}
          className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          {leader.category}
        </TabsTrigger>
      ))}
    </TabsList>
    
    {leaders.map((leader) => (
      <TabsContent
        key={leader.category_id}
        value={leader.category_id.toString()}
        className="space-y-3"
      >
        <LeaderCategory leader={leader} />
      </TabsContent>
    ))}
  </Tabs>
);

// Individual category content
const LeaderCategory = ({ leader }) => (
  <>
    {/* Top leader spotlight - #1 player */}
    {leader.leaders.length > 0 && (
      <div className="mb-4">
        <LeaderCard
          key={leader.leaders[0].player_id}
          player={leader.leaders[0]}
          stats={leader.stats}
          rank={1}
          isLeader
        />
      </div>
    )}
    
    {/* Other top performer and remaining players */}
    {leader.leaders.length > 1 && (
      <div className="space-y-3">
        {/* Second place in a more compact format */}
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-border/30">
          <PlayerListItem
            key={leader.leaders[1].player_id}
            player={leader.leaders[1]}
            stats={leader.stats}
            rank={2}
            isOther
          />
        </div>
        
        {/* Remaining leaders (3-5) in list format */}
        {leader.leaders.length > 2 && (
          <div className="bg-gradient-to-r from-muted/20 to-muted/10 rounded-lg overflow-hidden border border-border/30">
            {leader.leaders.slice(2, 5).map((player, index) => (
              <PlayerListItem
                key={player.player_id}
                player={player}
                stats={leader.stats}
                rank={index + 3}
                isLast={index === Math.min(2, leader.leaders.slice(2).length - 1)}
              />
            ))}
          </div>
        )}
      </div>
    )}
  </>
);

// PlayerListItem component for compact player display
const PlayerListItem = ({ player, stats, rank, isOther = false, isLast = false }) => {
  const statCodes = Object.keys(player.stats || {}).slice(0, 2);
  const mainStat = stats?.find(s => s.code === statCodes[0]);
  
  // Get player initials safely
  const getPlayerInitials = (playerName) => {
    if (!playerName) return "?";
    return playerName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div
      className={`flex items-center gap-3 p-3 transition-all duration-200 hover:bg-muted/50 ${
        !isLast ? "border-b border-border/30" : ""
      }`}
    >
      {/* Rank Badge */}
      <div
        className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
          rank === 2
            ? "bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {rank}
      </div>

      {/* Player Info */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="relative flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-xs font-semibold">
            {getPlayerInitials(player.player_name)}
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-medium text-sm truncate">{player.player_name}</div>
          {player.team_name && (
            <div className="text-xs text-muted-foreground truncate">
              {player.team_name}
            </div>
          )}
        </div>
      </div>

      {/* Main Stat */}
      <div className="flex-shrink-0 text-right">
        <div className="font-bold text-sm">
          {player.stats?.[statCodes[0]] ?? 0}
        </div>
        {mainStat && (
          <div className="text-xs text-muted-foreground">{mainStat.name}</div>
        )}
      </div>
    </div>
  );
};

export default TournamentLeaders;
