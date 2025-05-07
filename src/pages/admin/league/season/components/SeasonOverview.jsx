import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Calendar, Users, Goal, TrendingUp, TrendingDown, Timer, Clock, Award, Activity, Flame, Medal } from "lucide-react";
import { useSeasonTeamPerformance, useSeasons, useSeasonComparison } from "@/hooks/useSeasons";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const SeasonOverview = ({ seasonDetails }) => {
  const { league, season } = useParams();
  const { data: teamPerformance, isLoading } = useSeasonTeamPerformance(league, season);
  // Get all seasons to find previous seasons for comparison
  const { data: seasonsData } = useSeasons(league);
  const [teams, setTeams] = useState([]);
  const [previousSeasonId, setPreviousSeasonId] = useState(null);
  
  // Get season comparison data if we have a previous season
  const { data: comparisonData, isLoading: isComparisonLoading } = useSeasonComparison(
    league, 
    previousSeasonId ? [season, previousSeasonId] : []
  );

  // Find the previous season when seasons data is loaded
  useEffect(() => {
    if (seasonsData?.results && seasonDetails?.year) {
      // Sort seasons by year descending
      const sortedSeasons = [...seasonsData.results].sort((a, b) => b.year - a.year);
      
      // Find current season's index
      const currentIndex = sortedSeasons.findIndex(s => s.id.toString() === season);
      
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
  const teamsCount = teams?.length || (seasonDetails?.teams_count || 0);
  
  // Find teams with notable stats
  const getTopPerformers = () => {
    if (!teams || teams.length === 0) {
      return {
        topScorer: { team_name: "N/A", avg_points_scored: 0 },
        topDefender: { team_name: "N/A", avg_points_conceded: 0 },
        hottestTeam: { team_name: "N/A", max_streak: 0 },
        highestScoringSingleGame: { team_name: "N/A", highest_score: 0 }
      };
    }
    
    // Sort teams by different metrics
    const sortedByScoring = [...teams].sort((a, b) => 
      b.avg_points_scored - a.avg_points_scored
    );
    
    const sortedByDefense = [...teams].sort((a, b) => 
      (a.avg_points_conceded || 0) - (b.avg_points_conceded || 0)
    );
    
    const sortedByStreak = [...teams].sort((a, b) => 
      (b.max_streak || 0) - (a.max_streak || 0)
    );

    const sortedByHighestSingleGame = [...teams].sort((a, b) =>
      (b.highest_score || 0) - (a.highest_score || 0)
    );
    
    return {
      topScorer: sortedByScoring[0] || { team_name: "N/A", avg_points_scored: 0 },
      topDefender: sortedByDefense[0] || { team_name: "N/A", avg_points_conceded: 0 },
      hottestTeam: sortedByStreak[0] || { team_name: "N/A", max_streak: 0 },
      highestScoringSingleGame: sortedByHighestSingleGame[0] || { team_name: "N/A", highest_score: 0 }
    };
  };
  
  const topTeams = getTopPerformers();

  // Helper function to get first half leader
  const getFirstHalfLeader = () => {
    if (!teams || teams.length === 0) return { team_name: "N/A" };
    const sorted = [...teams].sort((a, b) => (b.first_half_wins || 0) - (a.first_half_wins || 0));
    return sorted[0] || { team_name: "N/A" };
  };

  // Helper function to get a second half leader
  const getSecondHalfLeader = () => {
    if (!teams || teams.length === 0) return { team_name: "N/A" };
    const sorted = [...teams].sort((a, b) => (b.second_half_wins || 0) - (a.second_half_wins || 0));
    return sorted[0] || { team_name: "N/A" };
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
    
    // Log values for debugging
    console.log('Season dates:', {
      start_date: new Date(seasonDetails.start_date).toISOString(),
      end_date: new Date(seasonDetails.end_date).toISOString(),
      current_date: new Date().toISOString(),
      start_ms: start,
      end_ms: end,
      current_ms: current,
    });
    
    // Don't show progress if season hasn't started
    if (current <= start) return 0;
    
    // Show 100% if season is over
    if (current >= end) return 100;
    
    // Calculate progress percentage
    const totalDuration = end - start;
    const elapsed = current - start;
    const progress = Math.min(100, Math.round((elapsed / totalDuration) * 100));
    
    console.log('Progress calculation:', {
      totalDuration,
      elapsed,
      progress
    });
    
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
      const currentSeasonData = comparisonData.find(s => s.id.toString() === season);
      const previousSeasonData = comparisonData.find(s => s.id.toString() !== season);
      
      if (!currentSeasonData || !previousSeasonData) {
        return { team_name: teams[0]?.team_name || "N/A", improvement: "N/A" };
      }
      
      // First check if we have team performance data
      if (teams.length > 0) {
        // Calculate improvement based on point differential compared to previous season
        let mostImproved = { team_name: "N/A", improvement: 0 };
        
        teams.forEach(team => {
          // Get previous season data for this team if exists
          const previousTeamData = previousSeasonData.team_stats?.find(
            t => t.team_name === team.team_name
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
                current: currentDiff
              };
            }
          }
        });
        
        // Format the improvement as a percentage or point change
        if (mostImproved.team_name !== "N/A") {
          // For significant improvements, show percentage, otherwise show point differential
          const percentageChange = Math.abs(mostImproved.previous) > 0 ? 
            Math.round((mostImproved.improvement / Math.abs(mostImproved.previous)) * 100) : 0;
          
          if (percentageChange > 0) {
            return {
              team_name: mostImproved.team_name,
              improvement: `+${percentageChange}%`
            };
          } else {
            return {
              team_name: mostImproved.team_name,
              improvement: `+${mostImproved.improvement.toFixed(1)} pts`
            };
          }
        }
      }
    }
    
    // Fallback if no comparison data
    // Find the team with the best trending current performance
    const teamsWithTrend = teams
      .filter(team => team.current_streak > 0)
      .sort((a, b) => b.current_streak - a.current_streak);
    
    if (teamsWithTrend.length > 0) {
      const team = teamsWithTrend[0];
      return {
        team_name: team.team_name,
        improvement: `${team.current_streak} win streak`
      };
    }
    
    return { 
      team_name: teams[0]?.team_name || "N/A", 
      improvement: "trending up" 
    };
  };

  const mostImprovedTeam = getMostImprovedTeam();

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Season Overview</h2>
      
      {/* Season Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Season Status Card */}
        <Card className="rounded-lg overflow-hidden border shadow-sm">
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground mb-2">Season Status</div>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-2xl font-bold capitalize mb-1">{seasonDetails.status || "upcoming"}</div>
                <div className="text-sm text-muted-foreground">{formattedStartDate}</div>
              </div>
              <div className={`p-3 rounded-full ${
                seasonDetails.status === 'ongoing' ? 'bg-green-100' :
                seasonDetails.status === 'upcoming' ? 'bg-blue-100' : 
                seasonDetails.status === 'completed' ? 'bg-amber-100' : 'bg-gray-100'
              }`}>
                <Calendar className={`h-5 w-5 ${
                  seasonDetails.status === 'ongoing' ? 'text-green-600' :
                  seasonDetails.status === 'upcoming' ? 'text-blue-600' :
                  seasonDetails.status === 'completed' ? 'text-amber-600' : 'text-gray-600'
                }`} />
              </div>
            </div>

            {/* Season Progress Bar */}
            {seasonDetails.status === 'ongoing' && (
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span>Season Progress</span>
                  <span>{seasonProgress}%</span>
                </div>
                <Progress value={seasonProgress} className="h-2" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Teams Count Card */}
        <Card className="rounded-lg overflow-hidden border shadow-sm">
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground mb-2">Teams</div>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-2xl font-bold">{teamsCount}</div>
                <div className="text-sm text-muted-foreground">
                  {seasonDetails.top_team ? `Current leader: ${seasonDetails.top_team}` : "\u00A0"}
                </div>
              </div>
              <div className="bg-indigo-100 p-3 rounded-full">
                <Users className="text-indigo-600 h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Games Card */}
        <Card className="rounded-lg overflow-hidden border shadow-sm">
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground mb-2">Games</div>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-2xl font-bold">{seasonDetails.games_played || 0} / {seasonDetails.games_count || 0}</div>
                <div className="text-sm text-muted-foreground">
                  {seasonDetails.games_played && seasonDetails.games_count ? 
                    `${Math.round((seasonDetails.games_played / seasonDetails.games_count) * 100)}% completed` : 
                    "No games played yet"}
                </div>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Goal className="text-green-600 h-5 w-5" />
              </div>
            </div>
            
            {/* Games Progress Bar */}
            {seasonDetails.games_played > 0 && (
              <div className="mt-3">
                <Progress value={gamesProgress} className="h-2" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Average Points Per Game Card */}
        <Card className="rounded-lg overflow-hidden border shadow-sm">
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground mb-2">Avg. Points</div>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-2xl font-bold">{seasonDetails.avg_points_per_team?.toFixed(1) || "0.0"}</div>
                <div className="text-sm text-muted-foreground">per team, per game</div>
              </div>
              <div className="bg-rose-100 p-3 rounded-full">
                <Activity className="text-rose-600 h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Team Performance Leaders Card */}
        <Card className="rounded-lg overflow-hidden border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" /> Team Performance Leaders
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-2">
            <div className="space-y-6">
              {/* Best Offense */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-50 p-2.5 rounded-full">
                    <TrendingUp className="text-emerald-600 h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">Best Offense</span>
                </div>
                <div className="flex items-center">
                  <div className="text-sm font-semibold mr-3">{topTeams.topScorer?.team_name}</div>
                  <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-emerald-200">
                    {(topTeams.topScorer?.avg_points_scored || 0).toFixed(1)} pts/game
                  </Badge>
                </div>
              </div>
              
              {/* Best Defense */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-2.5 rounded-full">
                    <TrendingDown className="text-blue-600 h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">Best Defense</span>
                </div>
                <div className="flex items-center">
                  <div className="text-sm font-semibold mr-3">{topTeams.topDefender?.team_name}</div>
                  <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200">
                    {(topTeams.topDefender?.avg_points_conceded || 0).toFixed(1)} pts allowed
                  </Badge>
                </div>
              </div>
              
              {/* Longest Win Streak */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-50 p-2.5 rounded-full">
                    <Flame className="text-amber-600 h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">Hottest Streak</span>
                </div>
                <div className="flex items-center">
                  <div className="text-sm font-semibold mr-3">{topTeams.hottestTeam?.team_name}</div>
                  <Badge className="bg-amber-50 text-amber-600 hover:bg-amber-100 border-amber-200">
                    {topTeams.hottestTeam?.max_streak || 0} wins
                  </Badge>
                </div>
              </div>

              {/* Most Improved Team */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-50 p-2.5 rounded-full">
                    <Award className="text-purple-600 h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">Most Improved</span>
                </div>
                <div className="flex items-center">
                  <div className="text-sm font-semibold mr-3">{mostImprovedTeam.team_name}</div>
                  <Badge className="bg-purple-50 text-purple-600 hover:bg-purple-100 border-purple-200">
                    {mostImprovedTeam.improvement}
                  </Badge>
                </div>
              </div>
              
              {/* Highest Single Game Score */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-red-50 p-2.5 rounded-full">
                    <Activity className="text-red-600 h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">Highest Score</span>
                </div>
                <div className="flex items-center">
                  <div className="text-sm font-semibold mr-3">{topTeams.highestScoringSingleGame?.team_name}</div>
                  <Badge className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200">
                    {topTeams.highestScoringSingleGame?.highest_score || 0} pts
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Season Progression Card */}
        <Card className="rounded-lg overflow-hidden border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Medal className="h-5 w-5 text-blue-500" /> Season Progression
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-2">
            <div className="space-y-6">
              {/* First Half Leaders */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-50 p-2.5 rounded-full">
                    <Clock className="text-purple-600 h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">First Half Leaders</span>
                </div>
                <div className="flex items-center">
                  <div className="text-sm font-semibold">{firstHalfLeader.team_name}</div>
                  {firstHalfLeader.first_half_wins && (
                    <Badge className="bg-purple-50 text-purple-600 ml-2">
                      {firstHalfLeader.first_half_wins} wins
                    </Badge>
                  )}
                </div>
              </div>
              
              {/* Second Half Leaders */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-50 p-2.5 rounded-full">
                    <Clock className="text-indigo-600 h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">Second Half Leaders</span>
                </div>
                <div className="flex items-center">
                  <div className="text-sm font-semibold">{secondHalfLeader.team_name}</div>
                  {secondHalfLeader.second_half_wins && (
                    <Badge className="bg-indigo-50 text-indigo-600 ml-2">
                      {secondHalfLeader.second_half_wins} wins
                    </Badge>
                  )}
                </div>
              </div>
              
              {/* Close Games Stats */}
              <div className="pt-4 border-t border-muted">
                <div className="text-sm font-medium mb-3">Game Margins</div>
                
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-muted/20 p-3 rounded-lg text-center">
                    <div className="text-xl font-bold text-amber-600">
                      {teams?.[0]?.close_games || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Close games<br />(&lt;5 pts)
                    </div>
                  </div>
                  
                  <div className="bg-muted/20 p-3 rounded-lg text-center">
                    <div className="text-xl font-bold text-emerald-600">
                      {teams?.[0]?.blowout_wins || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Blowout wins<br />(&gt;15 pts)
                    </div>
                  </div>
                  
                  <div className="bg-muted/20 p-3 rounded-lg text-center">
                    <div className="text-xl font-bold text-blue-600">
                      {teams?.[0]?.overtime_games || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Overtime<br />games
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Current Season Leaders */}
              <div className="pt-4 border-t border-muted">
                <div className="text-sm font-medium mb-3">Current Leaders</div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-amber-500" />
                    <span className="text-sm">{seasonDetails.top_team || "N/A"}</span>
                  </div>
                  
                  {seasonDetails.top_team_record && (
                    <Badge className="bg-amber-50 text-amber-600 hover:bg-amber-100 border-amber-200">
                      {seasonDetails.top_team_record}
                    </Badge>
                  )}
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