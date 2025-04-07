import api from ".";

export const createPlayerStat = async (stats) => {
  try {
    const { data } = await api.post("player-stats/record/", stats);
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchPlayerSummaryStats = async (gameId, team) => {
  try {
    const { data } = await api.get(`player-stats/stats_summary/?game_id=${gameId}&team=${team}`);
    return data;
  } catch (error) {
    throw error;
  }
}
