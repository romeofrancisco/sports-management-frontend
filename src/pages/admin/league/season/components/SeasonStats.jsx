import React from "react";
import { useSeasonTeamPerformance } from "@/hooks/useSeasons";
import { useSportScoringType } from "@/hooks/useSports";
import Loading from "@/components/common/FullLoading";
import { Award, BarChart2, CheckSquare, Shield, Trophy, TrendingUp } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import StatCard from "@/components/common/StatCard";
import { PointsChart, WinsChart, StreakChart, DifferentialChart } from "@/components/charts/SeasonCharts";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export const SeasonStats = ({ seasonId, leagueId, sport }) => {
  const { data: teamPerformance, isLoading } = useSeasonTeamPerformance(leagueId, seasonId);
  const { isSetsScoring, isLoading: isSportLoading } = useSportScoringType(sport);
  
  if (isLoading || isSportLoading) return <Loading />;

  // Check and sanitize team performance data
  const sanitizedPerformance = teamPerformance?.map(team => ({
    ...team,
    team_name: team.team_name || 'Unknown Team',
    avg_points_scored: typeof team.avg_points_scored === 'number' ? team.avg_points_scored : 0,
    avg_points_conceded: typeof team.avg_points_conceded === 'number' ? team.avg_points_conceded : 0,
    max_streak: typeof team.max_streak === 'number' ? team.max_streak : 0,
    first_half_wins: typeof team.first_half_wins === 'number' ? team.first_half_wins : 0,
    second_half_wins: typeof team.second_half_wins === 'number' ? team.second_half_wins : 0,
    total_games: typeof team.total_games === 'number' ? team.total_games : 0
  })) || [];

  const getPointsData = () => {
    if (!sanitizedPerformance || sanitizedPerformance.length === 0) return { labels: [], datasets: [] };
    
    // Filter teams that have played games
    const teamsWithGames = sanitizedPerformance.filter(team => team.total_games > 0);
    if (teamsWithGames.length === 0) return { labels: [], datasets: [] };
    
    // For set-based sports, we need different metrics
    if (isSetsScoring) {
      // Process data to calculate points per set
      const formattedData = teamsWithGames.map(team => {
        // Calculate points per set for each team
        const totalPointsScored = team.total_points_scored || 0;
        const totalPointsConceded = team.total_points_conceded || 0;
        const setsPlayed = team.sets_played || 1; // Avoid division by zero
        
        return {
          name: team.team_name,
          pointsPerSet: parseFloat((totalPointsScored / setsPlayed).toFixed(1)),
          pointsConcededPerSet: parseFloat((totalPointsConceded / setsPlayed).toFixed(1))
        };
      });
      
      // Sort teams by points per set for the chart
      const sortedTeams = [...formattedData]
        .sort((a, b) => b.pointsPerSet - a.pointsPerSet);
      
      return {
        labels: sortedTeams.map(team => team.name),
        datasets: [
          {
            label: 'Points per Set',
            data: sortedTeams.map(team => team.pointsPerSet),
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          },
          {
            label: 'Points Conceded per Set',
            data: sortedTeams.map(team => team.pointsConcededPerSet),
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          }
        ]
      };
    } else {
      // Original code for point-based sports
      const topTeams = [...teamsWithGames]
        .sort((a, b) => (b.avg_points_scored || 0) - (a.avg_points_scored || 0))
        .slice(0, 5);
        
      return {
        labels: topTeams.map(team => team.team_name),
        datasets: [
          {
            label: 'Points Scored',
            data: topTeams.map(team => {
              const val = team.avg_points_scored;
              return val !== undefined && val !== null ? parseFloat(val.toFixed(1)) : 0;
            }),
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          },
          {
            label: 'Points Conceded',
            data: topTeams.map(team => {
              const val = team.avg_points_conceded;
              return val !== undefined && val !== null ? parseFloat(val.toFixed(1)) : 0;
            }),
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          }
        ]
      };
    }
  };
  
  const getWinsData = () => {
    if (!sanitizedPerformance || sanitizedPerformance.length === 0) return { labels: [], datasets: [] };
    
    // Filter teams that have played games
    const teamsWithGames = sanitizedPerformance.filter(
      team => team.total_games > 0
    );
    if (teamsWithGames.length === 0) return { labels: [], datasets: [] };
    
    // Log raw data for debugging
    console.log("Teams with games:", teamsWithGames);
    
    const topTeams = [...teamsWithGames]
      .sort((a, b) => {
        const aTotalWins = (a.first_half_wins || 0) + (a.second_half_wins || 0);
        const bTotalWins = (b.first_half_wins || 0) + (b.second_half_wins || 0);
        return bTotalWins - aTotalWins;
      })
      .slice(0, 5);
    
    // Ensure data is present even if values are 0
    const preparedData = topTeams.map(team => ({
      team_name: team.team_name,
      first_half_wins: team.first_half_wins || 0,
      second_half_wins: team.second_half_wins || 0
    }));
    
    console.log("Chart data:", preparedData);
      
    return {
      labels: preparedData.map(team => team.team_name),
      datasets: [
        {
          label: isSetsScoring ? 'First Half Sets Won' : 'First Half Wins',
          data: preparedData.map(team => team.first_half_wins),
          backgroundColor: 'rgba(255, 206, 86, 0.5)',
          borderColor: 'rgba(255, 206, 86, 1)',
          borderWidth: 1
        },
        {
          label: isSetsScoring ? 'Second Half Sets Won' : 'Second Half Wins',
          data: preparedData.map(team => team.second_half_wins),
          backgroundColor: 'rgba(153, 102, 255, 0.5)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1
        }
      ]
    };
  };
  
  const getStreakData = () => {
    if (!sanitizedPerformance || sanitizedPerformance.length === 0) return { labels: [], datasets: [] };
    
    // Use max_streak instead of max_win_streak to match the backend field name
    const streakTeams = [...sanitizedPerformance]
      .filter(team => team.max_streak > 0)
      .sort((a, b) => b.max_streak - a.max_streak)
      .slice(0, 5);
      
    if (streakTeams.length === 0) return { labels: [], datasets: [] };
      
    return {
      labels: streakTeams.map(team => team.team_name),
      datasets: [
        {
          label: isSetsScoring ? 'Longest Sets Win Streak' : 'Longest Win Streak',
          data: streakTeams.map(team => team.max_streak || 0),
          backgroundColor: [
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
          ],
          borderWidth: 1
        }
      ]
    };
  };
  
  const getDifferentialData = () => {
    if (!sanitizedPerformance || sanitizedPerformance.length === 0) return { labels: [], datasets: [] };
    
    // Filter teams with games
    const teamsWithGames = sanitizedPerformance.filter(team => team.total_games > 0);
    if (teamsWithGames.length === 0) return { labels: [], datasets: [] };
    
    const differentialTeams = [...teamsWithGames]
      .map(team => {
        if (isSetsScoring) {
          // For set-based sports, use set win ratio or points ratio
          const setsWon = team.sets_won || 0;
          const setsLost = team.sets_lost || 0;
          const setsPlayed = team.sets_played || 0;
          
          // Calculate set win percentage (if sets played > 0)
          let differential = 0;
          if (setsPlayed > 0) {
            differential = parseFloat(((setsWon / setsPlayed) * 100).toFixed(1));
          }
          
          return {
            ...team,
            differential,
            label: team.team_name,
            fullLabel: `${team.team_name} (${setsWon} sets won, ${differential}%)`
          };
        } else {
          // For point-based sports, use traditional point differential
          const avgScored = team.avg_points_scored || 0;
          const avgConceded = team.avg_points_conceded || 0;
          const diff = avgScored - avgConceded;
          return {
            ...team,
            differential: diff !== undefined && !isNaN(diff) ? parseFloat(diff.toFixed(1)) : 0,
            label: team.team_name
          };
        }
      })
      // Sort by differential value from highest to lowest
      .sort((a, b) => b.differential - a.differential)
      .slice(0, 8);
      
    return {
      // Use team names as labels
      labels: differentialTeams.map(team => team.label),
      datasets: [
        {
          label: isSetsScoring ? 'Set Win Percentage' : 'Point Differential',
          data: differentialTeams.map(team => team.differential),
          backgroundColor: differentialTeams.map(team => {
            // Use different colors for positive and negative differentials
            return team.differential >= 0 ? 'rgba(54, 162, 235, 0.7)' : 'rgba(255, 99, 132, 0.7)';
          }),
          borderColor: differentialTeams.map(team => {
            return team.differential >= 0 ? 'rgba(54, 162, 235, 1)' : 'rgba(255, 99, 132, 1)';
          }),
          borderWidth: 1
        }
      ]
    };
  };
  
  const getStatsSummary = () => {
    if (!sanitizedPerformance || sanitizedPerformance.length === 0) {
      return {
        avgPointsPerGame: 0,
        bestOffensiveTeam: { name: "N/A", value: 0 },
        bestDefensiveTeam: { name: "N/A", value: 0 },
        longestStreak: { name: "N/A", value: 0 },
        bestWinRateTeam: { name: "N/A", value: 0 }
      };
    }
    
    // Filter teams that have played games
    const teamsWithGames = sanitizedPerformance.filter(team => team.total_games > 0);
    
    if (teamsWithGames.length === 0) {
      return {
        avgPointsPerGame: 0,
        bestOffensiveTeam: { name: "N/A", value: 0 },
        bestDefensiveTeam: { name: "N/A", value: 0 },
        longestStreak: { name: "N/A", value: 0 },
        bestWinRateTeam: { name: "N/A", value: 0 }
      };
    }
    
    let totalPoints = 0;
    let totalGames = 0;
    let bestOffensive = { name: "N/A", value: 0 };
    let bestDefensive = { name: "N/A", value: Number.MAX_VALUE };
    let longestStreak = { name: "N/A", value: 0 };
    let bestWinRate = { name: "N/A", value: 0 };
    
    teamsWithGames.forEach(team => {
      if (isSetsScoring) {
        // For set-based sports, use appropriate metrics
        
        // Best win rate - use match win percentage
        if ((team.match_win_percentage || 0) > bestWinRate.value) {
          bestWinRate = { 
            name: team.team_name, 
            value: team.match_win_percentage || 0
          };
        }
        
        // Best offensive - use the exact points per set value directly from the backend
        if ((team.points_per_set || 0) > bestOffensive.value) {
          bestOffensive = { 
            name: team.team_name, 
            value: team.points_per_set || 0
          };
        }
        
        // Best defensive - use the exact points against per set value directly from the backend
        const pointsAgainstPerSet = team.points_against_per_set || 0;
        if (pointsAgainstPerSet < bestDefensive.value && pointsAgainstPerSet > 0) {
          bestDefensive = { 
            name: team.team_name, 
            value: pointsAgainstPerSet
          };
        }
        
        // Longest streak (match winning streak)
        if ((team.max_streak || 0) > longestStreak.value) {
          longestStreak = { 
            name: team.team_name, 
            value: team.max_streak || 0
          };
        }
      } else {
        // Original code for point-based sports
        const avgPointsScored = team.avg_points_scored || 0;
        const gameCount = team.total_games || 0;
        
        totalPoints += avgPointsScored * gameCount;
        totalGames += gameCount;
        
        if (avgPointsScored > bestOffensive.value) {
          bestOffensive = { 
            name: team.team_name, 
            value: typeof avgPointsScored === 'number' ? parseFloat(avgPointsScored.toFixed(1)) : 0
          };
        }
        
        const avgPointsConceded = team.avg_points_conceded || 0;
        if (avgPointsConceded < bestDefensive.value && avgPointsConceded > 0) {
          bestDefensive = { 
            name: team.team_name, 
            value: typeof avgPointsConceded === 'number' ? parseFloat(avgPointsConceded.toFixed(1)) : 0
          };
        }
        
        // Use max_streak to match the backend field name
        const maxStreak = team.max_streak || 0;
        if (maxStreak > longestStreak.value) {
          longestStreak = { 
            name: team.team_name, 
            value: maxStreak
          };
        }

        // Calculate win rate
        const totalWins = (team.first_half_wins || 0) + (team.second_half_wins || 0);
        const winRate = gameCount > 0 ? totalWins / gameCount : 0;
        if (winRate > bestWinRate.value) {
          bestWinRate = {
            name: team.team_name,
            value: parseFloat((winRate * 100).toFixed(1))
          };
        }
      }
    });
    
    // Calculate average points per game with null checks
    let avgPointsPerGame = 0;
    if (!isSetsScoring && totalGames > 0) {
      const avg = totalPoints / totalGames;
      avgPointsPerGame = typeof avg === 'number' ? parseFloat(avg.toFixed(1)) : 0;
    }
    
    return {
      avgPointsPerGame: isSetsScoring ? null : avgPointsPerGame,
      bestOffensiveTeam: bestOffensive,
      bestDefensiveTeam: bestDefensive,
      longestStreak: longestStreak,
      bestWinRateTeam: bestWinRate
    };
  };
  
  // Check data before calculating stats
  const statsSummary = getStatsSummary();
  const pointsData = getPointsData();
  const winsData = getWinsData();
  const streakData = getStreakData();
  const differentialData = getDifferentialData();

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-4">Season Statistics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {isSetsScoring ? (
          // Sets-based sports stats cards (volleyball, tennis, etc.)
          <>
            <StatCard 
              title="Best Win Rate" 
              value={statsSummary.bestWinRateTeam.name}
              description={`${statsSummary.bestWinRateTeam.value}% wins`}
              icon={<Trophy className="text-blue-500 h-5 w-5" />}
              className="bg-white"
            />
            
            <StatCard 
              title="Best Offensive Team" 
              value={statsSummary.bestOffensiveTeam.name}
              description={`${statsSummary.bestOffensiveTeam.value} pts/set avg`}
              icon={<TrendingUp className="text-green-500 h-5 w-5" />}
              className="bg-white"
            />
            
            <StatCard 
              title="Best Defensive Team" 
              value={statsSummary.bestDefensiveTeam.name}
              description={`${statsSummary.bestDefensiveTeam.value} pts allowed/set avg`}
              icon={<Shield className="text-amber-500 h-5 w-5" />}
              className="bg-white"
            />
            
            <StatCard 
              title="Longest Sets Win Streak" 
              value={statsSummary.longestStreak.name}
              description={`${statsSummary.longestStreak.value} consecutive sets`}
              icon={<CheckSquare className="text-purple-500 h-5 w-5" />}
              className="bg-white"
            />
          </>
        ) : (
          // Points-based sports stats cards (basketball, etc.)
          <>
            <StatCard 
              title="Avg Points Per Game" 
              value={statsSummary.avgPointsPerGame}
              icon={<BarChart2 className="text-blue-500 h-5 w-5" />}
              className="bg-white"
            />
            
            <StatCard 
              title="Best Offensive Team" 
              value={statsSummary.bestOffensiveTeam.name}
              description={`${statsSummary.bestOffensiveTeam.value} pts/game`}
              icon={<TrendingUp className="text-green-500 h-5 w-5" />}
              className="bg-white"
            />
            
            <StatCard 
              title="Best Defensive Team" 
              value={statsSummary.bestDefensiveTeam.name}
              description={`${statsSummary.bestDefensiveTeam.value} pts allowed`}
              icon={<Shield className="text-amber-500 h-5 w-5" />}
              className="bg-white"
            />
            
            <StatCard 
              title="Longest Win Streak" 
              value={statsSummary.longestStreak.name}
              description={`${statsSummary.longestStreak.value} consecutive wins`}
              icon={<Award className="text-purple-500 h-5 w-5" />}
              className="bg-white"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <PointsChart data={pointsData} isSetsScoring={isSetsScoring} />
        <WinsChart data={winsData} isSetsScoring={isSetsScoring} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <StreakChart data={streakData} isSetsScoring={isSetsScoring} />
        <DifferentialChart data={differentialData} isSetsScoring={isSetsScoring} />
      </div>
    </div>
  );
};