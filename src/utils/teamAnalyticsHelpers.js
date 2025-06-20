// Helper functions for processing team analytics data

export const processPerformanceData = (performance) => {
  if (!performance?.recent_performance) return [];

  // Group games by week to create aggregated performance data
  const groupedByWeek = {};

  performance.recent_performance.forEach((game) => {
    const gameDate = new Date(game.date);
    const weekKey = `Week of ${gameDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })}`;

    if (!groupedByWeek[weekKey]) {
      groupedByWeek[weekKey] = { wins: 0, losses: 0, draws: 0, total: 0 };
    }

    groupedByWeek[weekKey].total += 1;
    if (game.result === "win") {
      groupedByWeek[weekKey].wins += 1;
    } else if (game.result === "loss") {
      groupedByWeek[weekKey].losses += 1;
    } else if (game.result === "draw") {
      groupedByWeek[weekKey].draws += 1;
    }
  });

  // Convert to array format expected by chart
  return Object.entries(groupedByWeek).map(([period, stats]) => ({
    period,
    wins: stats.wins,
    losses: stats.losses,
    draws: stats.draws,
    games_played: stats.total,
    win_rate:
      stats.total > 0 ? Math.round((stats.wins / stats.total) * 100) : 0,
  }));
};

export const processStatsBreakdown = (statistics) => {
  if (!statistics?.games_statistics) return [];

  const gameStats = statistics.games_statistics;
  const data = [];

  if (gameStats.wins > 0) data.push({ name: "Wins", value: gameStats.wins });
  if (gameStats.losses > 0)
    data.push({ name: "Losses", value: gameStats.losses });
  if (gameStats.draws > 0)
    data.push({ name: "Draws", value: gameStats.draws });

  return data;
};

export const processTrainingData = (trainingEffectiveness, trainings, attendanceTrends, analytics) => {
  // If we have data from the new training effectiveness service, use it
  if (
    trainingEffectiveness?.weekly_data &&
    Array.isArray(trainingEffectiveness.weekly_data)
  ) {
    return trainingEffectiveness.weekly_data.map((week) => ({
      week: week.week_label || week.period,
      sessions: week.sessions_count || week.sessions,
      avg_duration: week.average_duration || week.avg_duration || 120,
      attendance_rate: week.attendance_rate || week.avg_attendance_rate || 0,
      efficiency_score:
        week.efficiency_score || week.training_effectiveness || 75,
    }));
  }

  // Fallback to existing logic if new service data is not available
  if (!trainings?.results) return [];

  // Group trainings by week (proper weekly aggregation)
  const weeklyData = {};

  // Create a map of attendance rates by date from attendance trends if available
  const attendanceRatesByDate = {};
  if (attendanceTrends && Array.isArray(attendanceTrends)) {
    attendanceTrends.forEach((item) => {
      // Format date to match with training sessions
      const trendDate = new Date(item.date);
      const dateKey = trendDate.toISOString().split("T")[0]; // YYYY-MM-DD format
      attendanceRatesByDate[dateKey] = item.attendance_rate;
    });
  }

  trainings.results.forEach((training) => {
    const date = new Date(training.date);
    const dateKey = training.date; // Should be in YYYY-MM-DD format

    // Get the week start (Monday) for proper weekly grouping
    const weekStart = new Date(date);
    const day = weekStart.getDay();
    const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is sunday
    weekStart.setDate(diff);

    const weekKey = `Week ${weekStart.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })}`;

    if (!weeklyData[weekKey]) {
      weeklyData[weekKey] = {
        sessions: 0,
        total_players: 0,
        total_duration: 0,
        count: 0,
        attendance_rates: [], // Store attendance rates for this week
      };
    }

    weeklyData[weekKey].sessions += 1;
    weeklyData[weekKey].total_players += training.players_count || 0;
    weeklyData[weekKey].total_duration += training.duration_minutes || 120;
    weeklyData[weekKey].count += 1;

    // If we have attendance rate data for this date, store it
    if (attendanceRatesByDate[dateKey]) {
      weeklyData[weekKey].attendance_rates.push(
        attendanceRatesByDate[dateKey]
      );
    }
  });

  // Convert to array and sort by date
  return Object.entries(weeklyData)
    .map(([week, data]) => {
      // Calculate attendance rate properly
      let attendance_rate = 0;

      // If we have attendance trend data, use the average of those rates
      if (data.attendance_rates && data.attendance_rates.length > 0) {
        const sum = data.attendance_rates.reduce(
          (acc, rate) => acc + rate,
          0
        );
        attendance_rate = Math.round(sum / data.attendance_rates.length);
      } else {
        // Fallback to analytics overview data if available
        attendance_rate = analytics?.average_attendance || 0;
      }

      return {
        week,
        sessions: data.sessions,
        attendance_rate,
        avg_duration:
          data.count > 0 ? Math.round(data.total_duration / data.count) : 0,
        total_participation: data.total_players,
      };
    })
    .sort(
      (a, b) =>
        new Date(a.week.replace("Week ", "")) -
        new Date(b.week.replace("Week ", ""))
    )
    .slice(-8); // Show last 8 weeks
};

