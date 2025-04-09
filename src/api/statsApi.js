import api from ".";

export const createPlayerStat = async (stats) => {
  try {
    const { data } = await api.post("player-stats/record/", stats);
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchPlayerStatsSummary = async (gameId, team) => {
  try {
    const { data } = await api.get(`player-stats/player_stats_summary/?game_id=${gameId}&team=${team}`);
    return data;
  } catch (error) {
    throw error;
  }
}

export const fetchTeamStatsSummary = async (gameId) => {
  try {
    const { data } = await api.get(`player-stats/team_stats_summary/?game_id=${gameId}`);
    return data;
  } catch (error) {
    throw error;
  }
}
