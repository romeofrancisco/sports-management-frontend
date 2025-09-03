/**
 * Chart utility functions for season data
 */

// Define theme-based color palettes with full opacity
const COLORS = {
  primary: {
    main: 'rgba(139, 21, 56, 0.7)',          // Primary maroon full opacity
    light: 'rgba(176, 30, 71, 0.7)',         // Lighter maroon full opacity
    dark: 'rgba(107, 16, 40, 0.7)',          // Darker maroon full opacity
    border: 'rgba(139, 21, 56, 1)',        // Primary maroon solid
    lightBorder: 'rgba(176, 30, 71, 1)',   // Lighter maroon solid
    darkBorder: 'rgba(107, 16, 40, 1)',    // Darker maroon solid
  },
  secondary: {
    main: 'rgba(255, 215, 0, 0.7)',          // Secondary gold full opacity
    light: 'rgba(255, 237, 78, 0.7)',        // Lighter gold full opacity
    dark: 'rgba(230, 194, 0, 0.7)',          // Darker gold full opacity
    border: 'rgba(255, 215, 0, 1)',        // Secondary gold solid
    lightBorder: 'rgba(255, 237, 78, 1)',  // Lighter gold solid
    darkBorder: 'rgba(230, 194, 0, 1)',    // Darker gold solid
  },
  amber: {
    main: 'rgba(245, 158, 11, 0.7)',         // Amber with transparency
    border: 'rgba(245, 158, 11, 1)',         // Amber solid
  },
  // Additional colors for variety when needed - using slight transparency for backgrounds
  tertiary: [
    { bg: 'rgba(139, 21, 56, 0.7)', border: 'rgba(139, 21, 56, 1)' },  // Primary with slight transparency
    { bg: 'rgba(255, 215, 0, 0.7)', border: 'rgba(255, 215, 0, 1)' },  // Secondary with slight transparency
    { bg: 'rgba(176, 30, 71, 0.7)', border: 'rgba(176, 30, 71, 1)' },  // Primary light with slight transparency
    { bg: 'rgba(255, 237, 78, 0.7)', border: 'rgba(255, 237, 78, 1)' }, // Secondary light with slight transparency
    { bg: 'rgba(107, 16, 40, 0.7)', border: 'rgba(107, 16, 40, 1)' },  // Primary dark with slight transparency
    { bg: 'rgba(230, 194, 0, 0.7)', border: 'rgba(230, 194, 0, 1)' },  // Secondary dark with slight transparency
  ]
};

/**
 * Sanitizes team performance data to ensure it has consistent values
 * @param {Array} teamPerformance - Raw team performance data 
 * @returns {Array} - Sanitized team performance data
 */
