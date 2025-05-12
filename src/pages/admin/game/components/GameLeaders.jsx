import React from "react";
import { useGameLeaders } from "@/hooks/useGameLeaders";
import Loading from "@/components/common/FullLoading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
              <div>
                {/* Home Team Leader */}
                <LeaderCard
                  player={leader.home_team}
                  team={data.home_team}
                  stats={leader.stats}
                />

                {/* Away Team Leader */}
                <LeaderCard
                  player={leader.away_team}
                  team={data.away_team}
                  stats={leader.stats}
                />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

const LeaderCard = ({ player, team, stats }) => {
  const mainStat = stats.find(
    (stat) => stat.code === Object.keys(player.stats)[0]
  );
  const secondaryStat = stats.find(
    (stat) => stat.code === Object.keys(player.stats)[1]
  );
  const tertiaryStat = stats.find(
    (stat) => stat.code === Object.keys(player.stats)[2]
  );

  return (
    <div className="flex items-center gap-4 p-2 border-b">
      <Avatar className="h-12 w-12 border-2">
        <AvatarImage src={player.profile} alt={player.short_name} />
        <AvatarFallback>
          {player.player_name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col w-full text-xs">
        <div className="flex items-center gap-2">
          <span>{player.short_name},</span>
          <span className="text-muted-foreground">
            #{player.jersey_number} - {team.team_name}
          </span>
        </div>

        <div className="flex justify-between items-center mt-1">
          <div className="flex flex-col items-center">
            <span>
              {player.stats[mainStat?.code]}
            </span>
            <span className="text-muted-foreground">
              {mainStat?.display_name}
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span>
              {player.stats[secondaryStat?.code]}
            </span>
            <span className="text-muted-foreground">
              {secondaryStat?.display_name}
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span>
              {player.stats[tertiaryStat?.code]}
            </span>
            <span className="text-muted-foreground">
              {tertiaryStat?.display_name}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameLeaders;
