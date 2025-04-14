import api from ".";

export const createLeague = async (leagueData) => {
  try {
    const { data } = await api.post("leagues/", leagueData);
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchLeagues = async () => {
  try {
    const { data } = await api.get("leagues/");
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchLeagueDetails = async (leagueId) => {
  try {
    const { data } = await api.get(`leagues/${leagueId}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateLeague = async (leagueId, leagueData) => {
  try {
    const { data } = await api.patch(`leagues/${leagueId}/`, leagueData);
    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteLeague = async (leagueId) => {
  try {
    return await api.delete(`leagues/${leagueId}/`);
  } catch (error) {
    throw error;
  }
};

export const fetchLeagueRankings = async (leagueId) => {
  try {
    const { data } = await api.get(`leagues/${leagueId}/standings`);
    return data;
  } catch (error) {
    throw error;
  }
};