export const sanitizeTeamPerformance = (teamPerformance) => {  
  return teamPerformance?.map(team => ({
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
export const getPointsChartData = (sanitizedPerformance, isSetsScoring) => {
  if (!sanitizedPerformance || sanitizedPerformance.length === 0) 
    return { labels: [], datasets: [] };
  
  // Filter teams that have played games
  const teamsWithGames = sanitizedPerformance.filter(team => team.total_games > 0);
  if (teamsWithGames.length === 0) 
    return { labels: [], datasets: [] };
  
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
        pointsConcededPerSet: parseFloat((totalPointsConceded / setsPlayed).toFixed(1)),
        differentialPerSet: parseFloat(((totalPointsScored - totalPointsConceded) / setsPlayed).toFixed(1))
      };
    });
    
    // Sort teams by points per set for the chart
    const sortedTeams = [...formattedData]
      .sort((a, b) => b.pointsPerSet - a.pointsPerSet)
      .slice(0, 8); // Limit to top 8 teams for readability
    
    return {
      labels: sortedTeams.map(team => team.name),
      datasets: [
        {
          label: 'Points per Set',
          data: sortedTeams.map(team => team.pointsPerSet),
          backgroundColor: COLORS.primary.main,
          borderColor: COLORS.primary.border,
          borderWidth: 2,
          borderRadius: 4,
        },
        {
          label: 'Points Conceded per Set',
          data: sortedTeams.map(team => team.pointsConcededPerSet),
          backgroundColor: COLORS.secondary.main,
          borderColor: COLORS.secondary.border,
          borderWidth: 2,
          borderRadius: 4,
        },
        {
          label: 'Point Differential per Set',
          data: sortedTeams.map(team => team.differentialPerSet),
          backgroundColor: COLORS.amber.main,
          borderColor: COLORS.amber.border,
          borderWidth: 2,
          borderRadius: 4,
          yAxisID: 'y1', // Use secondary Y-axis
        }
      ]
    };
  } else {
    // For point-based sports
    const sortedTeams = [...teamsWithGames]
      .sort((a, b) => (b.avg_points_scored || 0) - (a.avg_points_scored || 0))
      .slice(0, 8); // Limit to top 8 teams for readability
      
    return {
      labels: sortedTeams.map(team => team.team_name),
      datasets: [        {
          label: 'Points Scored',
          data: sortedTeams.map(team => {
            const val = team.avg_points_scored;
            return val !== undefined && val !== null ? parseFloat(val.toFixed(1)) : 0;
          }),
          backgroundColor: COLORS.primary.main,
          borderColor: COLORS.primary.border,
          borderWidth: 2,
          borderRadius: 4,
        },
        {
          label: 'Points Conceded',
          data: sortedTeams.map(team => {
            const val = team.avg_points_conceded;
            return val !== undefined && val !== null ? parseFloat(val.toFixed(1)) : 0;
          }),
          backgroundColor: COLORS.secondary.main,
          borderColor: COLORS.secondary.border, 
          borderWidth: 2,
          borderRadius: 4,
        },
        {
          label: 'Point Differential',
          data: sortedTeams.map(team => {
            const scored = team.avg_points_scored || 0;
            const conceded = team.avg_points_conceded || 0;
            const diff = scored - conceded;
            return diff !== undefined && !isNaN(diff) ? parseFloat(diff.toFixed(1)) : 0;
          }),
          backgroundColor: COLORS.amber.main,
          borderColor: COLORS.amber.border,
          borderWidth: 2,
          borderRadius: 4,
          yAxisID: 'y1', // Use secondary Y-axis
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
export const getStreakChartData = (sanitizedPerformance, isSetsScoring) => {
  if (!sanitizedPerformance || sanitizedPerformance.length === 0) 
    return { labels: [], datasets: [] };
  
  const streakTeams = [...sanitizedPerformance]
    .filter(team => team.max_streak > 0)
    .sort((a, b) => b.max_streak - a.max_streak)
    .slice(0, 5); // Limit to top 6 teams for readability
    
  if (streakTeams.length === 0) 
    return { labels: [], datasets: [] };
      // Generate colors using theme colors
  const backgroundColors = COLORS.tertiary.map(color => color.bg);
  const borderColors = COLORS.tertiary.map(color => color.border);
    
  return {
    labels: streakTeams.map(team => team.team_name),
    datasets: [
      {
        label: isSetsScoring ? 'Longest Sets Win Streak' : 'Longest Win Streak',
        data: streakTeams.map(team => team.max_streak || 0),
        backgroundColor: backgroundColors.slice(0, streakTeams.length),
        borderColor: borderColors.slice(0, streakTeams.length),
        borderWidth: 2,
        borderRadius: 4,
      }
    ]
  };
};

/**
 * Processes team performance data for win percentage chart
 * @param {Array} sanitizedPerformance - Sanitized team performance data
 * @param {Boolean} isSetsScoring - Whether the sport uses sets scoring
 * @returns {Object} - Chart data structure for win percentage chart
 */
export const getDifferentialChartData = (sanitizedPerformance, isSetsScoring) => {
  if (!sanitizedPerformance || sanitizedPerformance.length === 0) 
    return { labels: [], datasets: [] };
  
  // Filter teams with games
  const teamsWithGames = sanitizedPerformance.filter(team => team.total_games > 0);
  if (teamsWithGames.length === 0) 
    return { labels: [], datasets: [] };
  
  const winPercentageTeams = [...teamsWithGames]
    .map(team => {
      let winPercentage = 0;
      
      if (isSetsScoring) {
        // For set-based sports, use set win percentage
        const setsWon = team.sets_won || 0;
        const setsPlayed = team.sets_played || 0;
        
        if (setsPlayed > 0) {
          winPercentage = parseFloat(((setsWon / setsPlayed) * 100).toFixed(1));
        }
      } else {
        // For point-based sports, use game win percentage
        const gamesWon = team.matches_won || 0;
        const gamesPlayed = team.total_games || 0;
        
        if (gamesPlayed > 0) {
          winPercentage = parseFloat(((gamesWon / gamesPlayed) * 100).toFixed(1));
        }
      }
      
      return {
        ...team,
        winPercentage,
        label: team.team_name
      };
    })
    // Sort by win percentage from highest to lowest
    .sort((a, b) => b.winPercentage - a.winPercentage)
    .slice(0, 8); // Limit to top 8 teams for readability
    
  return {
    // Use team names as labels
    labels: winPercentageTeams.map(team => team.label),
    datasets: [
      {
        label: 'Win Percentage',
        data: winPercentageTeams.map(team => team.winPercentage),
        backgroundColor: winPercentageTeams.map(team => {
          // Use primary for >50%, secondary for <=50%
          return team.winPercentage > 50 ? COLORS.primary.main : COLORS.secondary.main;
        }),
        borderColor: winPercentageTeams.map(team => {
          return team.winPercentage > 50 ? COLORS.primary.border : COLORS.secondary.border;
        }),
        borderWidth: 2,
        borderRadius: 4,
      }
    ]
  };
};

/**
 * Prepare all chart data in one function call
 * @param {Array} teamPerformance - Raw team performance data
 * @param {Boolean} isSetsScoring - Whether the sport uses sets scoring
 * @returns {Object} - Object containing all chart data
 */
export const prepareChartData = (teamPerformance, isSetsScoring) => {
  if (!teamPerformance) {
    return {
      pointsData: { labels: [], datasets: [] },
      streakData: { labels: [], datasets: [] },
      differentialData: { labels: [], datasets: [] }
    };
  }
  
  // Sanitize team performance data
  const sanitizedPerformance = sanitizeTeamPerformance(teamPerformance);
  
  // Generate all chart data
  return {
    pointsData: getPointsChartData(sanitizedPerformance, isSetsScoring),
    streakData: getStreakChartData(sanitizedPerformance, isSetsScoring),
    differentialData: getDifferentialChartData(sanitizedPerformance, isSetsScoring)
  };
};
