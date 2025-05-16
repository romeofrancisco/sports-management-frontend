import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Trophy,
  Calendar,
  Users,
  Goal,
  TrendingUp,
  TrendingDown,
  Timer,
  Clock,
  Award,
  Activity,
  Flame,
  Medal,
  Scale,
  Zap,
  Clock3,
} from "lucide-react";
import {
  useSeasonTeamPerformance,
  useSeasons,
  useSeasonComparison,
} from "@/hooks/useSeasons";
import { useSportScoringType } from "@/hooks/useSports";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import InfoCard from "@/components/common/InfoCard";
import SeasonLeaders from "./SeasonLeaders";

const SeasonOverview = ({ seasonDetails, sport }) => {
  const { league, season } = useParams();
  const { data: teamPerformance, isLoading } = useSeasonTeamPerformance(
    league,
    season
  );
  const { isSetsScoring } = useSportScoringType(sport);
  // Get all seasons to find previous seasons for comparison
  const { data: seasonsData } = useSeasons(league);
  const [teams, setTeams] = useState([]);
  const [previousSeasonId, setPreviousSeasonId] = useState(null);

  // Get season comparison data if we have a previous season
  const { data: comparisonData, isLoading: isComparisonLoading } =
    useSeasonComparison(
      league,
      previousSeasonId ? [season, previousSeasonId] : []
    );

    console.log(seasonDetails);

  // Find the previous season when seasons data is loaded
  useEffect(() => {
    if (seasonsData?.results && seasonDetails?.year) {
      // Sort seasons by year descending
      const sortedSeasons = [...seasonsData.results].sort(
        (a, b) => b.year - a.year
      );

      // Find current season's index
      const currentIndex = sortedSeasons.findIndex(
        (s) => s.id.toString() === season
      );

      // If we found the current season and there's a previous one
      if (currentIndex >= 0 && currentIndex < sortedSeasons.length - 1) {
        setPreviousSeasonId(sortedSeasons[currentIndex + 1].id);
      }
    }
  }, [seasonsData, season, seasonDetails]);

  useEffect(() => {
    if (teamPerformance?.length > 0) {
      setTeams(teamPerformance);
    }
  }, [teamPerformance]);

  if (isLoading || !seasonDetails) return null;

  // Count teams from standings data or teamPerformance
  const teamsCount = teams?.length || seasonDetails?.teams_count || 0;

  // Find teams with notable stats
  const getTopPerformers = () => {
    if (!teams || teams.length === 0) {
      return {
        topScorer: { team_name: "N/A", avg_points_scored: 0 },
        topDefender: { team_name: "N/A", avg_points_conceded: 0 },
        hottestTeam: { team_name: "N/A", max_streak: 0 },
        highestScoringSingleGame: { team_name: "N/A", highest_score: 0 },
      };
    }

    // Sort teams by different metrics
    const sortedByScoring = [...teams].sort(
      (a, b) => b.avg_points_scored - a.avg_points_scored
    );

    const sortedByDefense = [...teams].sort(
      (a, b) => (a.avg_points_conceded || 0) - (b.avg_points_conceded || 0)
    );

    const sortedByStreak = [...teams].sort(
      (a, b) => (b.max_streak || 0) - (a.max_streak || 0)
    );

    const sortedByHighestSingleGame = [...teams].sort(
      (a, b) => (b.highest_score || 0) - (a.highest_score || 0)
    );

    return {
      topScorer: sortedByScoring[0] || {
        team_name: "N/A",
        avg_points_scored: 0,
      },
      topDefender: sortedByDefense[0] || {
        team_name: "N/A",
        avg_points_conceded: 0,
      },
      hottestTeam: sortedByStreak[0] || { team_name: "N/A", max_streak: 0 },
      highestScoringSingleGame: sortedByHighestSingleGame[0] || {
        team_name: "N/A",
        highest_score: 0,
      },
    };
  };

  const topTeams = getTopPerformers();
  // Helper function to get first half leader
  const getFirstHalfLeader = () => {
    if (!teams || teams.length === 0) return { team_name: "N/A" };
    
    // For sets-based sports, sort by sets won in first half
    if (isSetsScoring) {
      const sorted = [...teams].sort(
        (a, b) => (b.first_half_sets_won || 0) - (a.first_half_sets_won || 0)
      );
      return sorted[0] || { team_name: "N/A" };
    } else {
      // For points-based sports, sort by wins
      const sorted = [...teams].sort(
        (a, b) => (b.first_half_wins || 0) - (a.first_half_wins || 0)
      );
      return sorted[0] || { team_name: "N/A" };
    }
  };

  // Helper function to get a second half leader
  const getSecondHalfLeader = () => {
    if (!teams || teams.length === 0) return { team_name: "N/A" };
    
    // For sets-based sports, sort by sets won in second half
    if (isSetsScoring) {
      const sorted = [...teams].sort(
        (a, b) => (b.second_half_sets_won || 0) - (a.second_half_sets_won || 0)
      );
      return sorted[0] || { team_name: "N/A" };
    } else {
      // For points-based sports, sort by wins
      const sorted = [...teams].sort(
        (a, b) => (b.second_half_wins || 0) - (a.second_half_wins || 0)
      );
      return sorted[0] || { team_name: "N/A" };
    }
  };

  const firstHalfLeader = getFirstHalfLeader();
  const secondHalfLeader = getSecondHalfLeader();

  // Format start date if available
  const formattedStartDate = seasonDetails.start_date
    ? `Started on ${new Date(seasonDetails.start_date).toLocaleDateString()}`
    : "";

  // Calculate season progress
  const getSeasonProgress = () => {
    if (!seasonDetails.start_date || !seasonDetails.end_date) return 0;

    // Parse dates properly
    const start = new Date(seasonDetails.start_date).getTime();
    const end = new Date(seasonDetails.end_date).getTime();
    const current = new Date().getTime();

    // Don't show progress if season hasn't started
    if (current <= start) return 0;

    // Show 100% if season is over
    if (current >= end) return 100;

    // Calculate progress percentage
    const totalDuration = end - start;
    const elapsed = current - start;
    const progress = Math.min(100, Math.round((elapsed / totalDuration) * 100));

    return progress;
  };

  const seasonProgress = getSeasonProgress();
  const gamesProgress = seasonDetails.games_played
    ? Math.round((seasonDetails.games_played / seasonDetails.games_count) * 100)
    : 0;

  // Get team with most improved stats
  const getMostImprovedTeam = () => {
    if (!teams || teams.length === 0) {
      return { team_name: "N/A", improvement: "0%" };
    }

    // If we have comparison data, use it to determine most improved team
    if (comparisonData && comparisonData.length >= 2) {
      // Get current and previous season data
      const currentSeasonData = comparisonData.find(
        (s) => s.id.toString() === season
      );
      const previousSeasonData = comparisonData.find(
        (s) => s.id.toString() !== season
      );

      if (!currentSeasonData || !previousSeasonData) {
        return { team_name: teams[0]?.team_name || "N/A", improvement: "N/A" };
      }

      // First check if we have team performance data
      if (teams.length > 0) {
        // Calculate improvement based on point differential compared to previous season
        let mostImproved = { team_name: "N/A", improvement: 0 };

        teams.forEach((team) => {
          // Get previous season data for this team if exists
          const previousTeamData = previousSeasonData.team_stats?.find(
            (t) => t.team_name === team.team_name
          );

          if (previousTeamData) {
            // Calculate improvement metrics
            // We'll use point differential as the main metric
            const currentDiff = team.point_differential || 0;
            const previousDiff = previousTeamData.point_differential || 0;

            const improvementValue = currentDiff - previousDiff;

            // Track the team with the biggest positive change
            if (improvementValue > mostImproved.improvement) {
              mostImproved = {
                team_name: team.team_name,
                improvement: improvementValue,
                previous: previousDiff,
                current: currentDiff,
              };
            }
          }
        });

        // Format the improvement as a percentage or point change
        if (mostImproved.team_name !== "N/A") {
          // For significant improvements, show percentage, otherwise show point differential
          const percentageChange =
            Math.abs(mostImproved.previous) > 0
              ? Math.round(
                  (mostImproved.improvement / Math.abs(mostImproved.previous)) *
                    100
                )
              : 0;

          if (percentageChange > 0) {
            return {
              team_name: mostImproved.team_name,
              improvement: `+${percentageChange}%`,
            };
          } else {
            return {
              team_name: mostImproved.team_name,
              improvement: `+${mostImproved.improvement.toFixed(1)} pts`,
            };
          }
        }
      }
    }

    // Fallback if no comparison data
    // Find the team with the best trending current performance
    const teamsWithTrend = teams
      .filter((team) => team.current_streak > 0)
      .sort((a, b) => b.current_streak - a.current_streak);

    if (teamsWithTrend.length > 0) {
      const team = teamsWithTrend[0];
      return {
        team_name: team.team_name,
        improvement: `${team.current_streak} win streak`,
      };
    }

    return {
      team_name: teams[0]?.team_name || "N/A",
      improvement: "trending up",
    };
  };

  const mostImprovedTeam = getMostImprovedTeam();

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Season Overview</h2>      {/* Season Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Season Status Card */}
        <InfoCard
          title="Season Status"
          value={seasonDetails.status || "upcoming"}
          icon={
            <Calendar
              className={`h-5 w-5 ${
                seasonDetails.status === "ongoing"
                  ? "text-green-600"
                  : seasonDetails.status === "upcoming"
                  ? "text-blue-600"
                  : seasonDetails.status === "completed"
                  ? "text-amber-600"
                  : "text-gray-600"
              }`}
            />
          }
          description={formattedStartDate}
          className="bg-white capitalize"
          progress={seasonDetails.status === "ongoing" ? seasonProgress : null}
          progressLabel="Season Progress"        />
        
        {/* Teams Count Card */}
        <InfoCard
          title="Teams"
          value={teamsCount}
          icon={<Users className="text-indigo-600 h-5 w-5" />}
          description={seasonDetails.top_team ? `Current leader: ${seasonDetails.top_team}` : "\u00A0"}
          className="bg-white"        />
        
        {/* Games Card */}
        <InfoCard
          title="Games"
          value={`${seasonDetails.games_played || 0} / ${seasonDetails.games_count || 0}`}
          icon={<Goal className="text-green-600 h-5 w-5" />}
          description={
            seasonDetails.games_played && seasonDetails.games_count
              ? `${Math.round(
                  (seasonDetails.games_played / seasonDetails.games_count) * 100
                )}% completed`
              : "No games played yet"
          }
          progress={seasonDetails.games_played > 0 ? gamesProgress : null}          progressLabel="Completion Progress"
          className="bg-white"
        />
        
        {/* Average Points Per Game Card */}
        <InfoCard
          title="Avg. Points"
          value={seasonDetails.avg_points_per_game?.toFixed(1) || "0.0"}
          icon={<Activity className="text-rose-600 h-5 w-5" />}
          description="Per game"
          className="bg-white"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SeasonLeaders leagueId={league} seasonId={season} />

        {/* Season Progression Card */}
        <Card className="rounded-lg overflow-hidden border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Medal className="h-5 w-5 text-blue-500" /> Season Progression
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-2">
            <div className="space-y-6">              {/* First Half Leaders */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-50 p-2.5 rounded-full">
                    <Clock className="text-purple-600 h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">
                    First Half Leaders
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="text-sm font-semibold">
                    {firstHalfLeader.team_name}
                  </div>                  {isSetsScoring 
                    ? (firstHalfLeader.first_half_sets_won && (
                        <Badge className="bg-purple-50 text-purple-600 ml-2">
                          {firstHalfLeader.first_half_sets_won} sets won
                        </Badge>
                      ))
                    : (firstHalfLeader.first_half_wins && (
                        <Badge className="bg-purple-50 text-purple-600 ml-2">
                          {firstHalfLeader.first_half_wins} wins
                        </Badge>
                      ))
                  }
                </div>
              </div>

              {/* Second Half Leaders */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-50 p-2.5 rounded-full">
                    <Clock className="text-indigo-600 h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">
                    Second Half Leaders
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="text-sm font-semibold">
                    {secondHalfLeader.team_name}
                  </div>                  {isSetsScoring 
                    ? (secondHalfLeader.second_half_sets_won && (
                        <Badge className="bg-indigo-50 text-indigo-600 ml-2">
                          {secondHalfLeader.second_half_sets_won} sets won
                        </Badge>
                      ))
                    : (secondHalfLeader.second_half_wins && (
                        <Badge className="bg-indigo-50 text-indigo-600 ml-2">
                          {secondHalfLeader.second_half_wins} wins
                        </Badge>
                      ))
                  }
                </div>
              </div>              {/* Game/Set Margins Stats */}
              <div className="pt-4 border-t border-muted">
                <div className="text-sm font-medium mb-3">
                  {isSetsScoring ? 'Set Margins' : 'Game Margins'}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <InfoCard
                    title={isSetsScoring ? 'Close Sets' : 'Close Games'}
                    value={teams && teams.length > 0 ? teams.reduce((sum, team) => sum + (team.close_games || 0), 0) : 0}
                    icon={<Scale className="h-4 w-4 text-amber-600" />}
                    description={isSetsScoring ? 'Less than 3 pts' : 'Less than 5 pts'}
                    className="bg-white"
                  />

                  <InfoCard
                    title={isSetsScoring ? 'Dominant Sets' : 'Blowout Wins'}
                    value={teams && teams.length > 0 ? teams.reduce((sum, team) => sum + (team.blowout_wins || 0), 0) : 0}
                    icon={<Zap className="h-4 w-4 text-emerald-600" />}
                    description={isSetsScoring ? 'More than 10 pts' : 'More than 15 pts'}
                    className="bg-white"
                  />

                  <InfoCard
                    title={isSetsScoring ? 'Extended Sets' : 'Overtime Games'}
                    value={teams && teams.length > 0 ? teams.reduce((sum, team) => sum + (team.overtime_games || 0), 0) : 0}
                    icon={<Clock3 className="h-4 w-4 text-blue-600" />}
                    description="Extra time needed"
                    className="bg-white"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SeasonOverview;
