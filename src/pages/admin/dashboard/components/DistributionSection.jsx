import React from "react";
import { Activity, PieChart } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

import { Card, CardContent } from "@/components/ui/card";

const DistributionSection = ({ overview }) => {
  const distributionStats = overview?.distribution_stats;
  const totalTeams =
    distributionStats?.teams_by_sport?.reduce(
      (sum, sport) => sum + (sport.team_count || 0),
      0
    ) || 0;
  const totalPlayers =
    distributionStats?.teams_by_sport?.reduce(
      (sum, sport) => sum + (sport.active_players || 0),
      0
    ) || 0;
  const totalSports = distributionStats?.teams_by_sport?.length || 0;

  // Calculate gender distribution
  const genderStats = distributionStats?.gender_stats;
  const malePlayers =
    genderStats?.players_by_gender_sport
      ?.filter((p) => p.user__sex === "male")
      .reduce((sum, p) => sum + p.count, 0) || 0;
  const femalePlayers =
    genderStats?.players_by_gender_sport
      ?.filter((p) => p.user__sex === "female")
      .reduce((sum, p) => sum + p.count, 0) || 0;
  const maleTeams =
    genderStats?.teams_by_division_sport
      ?.filter((t) => t.division === "male")
      .reduce((sum, t) => sum + t.count, 0) || 0;
  const femaleTeams =
    genderStats?.teams_by_division_sport
      ?.filter((t) => t.division === "female")
      .reduce((sum, t) => sum + t.count, 0) || 0;

  return (
    <Card className="bg-gradient-to-br from-card via-card to-card/95 shadow-xl border-2 border-primary/20 transition-all duration-300 hover:shadow-2xl hover:border-primary/30 relative overflow-hidden">
      <CardContent className="relative">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110">
                <PieChart className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold tracking-tight text-gradient">
                  Sports & Gender Distribution
                </h2>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                  Overview of teams and players across sports and divisions
                </p>
              </div>
            </div>
          </div>

          {/* Summary Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-primary/10 border border-primary/20">
              <div className="text-2xl font-bold text-primary">
                {totalSports}
              </div>
              <div className="text-sm text-muted-foreground">Sports</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-primary/10 border border-primary/20">
              <div className="text-2xl font-bold text-primary">
                {totalTeams}
              </div>
              <div className="text-sm text-muted-foreground">Teams</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-primary/10 border border-primary/20">
              <div className="text-2xl font-bold text-primary">
                {totalPlayers}
              </div>
              <div className="text-sm text-muted-foreground">Players</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-primary/10 border border-primary/20">
              <div className="text-2xl font-bold text-primary">
                {totalPlayers > 0
                  ? Math.round((totalPlayers / totalTeams) * 10) / 10
                  : 0}
              </div>
              <div className="text-sm text-muted-foreground">
                Avg Players/Team
              </div>
            </div>
          </div>

          {/* Gender Distribution Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-secondary/10 border border-secondary/20">
              <div className="text-xl font-bold text-secondary-foreground">
                {malePlayers}
              </div>
              <div className="text-sm text-muted-foreground">Male Players</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-secondary/10 border border-secondary/20">
              <div className="text-xl font-bold text-secondary-foreground">
                {femalePlayers}
              </div>
              <div className="text-sm text-muted-foreground">
                Female Players
              </div>
            </div>
            <div className="text-center p-4 rounded-lg bg-secondary/10 border border-secondary/20">
              <div className="text-xl font-bold text-secondary-foreground">
                {maleTeams}
              </div>
              <div className="text-sm text-muted-foreground">Male Teams</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-secondary/10 border border-secondary/20">
              <div className="text-xl font-bold text-secondary-foreground">
                {femaleTeams}
              </div>
              <div className="text-sm text-muted-foreground">Female Teams</div>
            </div>
          </div>

          {/* Sports List */}
          {totalSports > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">
                Active Sports
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {distributionStats.teams_by_sport.map((sport, index) => (
                  <div
                    key={sport.sport__name || index}
                    className="p-3 rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/10"
                  >
                    <div className="font-medium text-primary capitalize">
                      {sport.sport__name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {sport.team_count} teams • {sport.active_players} players
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {totalSports === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Activity className="h-8 w-8 text-primary" />
              </div>
              <p className="font-medium">No sports data available</p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                Distribution will appear once teams are created
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DistributionSection;
