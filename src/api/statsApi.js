import api from ".";

export const createPlayerStat = async (stats) => {
  try {
    const { data } = await api.post("player-stats/record/", stats);
    return data;
  } catch (error) {
    throw error;
  }
};

export const createPlayerStatFast = async (stats) => {
  try {
    const { data } = await api.post("player-stats/record_fast/", stats);
    return data;
  } catch (error) {
    throw error;
  }
};

export const bulkCreatePlayerStats = async (statsArray) => {
  try {
    const payload = {
      stats: statsArray
    };
    const { data } = await api.post("player-stats/bulk_record/", payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const bulkCreatePlayerStatsOptimized = async (statsArray) => {
  try {
    const payload = {
      stats: statsArray
    };
    const { data } = await api.post("player-stats/bulk_record_optimized/", payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchPlayerStatsSummary = async (gameId, team, forCalculation = false) => {
  try {
    // Add query parameters for optimization
    const params = new URLSearchParams({
      game_id: gameId,
      team: team
    });
    
    // Only add these flags if true to keep URLs cleaner
    if (forCalculation) {
      params.append('for_calculation', 'true');
    }
    
    // Automatically use raw SQL for large datasets on calculation requests
    if (forCalculation) {
      params.append('use_raw_sql', 'true');
    }
    
    const { data } = await api.get(
      `player-stats/player_stats_summary/?${params.toString()}`
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

export const fetchTeamStatsComparison = async (gameId) => {
  try {
    const { data } = await api.get(
      `player-stats/team_stats_comparison/?game_id=${gameId}`
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

export const fetchBoxscore = async (gameId) => {
  try {
    const { data } = await api.get(
      `player-stats/boxscore/?game_id=${gameId}`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export const undoLastStat = async (gameId) => {
  try {
    console.log("Making undo request for game ID:", gameId);
    const { data } = await api.delete(
      `player-stats/undo_last_stat/?game_id=${gameId}`
    );
    console.log("Undo response:", data);
    return data;
  } catch (error) {
    console.error("Undo error:", error);
    throw error;
  }
};
