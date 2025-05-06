import api from ".";

export const fetchTeams = async (filter) => {
  try {
    const { data } = await api.get("teams/", { params: filter });
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchTeamDetails = async (team) => {
  try {
    const { data } = await api.get(`teams/${team}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchSportTeams = async (sport) => {
  try {
    const { data } = await api.get(`sports/${sport}/teams`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const createTeam = async (teamData) => {
  try {
    const { data } = await api.post("teams/", teamData);
    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteTeam = async (team) => {
  try {
    const { data } = await api.delete(`teams/${team}/`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateTeam = async (teamData, team) => {
  try {
    const { data } = await api.patch(`teams/${team}/`, teamData);
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchTeamsInSeason = async (leagueId, seasonId) => {
  try {
    const { data } = await api.get(`leagues/${leagueId}/seasons/${seasonId}/teams/`);
    return data;
  } catch (error) {
    console.log("Error fetching teams in season:", error);
    throw error;
  }
};
