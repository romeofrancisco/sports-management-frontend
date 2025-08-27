// Helper functions for player performance calculations and analysis

/**
 * Calculate player performance score based on improvement metrics
 * @param {Object} player - Player data object
 * @returns {number|null} Performance score (0-100) or null if no data
 */
export const getPlayerPerformanceScore = (player) => {
  // Use overall improvement percentage if available
  if (player.overall_improvement?.percentage !== undefined) {
    // Convert percentage to a score out of 100, with base of 50 for neutral performance
    const baseScore = 50;
    const improvementBonus = Math.max(
      -30,
      Math.min(30, player.overall_improvement.percentage)
    );
    return Math.round(baseScore + improvementBonus);
  }

  // Fallback to recent improvement if overall not available
  if (player.recent_improvement?.percentage !== undefined) {
    const baseScore = 50;
    const improvementBonus = Math.max(
      -30,
      Math.min(30, player.recent_improvement.percentage)
    );
    return Math.round(baseScore + improvementBonus);
  }

  // No meaningful performance data available
  return null;
};

/**
 * Get performance trend indicator for a player
 * @param {Object} player - Player data object
 * @returns {string} Trend status: 'improving', 'declining', or 'stable'
 */
export const getPerformanceTrend = (player) => {
  if (player.recent_improvement?.percentage !== undefined) {
    if (player.recent_improvement.percentage > 5) return "improving";
    if (player.recent_improvement.percentage < -5) return "declining";
  }
  return "stable";
};

/**
 * Get badge variant based on performance score
 * @param {number|null} score - Performance score
 * @returns {string} Badge variant
 */
export const getPerformanceBadgeVariant = (score) => {
  if (score === null) return "outline"; // No data available
  if (score >= 70) return "default"; // Good performance
  if (score >= 50) return "secondary"; // Average performance
  return "destructive"; // Needs improvement
};

/**
 * Get performance insights for tooltip display
 * @param {Object} player - Player data object
 * @returns {string[]} Array of insight strings
 */
export const getPerformanceInsights = (player) => {
  const insights = [];

  if (player.overall_improvement?.percentage !== undefined) {
    insights.push(
      `Overall: ${
        player.overall_improvement.percentage > 0 ? "+" : ""
      }${player.overall_improvement.percentage.toFixed(1)}%`
    );
  }
  if (player.recent_improvement?.percentage !== undefined) {
    insights.push(
      `Recent: ${
        player.recent_improvement.percentage > 0 ? "+" : ""
      }${player.recent_improvement.percentage.toFixed(1)}%`
    );
  }

  return insights;
};

/**
 * Get team performance insights for team overview
 * @param {Object} team - Team data object
 * @returns {string[]} Array of insight strings
 */
export const getTeamInsights = (team) => {
  const insights = [];

  // Add team performance insights
  if (team.attendance_rate >= 90) {
    insights.push("🟢 Excellent attendance");
  } else if (team.attendance_rate >= 75) {
    insights.push("🟡 Good attendance");
  } else if (team.attendance_rate >= 60) {
    insights.push("🟠 Needs improvement");
  } else {
    insights.push("🔴 Poor attendance");
  }

  // Add team size context
  insights.push(`Team size: ${team.total_players} players`);

  return insights;
};

/**
 * Get player development insights for player development chart
 * @param {Object} player - Player data object
 * @returns {string[]} Array of insight strings
 */
export const getPlayerDevelopmentInsights = (player) => {
  const insights = [];

  // Add performance trend insight
  const trend = getPerformanceTrend(player);
  if (trend === "improving") {
    insights.push("Performance trending upward");
  } else if (trend === "declining") {
    insights.push("Needs attention");
  } else {
    insights.push("Stable performance");
  }

  // Add last training date if available
  if (player.last_training_date) {
    insights.push(`Last trained: ${player.last_training_date}`);
  }

  return insights;
};