export const processPlayerActivityData = (analytics, attendanceOverview, attendanceTrends) => {
  // If we have player_activity data in analytics, use it (original format)
  if (analytics?.player_activity) {
    return analytics.player_activity.map((item, index) => ({
      period: `Week ${index + 1}`,
      active_players: item.active_players || 0,
      avg_participation: item.participation_rate || 0,
    }));
  }

  // Fallback: Use attendance trends data if available
  if (attendanceTrends && Array.isArray(attendanceTrends) && attendanceTrends.length > 0) {
    return attendanceTrends.slice(-8).map((trend, index) => ({
      period: `Week ${index + 1}`,
      active_players: trend.total_players || 0,
      avg_participation: trend.attendance_rate || 0,
    }));
  }

  // Final fallback: Use attendance overview data to create synthetic weekly data
  if (attendanceOverview) {
    const totalPlayers = attendanceOverview.total_players || 0;
    const overallRate = attendanceOverview.overall_attendance_rate || 0;
    
    // Create 4 weeks of synthetic data showing recent activity
    return Array.from({ length: 4 }, (_, index) => ({
      period: `Week ${index + 1}`,
      active_players: Math.max(1, totalPlayers - index),
      avg_participation: Math.max(20, overallRate - index * 5),
    }));
  }

  // Return empty array if no data available
  return [];
};

// New function for processing training metrics improvement trends
export const processTrainingMetricsData = (teamPlayerProgress, timeRange = 30) => {
  if (!teamPlayerProgress?.results) return [];

  const weeklyMetricsData = {};
  const players = Object.values(teamPlayerProgress.results);

  // Group metrics by week and calculate improvements
  players.forEach(player => {
    if (player.recent_improvement && player.last_training_date) {
      const trainingDate = new Date(player.last_training_date);
      const weekKey = `Week of ${trainingDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })}`;

      if (!weeklyMetricsData[weekKey]) {
        weeklyMetricsData[weekKey] = {
          total_improvement: 0,
          player_count: 0,
          metrics_recorded: 0,
          attendance_rate: 0,
        };
      }

      weeklyMetricsData[weekKey].total_improvement += player.recent_improvement || 0;
      weeklyMetricsData[weekKey].player_count += 1;
      weeklyMetricsData[weekKey].metrics_recorded += player.recent_metrics_count || 0;
      weeklyMetricsData[weekKey].attendance_rate += player.attendance_rate || 0;
    }
  });

  // Convert to chart format with averages
  return Object.entries(weeklyMetricsData)
    .map(([week, data]) => ({
      period: week,
      avg_improvement: data.player_count > 0 
        ? Math.round((data.total_improvement / data.player_count) * 100) / 100 
        : 0,
      metrics_per_player: data.player_count > 0 
        ? Math.round(data.metrics_recorded / data.player_count) 
        : 0,
      avg_attendance: data.player_count > 0 
        ? Math.round(data.attendance_rate / data.player_count) 
        : 0,
      active_players: data.player_count,
    }))
    .sort((a, b) => new Date(a.period.replace("Week of ", "")) - new Date(b.period.replace("Week of ", "")))
    .slice(-8); // Show last 8 weeks
};

