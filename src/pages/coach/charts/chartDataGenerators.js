// Chart data generators for coach dashboard

/**
 * Generate team overview chart data
 * @param {Object} overview - Overview data from API
 * @returns {Object} Chart data object
 */
export const generateTeamOverviewData = (overview) => ({
  labels: overview?.team_attendance?.map((team) => team.team_name) || [],
  datasets: [    {
      label: "Attendance Rate (%)",
      data: overview?.team_attendance?.map((team) => Math.round(team.attendance_rate || 0)) || [],
      backgroundColor: "#8B1538", // Perpetual Maroon
      borderColor: "#8B1538",
      borderWidth: 1,
      yAxisID: 'percentage',
    },
    {
      label: "Total Sessions",
      data: overview?.team_attendance?.map((team) => team.total_sessions || 0) || [],
      backgroundColor: "#FFD700", // Perpetual Gold
      borderColor: "#FFD700",
      borderWidth: 1,
      yAxisID: 'count',
    },
  ],
});

/**
 * Generate games status doughnut chart data
 * @param {Object} overview - Overview data from API
 * @returns {Object} Chart data object
 */
export const generateGamesStatusData = (overview) => ({
  labels: ["Upcoming Games", "Recent Training Sessions", "Total Teams"],
  datasets: [
    {
      data: [
        overview?.upcoming_games?.length || 0,
        overview?.recent_training_sessions?.length || 0,
        overview?.team_overview?.total_teams || 0,
      ],      backgroundColor: [
        "#8B1538", // Perpetual Maroon
        "#B01E47", // Perpetual Maroon Light
        "#FFD700", // Perpetual Gold
      ],
      borderWidth: 2,
      borderColor: "#fff",
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
  datasets: [    {
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
    playerProgress?.player_progress?.slice(0, 6).map((player) => player.player_name.split(" ")[0]) || [],
  datasets: [    {
      label: "Attendance Rate",
      data: playerProgress?.player_progress?.slice(0, 6).map((player) => Math.round(player.attendance_rate || 0)) || [],
      backgroundColor: "#8B1538", // Perpetual Maroon
      borderColor: "#8B1538",
      borderWidth: 1,
      yAxisID: 'percentage',
    },
    {
      label: "Training Sessions",
      data: playerProgress?.player_progress?.slice(0, 6).map((player) => player.total_sessions || 0) || [],
      backgroundColor: "#B01E47", // Perpetual Maroon Light
      borderColor: "#B01E47", 
      borderWidth: 1,
      yAxisID: 'count',
    },
    {
      label: "Recorded Metrics",
      data: playerProgress?.player_progress?.slice(0, 6).map((player) => player.recent_metrics_count || 0) || [],
      backgroundColor: "#FFD700", // Perpetual Gold
      borderColor: "#FFD700",
      borderWidth: 1,
      yAxisID: 'count',
    },
  ],
});
