import React from "react";
import { useGameLeaders } from "@/hooks/useGameLeaders";
import Loading from "@/components/common/FullLoading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InfoCard from "@/components/common/InfoCard";
import { Trophy, Medal, Target, Activity, Shield } from "lucide-react";

const GameLeaders = ({ game }) => {
  const { id: gameId } = game;
  const { data, isLoading } = useGameLeaders(gameId);

  if (isLoading) return <Loading />;
  if (!data) return <div>No game leaders data available</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2 border-b border-dashed pb-2">
          Game Leaders
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        <Tabs
          defaultValue={data.leaders[0]?.category_id?.toString() || "5"}
          className="w-full"
        >
          <TabsList className="w-full">
            {data.leaders.map((leader) => (
              <TabsTrigger
                key={leader.category_id}
                value={leader.category_id.toString()}
              >
                {leader.category}
              </TabsTrigger>
            ))}
          </TabsList>

          {data.leaders.map((leader) => (
            <TabsContent
              key={leader.category_id}
              value={leader.category_id.toString()}
            >
              <div className="grid">
                {/* Home Team Leader */}
                <PlayerLeaderInfoCard
                  player={leader.home_team}
                  team={data.home_team}
                  stats={leader.stats}
                  isHomeTeam={true}
                />

                {/* Away Team Leader */}
                <PlayerLeaderInfoCard
                  player={leader.away_team}
                  team={data.away_team}
                  stats={leader.stats}
                  isHomeTeam={false}
                />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

const PlayerLeaderInfoCard = ({ player, team, stats }) => {
  const mainStat = stats.find(
    (stat) => stat.code === Object.keys(player.stats)[0]
  );
  const mainStatCode = Object.keys(player.stats)[0];

  if (player.stats[mainStatCode] < 1) return null;

  // Generate additional stats from the rest of stats
  const additionalStats = Object.entries(player.stats)
    .filter(([code]) => code !== mainStatCode)
    .map(([code, value]) => {
      const statInfo = stats.find((s) => s.code === code);
      return {
        code,
        value,
        displayName: statInfo?.display_name || code
      };
    });

  return (
    <div className="flex items-center gap-4 p-3 border-b hover:bg-muted/10 transition-colors">
      <Avatar className="h-12 w-12 border-2">
        <AvatarImage src={player.profile} alt={player.short_name} />
        <AvatarFallback>
          {player.player_name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col w-full">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">{player.short_name}</span>
          <span className="text-muted-foreground text-xs">
            #{player.jersey_number} - {team.team_name}
          </span>
        </div>

        <div className="flex justify-around items-center mt-2">
          {/* Main Stat (Emphasized) */}
          <div className="flex flex-col items-center">
            <span className="font-bold text-base">{player.stats[mainStatCode]}</span>
            <span className="text-muted-foreground text-[10px] uppercase font-medium">
              {mainStat?.display_name || mainStatCode}
            </span>
          </div>

          {/* Additional Stats */}
          {additionalStats.map((stat) => (
            <div key={stat.code} className="flex flex-col items-center w-14">
              <span className="font-semibold text-sm">{stat.value}</span>
              <span className="text-muted-foreground text-[9px] truncate w-full text-center">
                {stat.displayName}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameLeaders;
