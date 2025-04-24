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
    const { data } = await api.get(
      `player-stats/player_stats_summary/?game_id=${gameId}&team=${team}`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchTeamStatsSummary = async (gameId) => {
  try {
    const { data } = await api.get(
      `player-stats/team_stats_summary/?game_id=${gameId}`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchStatTypeChoices = async (sport) => {
  try {
    const { data } = await api.get(`stat-type-choices/?sport=${sport}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchFormulas = async (sport, filter) => {
  try {
    const { data } = await api.get(`formulas/?sport=${sport}`, {
      params: filter,
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const createFormula = async (formulaData) => {
  try {
    const { data } = await api.post("formulas/", formulaData);
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateFormula = async (formulaId, formulaData) => {
  try {
    const { data } = await api.patch(`formulas/${formulaId}/`, formulaData);
    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteFormula = async (formulaId) => {
  try {
    const { data } = await api.delete(`formulas/${formulaId}/`);
    return data;
  } catch (error) {
    throw error;
  }
};
