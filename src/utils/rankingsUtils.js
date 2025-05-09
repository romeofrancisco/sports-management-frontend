/**
 * Utility functions for sorting and processing team rankings
 */

/**
 * Sort rankings by performance metrics (without considering championships)
 * @param {Array} rankings - Array of team ranking objects
 * @param {boolean} isSetBased - Whether this is a set-based sport
 * @param {boolean} isSeasonStandings - Whether these are season standings
 * @returns {Array} Sorted rankings
 */
export const sortRankingsByPerformance = (rankings, isSetBased, isSeasonStandings) => {
  return [...rankings].sort((a, b) => {
    // For season standings, first sort by points if available
    if (isSeasonStandings && a.points !== undefined && b.points !== undefined) {
      if (a.points !== b.points) {
        return b.points - a.points;
      }
    }
    
    // Next sort by win percentage
    if (a.win_ratio !== b.win_ratio) {
      return b.win_ratio - a.win_ratio;
    }
    
    // For set-based sports
    if (isSetBased) {
      // Sort by set ratio
      if (a.set_ratio !== b.set_ratio) {
        return b.set_ratio - a.set_ratio;
      }
      // Then by sets won
      if (a.sets_won !== b.sets_won) {
        return b.sets_won - a.sets_won;
      }
    } else {
      // For points-based sports, sort by point differential
      if (a.point_differential !== b.point_differential) {
        return b.point_differential - a.point_differential;
      }
      // Then by points scored
      if (a.points_scored !== b.points_scored) {
        return b.points_scored - a.points_scored;
      }
    }
    
    // Fallback to matches played (more games is better)
    if (a.matches_played !== b.matches_played) {
      return b.matches_played - a.matches_played;
    }
    
    // Final fallback to alphabetical order by team name
    return a.team?.name?.localeCompare(b.team?.name) || 0;
  });
};

/**
 * Determine if this is a single-season league
 * @param {Array} rankings - Array of team ranking objects
 * @returns {boolean} Whether all teams have only participated in one season
 */
export const isSingleSeasonLeague = (rankings) => {
  return rankings.length > 0 && 
    rankings.every(team => team.seasons_participated === 1);
};

/**
 * Sort rankings based on preference (performance or championships)
 * @param {Array} rankings - Array of team ranking objects
 * @param {boolean} sortByPerformance - Whether to sort by performance (true) or championships (false)
 * @param {boolean} isSetBased - Whether this is a set-based sport
 * @param {boolean} isSeasonStandings - Whether these are season standings
 * @returns {Array} Sorted rankings
 */
export const getSortedRankings = (rankings, sortByPerformance, isSetBased, isSeasonStandings) => {
  if (!rankings || rankings.length === 0) return [];
  
  // For single season leagues or when explicitly sorting by performance
  if (isSingleSeasonLeague(rankings) || sortByPerformance) {
    return sortRankingsByPerformance(rankings, isSetBased, isSeasonStandings);
  }
  
  // When sorting by championships
  return sortRankingsByChampionships(rankings, isSetBased);
};

/**
 * Sort rankings by championship count first, then performance
 * @param {Array} rankings - Array of team ranking objects
 * @param {boolean} isSetBased - Whether this is a set-based sport 
 * @returns {Array} Sorted rankings
 */
export const sortRankingsByChampionships = (rankings, isSetBased) => {
  return [...rankings].sort((a, b) => {
    // First sort by championships
    if (a.championships !== b.championships) {
      return b.championships - a.championships;
    }
    
    // Then use performance metrics as tiebreakers
    // Next sort by win percentage
    if (a.win_ratio !== b.win_ratio) {
      return b.win_ratio - a.win_ratio;
    }
    
    // For set-based sports
    if (isSetBased) {
      // Sort by set ratio
      if (a.set_ratio !== b.set_ratio) {
        return b.set_ratio - a.set_ratio;
      }
      // Then by sets won
      if (a.sets_won !== b.sets_won) {
        return b.sets_won - a.sets_won;
      }
    } else {
      // For points-based sports, sort by point differential
      if (a.point_differential !== b.point_differential) {
        return b.point_differential - a.point_differential;
      }
      // Then by points scored
      if (a.points_scored !== b.points_scored) {
        return b.points_scored - a.points_scored;
      }
    }
    
    // Fallback to matches played (more games is better)
    if (a.matches_played !== b.matches_played) {
      return b.matches_played - a.matches_played;
    }
    
    // Final fallback to alphabetical order by team name
    return a.team?.name?.localeCompare(b.team?.name) || 0;
  });
};

/**
 * Apply rank properties to sorted rankings
 * @param {Array} sortedRankings - Array of team ranking objects that have been sorted
 * @returns {Array} Rankings with rank properties added
 */
export const applyRankings = (sortedRankings) => {
  return sortedRankings.map((standing, index) => ({
    ...standing,
    rank: index + 1
  }));
};