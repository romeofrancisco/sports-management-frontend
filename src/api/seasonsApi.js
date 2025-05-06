import api from ".";

export const createSeason = async (league_id, season) => {
  try {
    const { data } = await api.post(`leagues/${league_id}/seasons/`, season);
    return data;
  } catch (error) {
    console.log("Error creating season:", error);
    throw error;
  }
};

export const fetchSeasons = async (league_id) => {
  try {
    const { data } = await api.get(`leagues/${league_id}/seasons/`);
    return data;
  } catch (error) {
    console.log("Error fetching seasons:", error);
    throw error;
  }
};

export const fetchSeasonDetails = async (league_id, season_id) => {
  try {
    const { data } = await api.get(`leagues/${league_id}/seasons/${season_id}/`);
    return data;
  } catch (error) {
    console.log("Error fetching season details:", error);
    throw error;
  }
};

export const fetchSeasonStandings = async (league_id, season_id) => {
  try {
    const { data } = await api.get(`leagues/${league_id}/seasons/${season_id}/standings/`);
    return data;
  } catch (error) {
    console.log("Error fetching season standings:", error);
    throw error;
  }
};

export const updateSeason = async (league_id, season_id, season) => {
  try {
    const { data } = await api.patch(`leagues/${league_id}/seasons/${season_id}/`, season);
    return data;
  } catch (error) {
    console.log("Error updating season:", error);
    throw error;
  }
};

export const deleteSeason = async (league_id, season_id) => {
  console.log("Deleting season:", league_id, season_id)
  try {
    const { data } = await api.delete(`leagues/${league_id}/seasons/${season_id}/`);
    return data;
  } catch (error) {
    console.log("Error deleting season:", error);
    throw error;
  }
};

export const createBracket = async (bracketData) => {
  try {
    const { data } = await api.post(`brackets/`, bracketData);
    return data;
  } catch (error) {
    console.log(error)
    throw error;
  }
};

export const fetchBracket = async (season) => {
  try {
    const { data } = await api.get(`brackets/for_season/${season}/`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const manageSeason = async (league_id, season_id, action) => {
  try {
    const { data } = await api.post(`leagues/${league_id}/seasons/${season_id}/manage/`, {
      action,
    });
    return data;
  } catch (error) {
    console.log(`Error during season ${action}:`, error);
    throw error;
  }
};

export const fetchSeasonTeamPerformance = async (league_id, season_id) => {
  try {
    const { data } = await api.get(`leagues/${league_id}/seasons/${season_id}/team_performance/`);
    return data;
  } catch (error) {
    console.log("Error fetching team performance data:", error);
    throw error;
  }
};

export const fetchSeasonComparison = async (league_id, seasonIds = []) => {
  try {
    let url = `leagues/${league_id}/seasons/comparison/`;
    if (seasonIds.length > 0) {
      url += `?seasons=${seasonIds.join(',')}`;
    }
    const { data } = await api.get(url);
    return data;
  } catch (error) {
    console.log("Error fetching season comparison data:", error);
    throw error;
  }
};

export const addTeamToSeason = async (league_id, season_id, team_id) => {
  try {
    const { data } = await api.post(`leagues/${league_id}/seasons/${season_id}/add_team/`, {
      team_id,
    });
    return data;
  } catch (error) {
    console.log("Error adding team to season:", error);
    throw error;
  }
};

export const removeTeamFromSeason = async (league_id, season_id, team_id) => {
  try {
    const { data } = await api.post(`leagues/${league_id}/seasons/${season_id}/remove_team/`, {
      team_id,
    });
    return data;
  } catch (error) {
    console.log("Error removing team from season:", error);
    throw error;
  }
};

export const fetchSeasonGames = async (league_id, season_id, filters = {}) => {
  try {
    let url = `leagues/${league_id}/seasons/${season_id}/games/`;
    
    // Add query params for filtering
    const queryParams = new URLSearchParams();
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.team) queryParams.append('team', filters.team);
    
    const queryString = queryParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
    
    const { data } = await api.get(url);
    return data;
  } catch (error) {
    console.log("Error fetching season games:", error);
    throw error;
  }
};