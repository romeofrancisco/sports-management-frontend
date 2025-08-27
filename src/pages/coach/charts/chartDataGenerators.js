// Chart data generators for coach dashboard

/**
 * Generate team overview chart data
 * @param {Object} overview - Overview data from API
 * @returns {Object} Chart data object
 */
export const generateTeamOverviewData = (overview) => ({
  labels: overview?.team_attendance?.map((team) => team.team_name) || [],
  datasets: [
    {
      label: "Attendance Rate (%)",
      data:
        overview?.team_attendance?.map((team) =>
          Math.round(team.attendance_rate || 0)
        ) || [],
      backgroundColor: "#8B153890", // Perpetual Maroon with transparency
      borderColor: "#8B1538",
      borderWidth: 2,
      yAxisID: "percentage",
    },
    {
      label: "Total Sessions",
      data:
        overview?.team_attendance?.map((team) => team.total_sessions || 0) ||
        [],
      backgroundColor: "#FFD70090", // Perpetual Gold with transparency
      borderColor: "#FFD700",
      borderWidth: 2,
      yAxisID: "count",
    },
    {
      label: "Recent Games",
      data:
        overview?.team_attendance?.map((team) => {
          // Count games for this specific team from the recent_games array
          const teamGames =
            overview?.recent_games?.filter(
              (game) =>
                game.home_team === team.team_name ||
                game.away_team === team.team_name
            )?.length || 0;
          return teamGames;
        }) || [],
      backgroundColor: "#f59e0b90", // Amber with transparency
      borderColor: "#f59e0b",
      borderWidth: 2,
      yAxisID: "count",
    },
  ],
});

/**
 * Generate games status doughnut chart data
 * @param {Object} overview - Overview data from API
 * @returns {Object} Chart data object
 */
export const generateGamesStatusData = (overview) => ({
  labels: ["Upcoming Events", "Recent Training Sessions", "Total Players"],
  datasets: [
    {
      data: [
        (overview?.upcoming_games?.length || 0) +
          (overview?.upcoming_training_sessions?.length || 0),
        overview?.team_overview?.recent_training_sessions || 0,
        overview?.team_overview?.total_players || 0,
      ],
      backgroundColor: [
        "#ffd70090", // Gold with transparency
        "#f59e0b90", // Amber with transparency
        "#7f1d1d90", // Dark red with transparency
      ],
      borderColor: [
        "#ffd700", // Gold
        "#f59e0b", // Amber
        "#7f1d1d", // Dark red
      ],
      borderWidth: 2,
    },
  ],
});

/**
 * Generate training progress line chart data
 * @param {Object} overview - Overview data from API
 * @returns {Object} Chart data object
 */
export const generateTrainingProgressData = (overview) => ({
  labels:
    overview?.recent_training_sessions
      ?.slice(0, 8)
      .map((session, index) => `Week ${index + 1}`) || [],
  datasets: [
    {
      label: "Player Engagement",
      data:
        overview?.recent_training_sessions
          ?.slice(0, 8)
          .map((session) => session.attendance_count || 0) || [],
      borderColor: "#8B1538", // Perpetual Maroon
      backgroundColor: "rgba(139, 21, 56, 0.1)",
      fill: true,
      tension: 0.3,
    },
    {
      label: "Session Capacity",
      data:
        overview?.recent_training_sessions
          ?.slice(0, 8)
          .map((session) => session.total_players || 0) || [],
      borderColor: "#FFD700", // Perpetual Gold
      backgroundColor: "rgba(255, 215, 0, 0.1)",
      fill: false,
      tension: 0.3,
    },
  ],
});

/**
 * Generate player development bar chart data
 * @param {Object} playerProgress - Player progress data from API
 * @returns {Object} Chart data object
 */
export const generatePlayerDevelopmentData = (playerProgress) => ({
  labels:
    playerProgress?.player_progress
      ?.slice(0, 10)
      .map((player) => player.player_name.split(" ")[0]) || [],
  datasets: [
    {
      label: "Training Sessions",
      data:
        playerProgress?.player_progress
          ?.slice(0, 10)
          .map((player) => player.total_sessions || 0) || [],
      backgroundColor: "#ffd70090", // Gold with transparency
      borderColor: "#ffd700", // Gold
      borderWidth: 2,
      borderRadius: 4,
      borderSkipped: false,
      yAxisID: "count",
    },
    {
      label: "Number of Metrics",
      data:
        playerProgress?.player_progress
          ?.slice(0, 10)
          .map((player) => player.recent_improvement.metric_count || 0) || [],
      backgroundColor: "#f59e0b90", // Amber with transparency (same as Point Differential)
      borderColor: "#f59e0b", // Amber
      borderWidth: 2,
      borderRadius: 4,
      borderSkipped: false,
      yAxisID: "count",
    },
    {
      label: "Improvement (3 months)",
      data:
        playerProgress?.player_progress
          ?.slice(0, 10)
          .map(
            (player) => player.recent_improvement?.percentage.toFixed(2) || 0
          ) || [],
      backgroundColor: "#7f1d1d90", // Dark red with transparency (same as Points Conceded)
      borderColor: "#7f1d1d", // Dark red
      borderWidth: 2,
      borderRadius: 4,
      borderSkipped: false,
      yAxisID: "percentage",
    },
  ],
});
