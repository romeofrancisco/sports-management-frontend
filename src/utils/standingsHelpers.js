/**
 * Utility functions for standings tables
 */

/**
 * Get the appropriate explanation text for standings table
 * @param {Object} options Configuration options
 * @param {boolean} options.isSeasonStandings Whether these are season or all-time standings
 * @param {boolean} options.sortByPerformance Whether sorting is by performance or championships
 * @param {boolean} options.isSetBased Whether this is a set-based sport
 * @returns {string} Explanation text
 */
export const getStandingsExplanation = ({ 
  isSeasonStandings = false, 
  sortByPerformance = false, 
  isSetBased = false 
}) => {
  if (isSeasonStandings) {
    return isSetBased 
      ? "Teams are ranked based on match points, followed by set ratio and sets won."
      : "Teams are ranked based on points, followed by point differential and points scored.";
  } 
  
  // League standings
  if (sortByPerformance) {
    return isSetBased
      ? "Teams are ranked based on set ratio and sets won over all seasons."
      : "Teams are ranked based on win percentage and point differential over all seasons.";
  } 
  
  // Default (championships-first)
  return isSetBased
    ? "Teams are ranked based on championships first, followed by set ratio and sets won."
    : "Teams are ranked based on championships first, followed by win percentage and point differential.";
};