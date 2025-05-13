import React from "react";
import { useLeagueLeaders } from "@/hooks/useLeagueLeaders";
import Loading from "@/components/common/FullLoading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, Target, Activity, Shield, Star } from "lucide-react";
import InfoCard from "@/components/common/InfoCard";

const LeagueLeaders = ({ leagueId }) => {
  const { data, isLoading } = useLeagueLeaders(leagueId);
  
  if (isLoading) return (
    <Card className="rounded-lg overflow-hidden border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" /> League Leaders
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 flex items-center justify-center h-48">
        <Loading size="sm" />
      </CardContent>
    </Card>
  );
  
  if (!data || !data.leaders || data.leaders.length === 0) {
    return (
      <Card className="rounded-lg overflow-hidden border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" /> League Leaders
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 flex items-center justify-center h-48">
          <div className="text-center text-muted-foreground">
            No league leaders data available
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="rounded-lg overflow-hidden border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" /> League Leaders
          <span className="text-xs font-normal text-muted-foreground ml-auto">
            All-time stats across {data.seasons_count} seasons
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <Tabs
          defaultValue={data.leaders[0]?.category_id?.toString() || ""}
          className="w-full"
        >
          <TabsList className="w-full mb-3 h-9">
            {data.leaders.map((leader) => (
              <TabsTrigger
                key={leader.category_id}
                value={leader.category_id.toString()}
                className="text-xs"
              >
                {leader.category}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {data.leaders.map((leader) => (
            <TabsContent
              key={leader.category_id}
              value={leader.category_id.toString()}
              className="space-y-3"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Show top 2 leaders with InfoCard */}
                {leader.leaders.slice(0, 2).map((player, index) => (
                  <TopLeaderInfoCard
                    key={player.player_id}
                    player={player}
                    stats={leader.stats}
                    rank={index + 1}
                  />
                ))}
              </div>
              
              {/* Show remaining leaders in a list */}
              <div className="bg-muted/20 rounded-md overflow-hidden">
                {leader.leaders.slice(2, 5).map((player, index) => (
                  <PlayerLeaderCard
                    key={player.player_id}
                    player={player}
                    stats={leader.stats}
                    rank={index + 3}
                    isLast={index === Math.min(2, leader.leaders.slice(2).length - 1)}
                  />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

// Component for top leaders with InfoCard
const TopLeaderInfoCard = ({ player, stats, rank }) => {
  // Find the main stat
  const statCodes = Object.keys(player.stats).slice(0, 4);
  const mainStatCode = statCodes[0];
  const mainStat = stats.find(s => s.code === mainStatCode);
  
  // Get additional stats as a string
  const additionalStats = statCodes.slice(1).map(code => {
    const stat = stats.find(s => s.code === code);
    return `${stat?.display_name || code}: ${player.stats[code]}`;
  }).join(' | ');

  // Choose an icon based on the stat type or rank
  let icon;
  if (rank === 1) {
    icon = <Trophy className="h-5 w-5 text-amber-500" />;
  } else if (mainStat?.category === 'scoring') {
    icon = <Target className="h-5 w-5 text-green-500" />;
  } else if (mainStat?.category === 'defensive') {
    icon = <Shield className="h-5 w-5 text-blue-500" />;
  } else if (mainStat?.category === 'offensive') {
    icon = <Activity className="h-5 w-5 text-purple-500" />;
  } else {
    icon = <Star className="h-5 w-5 text-violet-500" />;
  }
  
  return (
    <InfoCard
      title={mainStat?.display_name || mainStatCode}
      value={player.stats[mainStatCode]}
      icon={icon}
      description={
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6 border">
            <AvatarImage src={player.profile} alt={player.player_name} />
            <AvatarFallback className="text-xs">
              {player.player_name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-xs font-medium">{player.player_name}</span>
            <span className="text-[10px] text-muted-foreground">{additionalStats}</span>
          </div>
        </div>
      }
      className={`hover:shadow-md transition-all duration-300 ${rank === 1 ? 'border-l-4 border-l-amber-400' : 'border-l-2 border-l-blue-300'}`}
    />
  );
};

// Component for the remaining players
const PlayerLeaderCard = ({ player, stats, rank, isLast }) => {
  // Find the main stat and up to 3 additional stats (4 total)
  const statCodes = Object.keys(player.stats).slice(0, 4);
  
  // Get the main stat (first one)
  const mainStatCode = statCodes[0];
  const mainStat = stats.find(s => s.code === mainStatCode);
  
  // Get additional stats (up to 3 more)
  const additionalStats = statCodes.slice(1).map(code => {
    const stat = stats.find(s => s.code === code);
    return {
      code,
      displayName: stat?.display_name || code,
      value: player.stats[code]
    };
  });

  return (
    <div className={`flex items-center gap-2 py-2 px-3 ${!isLast ? 'border-b border-border/40' : ''} hover:bg-muted/40 transition-colors`}>
      <div className="w-6 h-6 flex items-center justify-center rounded-full bg-muted/40 font-semibold text-xs">
        {rank}
      </div>
      
      <Avatar className="h-8 w-8 border">
        <AvatarImage src={player.profile} alt={player.short_name} />
        <AvatarFallback>
          {player.player_name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-1 justify-between items-center text-xs">
        <div className="flex flex-col ml-1">
          <div className="font-medium">{player.short_name}</div>
          <div className="text-[10px] text-muted-foreground">
            #{player.jersey_number} | {player.team_abbreviation || player.team_name}
          </div>
        </div>

        <div className="flex gap-4 items-center">
          {/* Main Stat (Emphasized) */}
          <div className="flex flex-col items-center">
            <span className="font-bold text-base">{player.stats[mainStatCode]}</span>
            <span className="text-muted-foreground text-[9px] uppercase font-medium">
              {mainStat?.display_name || mainStatCode}
            </span>
          </div>

          {/* Additional Stats */}
          {additionalStats.map((stat) => (
            <div key={stat.code} className="flex flex-col items-center w-12">
              <span className="font-semibold text-sm">{stat.value}</span>
              <span className="text-muted-foreground text-[8px] truncate w-full text-center">
                {stat.displayName}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeagueLeaders;
