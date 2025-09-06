import React, { useMemo, useState } from "react";
import { useBoxscore } from "@/hooks/useStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DataTable from "@/components/common/DataTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSelector } from "react-redux";
import { getPeriodLabel, SCORING_TYPE_VALUES } from "@/constants/sport";
import Loading from "@/components/common/FullLoading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Boxscore = ({ game }) => {
  const scoring_type = game?.sport_scoring_type;
  const { data: boxscoreData, isLoading } = useBoxscore(game?.id);
  const [selectedPeriod, setSelectedPeriod] = useState("total");

  // Get periods available from boxscore data
  const availablePeriods = useMemo(() => {
    if (!boxscoreData) return ["total"];

    const periods = new Set(["total"]);

    // Extract periods from player data
    const homeTeamData = boxscoreData?.home_team;
    if (homeTeamData?.players && homeTeamData.players.length > 0) {
      const firstPlayer = homeTeamData.players[0];
      if (firstPlayer?.periods) {
        firstPlayer.periods.forEach((period) => {
          periods.add(String(period.period));
        });
      }
    }

    return Array.from(periods).sort((a, b) => {
      if (a === "total") return 1;
      if (b === "total") return -1;
      return parseInt(a) - parseInt(b);
    });
  }, [boxscoreData]);

  // Get all stat names as column headers
  const allStatNames = useMemo(() => {
    if (!boxscoreData) return [];

    const stats = new Set();

    // Collect all possible stats from both teams' players
    ["home_team", "away_team"].forEach((team) => {
      if (boxscoreData[team]?.players) {
        boxscoreData[team].players.forEach((player) => {
          if (player.total_stats) {
            Object.keys(player.total_stats).forEach((stat) => stats.add(stat));
          }
        });
      }
    });

    return Array.from(stats);
  }, [boxscoreData]);

  // Process data for each team's table
  const processTeamData = (teamKey) => {
    if (!boxscoreData) return [];

    const teamData = boxscoreData[teamKey];
    if (!teamData || !teamData.players) return [];

    return teamData.players.map((player) => {
      const rowData = {
        id: player.id,
        name: player.name,
        jersey_number: player.jersey_number,
      };

      // Add points for the player - handle both period-specific and total
      if (scoring_type === SCORING_TYPE_VALUES.SETS) {
        if (selectedPeriod !== "total") {
          const periodData = player.periods?.find(
            (p) => p.period === parseInt(selectedPeriod)
          );
          rowData.points = periodData?.points || 0;
        } else {
          // Use the pre-calculated total points
          rowData.total_points = player.total_points || 0;
        }
      } else {
        // For points scoring type, use the pre-calculated total value
        rowData.total_points = player.total_points || 0;
      }

      // Add stats to row data
      allStatNames.forEach((statName) => {
        const isTeamTotal =
          player.id === "home_team_total" || player.id === "away_team_total";
        const isPercentage = statName.includes("%");

        // Get the stat value directly from the player data
        let statValue;
        if (scoring_type === SCORING_TYPE_VALUES.SETS) {
          if (selectedPeriod === "total") {
            statValue = player.total_stats?.[statName];
          } else {
            const periodData = player.periods?.find(
              (p) => p.period === parseInt(selectedPeriod)
            );
            statValue = periodData?.stats?.[statName];
          }
        } else {
          // For points scoring type, always use the total value
          statValue = player.total_stats?.[statName];
        }

        // Special handling for team totals with percentage stats when the backend doesn't provide them
        if (
          isTeamTotal &&
          isPercentage &&
          (statValue === undefined || statValue === null)
        ) {
          // Calculate percentage from ratio (e.g., "14/15" → 93.33%)
          const baseStatName = statName.replace("%", "");
          const ratioValue = player.total_stats?.[baseStatName];

          if (
            ratioValue &&
            typeof ratioValue === "string" &&
            ratioValue.includes("/")
          ) {
            const [makes, attempts] = ratioValue.split("/").map(Number);
            if (attempts > 0) {
              const percentage = (makes / attempts) * 100;
              // Round to 2 decimal places
              rowData[statName] = Number(percentage.toFixed(2));
            } else {
              rowData[statName] = 0;
            }
          } else {
            rowData[statName] = 0;
          }
        } else {
          // Use the value directly from the backend
          rowData[statName] = statValue;
        }
      });

      return rowData;
    });
  };

  // Generate table data for both teams
  const homeTeamData = useMemo(
    () => processTeamData("home_team"),
    [boxscoreData, selectedPeriod, allStatNames, scoring_type]
  );
  const awayTeamData = useMemo(
    () => processTeamData("away_team"),
    [boxscoreData, selectedPeriod, allStatNames, scoring_type]
  );

  // Generate columns
  const columns = useMemo(() => {
    const baseColumns = [
      {
        accessorKey: "player",
        header: () => <span className="ps-4">Player</span>,
        cell: ({ row }) => {
          const { jersey_number, name, id } = row.original;
          const isTeamTotal =
            id === "home_team_total" || id === "away_team_total";

          return (
            <div
              className={`grid ${
                isTeamTotal ? "grid-cols-1" : "grid-cols-[1rem_auto]"
              } gap-2 ps-1`}
            >
              {!isTeamTotal && (
                <span className="text-muted-foreground text-end">
                  {jersey_number}
                </span>
              )}
              <span className={isTeamTotal ? "font-medium" : ""}>{name}</span>
            </div>
          );
        },
      },
    ];

    // Add a column for each stat
    const statColumns = allStatNames.map((statName) => ({
      id: statName,
      accessorKey: statName,
      header: () => <div className="text-center text-xs">{statName}</div>,
      cell: ({ getValue, row }) => {
        const value = getValue();
        const isTeamTotal =
          row.original.id === "home_team_total" ||
          row.original.id === "away_team_total";
        return (
          <div
            className={`text-center ${
              isTeamTotal ? "font-medium" : "text-muted-foreground"
            }`}
          >
            {value !== undefined ? value : "-"}
          </div>
        );
      },
      size: 50,
    }));
    
    return [...baseColumns, ...statColumns];
  }, [allStatNames, selectedPeriod, scoring_type]);

  if (isLoading) return <Loading />;
  if (!boxscoreData) return <div>No boxscore data available</div>;

  return (
    <Card className="max-w-screen lg:max-w-[calc(100vw-24rem)]">
      <CardContent className="p-0 md:px-6">
        <CardHeader className="p-0">
          <CardTitle className="text-lg font-semibold flex justify-between items-center gap-2 border-b border-dashed pb-2">
            Boxscore
            <div className="flex justify-between items-center">
              {scoring_type === SCORING_TYPE_VALUES.SETS &&
                availablePeriods.length > 1 && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground uppercase">
                      {getPeriodLabel(scoring_type)}:
                    </span>
                    <Select
                      value={selectedPeriod}
                      onValueChange={setSelectedPeriod}
                    >
                      <SelectTrigger className="w-[100px] text-sm font-normal">
                        <SelectValue placeholder="Period" />
                      </SelectTrigger>
                      <SelectContent>
                        {availablePeriods.map((period) => (
                          <SelectItem key={period} value={period}>
                            {period === "total"
                              ? "Total"
                              : `${getPeriodLabel(scoring_type)} ${period}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
            </div>
          </CardTitle>
        </CardHeader>
        <div className="flex flex-col">
          {/* Home Team Table */}
          <div>
            <div className="flex items-center gap-2 px-2">
              <Avatar className="w-7 h-7 border-2 border-primary/20 my-2">
                <AvatarImage
                  src={game.home_team.logo}
                  alt={game.home_team.name}
                />
                <AvatarFallback className="bg-muted/50 text-muted-foreground">
                  {game.home_team.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="font-semibold text-base">
                {game.home_team.name}
              </span>
            </div>
            <DataTable
              columns={columns}
              data={homeTeamData}
              showPagination={false}
              unlimited={true}
              className="text-xs"
              alternateRowColors={true}
            />
          </div>

          {/* Away Team Table */}
          <div>
            <div className="flex items-center gap-2 px-2">
              <Avatar className="w-7 h-7 border-2 border-primary/20 my-2">
                <AvatarImage
                  src={game.away_team.logo}
                  alt={game.away_team.name}
                />
                <AvatarFallback className="bg-muted/50 text-muted-foreground">
                  {game.away_team.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="font-semibold text-base">
                {game.away_team.name}
              </span>
            </div>
            <DataTable
              columns={columns}
              data={awayTeamData}
              showPagination={false}
              unlimited={true}
              className="text-xs"
              alternateRowColors={true}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Boxscore;