// New function for processing game scoring trends (simplified - now backend does the heavy lifting)
export const processGameScoringData = (scoringAnalytics) => {
  // If we have backend scoring analytics data, use it directly
  if (scoringAnalytics?.scoring_data) {
    return scoringAnalytics.scoring_data;
  }

  // Fallback: process raw games data (original implementation for backward compatibility)
  const games = scoringAnalytics;
  if (!games?.results && !Array.isArray(games)) return [];

  const gamesList = games?.results || games || [];
  const completedGames = gamesList.filter(game => 
    game.status === 'completed' || game.status === 'finished'
  );

  if (completedGames.length === 0) return [];

  // Group games by week
  const weeklyScoring = {};

  completedGames.forEach(game => {
    const gameDate = new Date(game.date);
    const weekKey = `Week of ${gameDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })}`;

    if (!weeklyScoring[weekKey]) {
      weeklyScoring[weekKey] = {
        total_points_scored: 0,
        total_points_conceded: 0,
        games_count: 0,
        wins: 0,
      };
    }

    // Determine if this is a home or away game and extract relevant scores
    const isHomeGame = game.home_team_name || game.is_home;
    const pointsScored = isHomeGame ? game.home_team_score : game.away_team_score;
    const pointsConceded = isHomeGame ? game.away_team_score : game.home_team_score;

    weeklyScoring[weekKey].total_points_scored += pointsScored || 0;
    weeklyScoring[weekKey].total_points_conceded += pointsConceded || 0;
    weeklyScoring[weekKey].games_count += 1;
    
    if (game.result === 'win') {
      weeklyScoring[weekKey].wins += 1;
    }
  });

  // Convert to chart format
  return Object.entries(weeklyScoring)
    .map(([week, data]) => ({
      period: week,
      avg_points_scored: data.games_count > 0 
        ? Math.round((data.total_points_scored / data.games_count) * 10) / 10 
        : 0,
      avg_points_conceded: data.games_count > 0 
        ? Math.round((data.total_points_conceded / data.games_count) * 10) / 10 
        : 0,
      point_differential: data.games_count > 0 
        ? Math.round(((data.total_points_scored - data.total_points_conceded) / data.games_count) * 10) / 10 
        : 0,
      win_rate: data.games_count > 0 
        ? Math.round((data.wins / data.games_count) * 100) 
        : 0,
      games_played: data.games_count,
    }))
    .sort((a, b) => new Date(a.period.replace("Week of ", "")) - new Date(b.period.replace("Week of ", "")))
    .slice(-8); // Show last 8 weeks
};

// New function for processing player availability trends
export const processPlayerAvailabilityData = (analytics, attendanceTrends, teamDetails) => {
  if (!attendanceTrends || !Array.isArray(attendanceTrends)) return [];

  return attendanceTrends
    .slice(-8) // Last 8 data points
    .map((trend, index) => ({
      period: `Week ${index + 1}`,
      total_players: trend.total_players || teamDetails?.total_players || 0,
      active_players: Math.round((trend.attendance_rate / 100) * (trend.total_players || 0)),
      attendance_rate: Math.round(trend.attendance_rate || 0),
      availability_score: Math.round(
        ((trend.attendance_rate || 0) * 0.7) + 
        (((trend.total_players || 0) / (teamDetails?.total_players || 1)) * 30)
      ), // Weighted score combining attendance and player availability
    }));
};
