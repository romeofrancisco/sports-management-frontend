/**
 * Utility functions for transforming team performance data into chart-ready formats
 */

/**
 * Sanitizes team performance data to ensure it has consistent values
 * @param {Array} teamPerformance - Raw team performance data
 * @returns {Array} - Sanitized team performance data
 */
export const sanitizeTeamPerformance = (teamPerformance) => {  return teamPerformance?.map(team => ({
    ...team,
    team_name: team.team_name || 'Unknown Team',
    avg_points_scored: typeof team.avg_points_scored === 'number' ? team.avg_points_scored : 0,
    avg_points_conceded: typeof team.avg_points_conceded === 'number' ? team.avg_points_conceded : 0,
    max_streak: typeof team.max_streak === 'number' ? team.max_streak : 0,
    total_games: typeof team.total_games === 'number' ? team.total_games : 0
  })) || [];
};

/**
 * Processes team performance data for points/scoring chart
 * @param {Array} sanitizedPerformance - Sanitized team performance data
 * @param {Boolean} isSetsScoring - Whether the sport uses sets scoring
 * @returns {Object} - Chart data structure for points chart
 */
export const getPointsData = (sanitizedPerformance, isSetsScoring) => {
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
          backgroundColor: 'rgba(139, 21, 56, 0.6)',
          borderColor: '#8B1538',
          borderWidth: 2,
          borderRadius: 4, 
          borderSkipped: false,
        },
        {
          label: 'Points Conceded per Set',
          data: sortedTeams.map(team => team.pointsConcededPerSet),
          backgroundColor: 'rgba(255, 215, 0, 0.6)',
          borderColor: '#FFD700',
          borderWidth: 2,
          borderRadius: 4,
          borderSkipped: false,
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
          backgroundColor: 'rgba(139, 21, 56, 0.6)',
          borderColor: '#8B1538',
          borderWidth: 2,
          borderRadius: 4,
          borderSkipped: false,
        },
        {
          label: 'Points Conceded',
          data: topTeams.map(team => {
            const val = team.avg_points_conceded;
            return val !== undefined && val !== null ? parseFloat(val.toFixed(1)) : 0;
          }),
          backgroundColor: 'rgba(255, 215, 0, 0.6)',
          borderColor: '#FFD700',
          borderWidth: 2,
          borderRadius: 4,
          borderSkipped: false,
        }
      ]
    };
  }
};

/**
 * Processes team performance data for streak chart
 * @param {Array} sanitizedPerformance - Sanitized team performance data
 * @param {Boolean} isSetsScoring - Whether the sport uses sets scoring
 * @returns {Object} - Chart data structure for streak chart
 */
export const getStreakData = (sanitizedPerformance, isSetsScoring) => {
  if (!sanitizedPerformance || sanitizedPerformance.length === 0) return { labels: [], datasets: [] };
  
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
          'rgba(139, 21, 56, 0.6)',   // Primary red
          'rgba(255, 215, 0, 0.6)',   // Secondary gold
          'rgba(166, 54, 80, 0.6)',   // Primary red lighter
          'rgba(230, 194, 0, 0.6)',   // Secondary gold darker
          'rgba(107, 15, 42, 0.6)',   // Primary red darker
        ],
        borderColor: [
          '#8B1538', // Primary red
          '#FFD700', // Secondary gold
          '#A63650', // Primary red lighter
          '#E6C200', // Secondary gold darker
          '#6B0F2A', // Primary red darker
        ],
        borderWidth: 2,
        borderRadius: 4,
        borderSkipped: false,
      }
    ]
  };
};

/**
 * Processes team performance data for differential chart
 * @param {Array} sanitizedPerformance - Sanitized team performance data
 * @param {Boolean} isSetsScoring - Whether the sport uses sets scoring
 * @returns {Object} - Chart data structure for differential chart
 */
export const getDifferentialData = (sanitizedPerformance, isSetsScoring) => {
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
          return team.differential >= 0 ? 'rgba(139, 21, 56, 0.6)' : 'rgba(255, 215, 0, 0.6)';
        }),
        borderColor: differentialTeams.map(team => {
          return team.differential >= 0 ? '#8B1538' : '#FFD700';
        }),
        borderWidth: 2,
        borderRadius: 4,
        borderSkipped: false,
      }
    ]
  };
};

/**
 * Processes team performance data to generate statistics summary
 * @param {Array} sanitizedPerformance - Sanitized team performance data
 * @param {Boolean} isSetsScoring - Whether the sport uses sets scoring
 * @returns {Object} - Statistics summary 
 */
export const getStatsSummary = (sanitizedPerformance, isSetsScoring) => {
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
      // For set-based sports logic
      if ((team.match_win_percentage || 0) > bestWinRate.value) {
        bestWinRate = { 
          name: team.team_name, 
          value: team.match_win_percentage || 0
        };
      }
      
      if ((team.points_per_set || 0) > bestOffensive.value) {
        bestOffensive = { 
          name: team.team_name, 
          value: team.points_per_set || 0
        };
      }
      
      const pointsAgainstPerSet = team.points_against_per_set || 0;
      if (pointsAgainstPerSet < bestDefensive.value && pointsAgainstPerSet > 0) {
        bestDefensive = { 
          name: team.team_name, 
          value: pointsAgainstPerSet
        };
      }
      
      if ((team.max_streak || 0) > longestStreak.value) {
        longestStreak = { 
          name: team.team_name, 
          value: team.max_streak || 0
        };
      }
    } else {
      // For point-based sports logic
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
      
      const maxStreak = team.max_streak || 0;
      if (maxStreak > longestStreak.value) {
        longestStreak = { 
          name: team.team_name, 
          value: maxStreak
        };
      }      // Calculate win rate based on existing win percentage if available
      const winPercentage = team.win_percentage || 0;
      if (winPercentage > bestWinRate.value) {
        bestWinRate = {
          name: team.team_name,
          value: parseFloat(winPercentage.toFixed(1))
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