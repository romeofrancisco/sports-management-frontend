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
    const { data } = await api.get(
      `leagues/${leagueId}/seasons/${seasonId}/teams/`
    );
    return data;
  } catch (error) {
    console.log("Error fetching teams in season:", error);
    throw error;
  }
};

export const fetchTeamCoaches = async (teamSlug) => {
  try {
    const { data } = await api.get(`teams/${teamSlug}/coaches/`);
    return data;
  } catch (error) {
    console.log("Error fetching team coaches:", error);
    throw error;
  }
};

export const fetchTeamPlayers = async (teamSlug) => {
  try {
    const { data } = await api.get(`teams/${teamSlug}/players/`);
    return data;
  } catch (error) {
    console.log("Error fetching team players:", error);
    throw error;
  }
};

export const fetchTeamAnalytics = async (teamSlug, days = 30) => {
  try {
    const { data } = await api.get(`teams/${teamSlug}/analytics/?days=${days}`);
    return data;
  } catch (error) {
    console.log("Error fetching team analytics:", error);
    throw error;
  }
};

export const fetchTeamPerformance = async (teamSlug, season = null) => {
  try {
    const params = season ? { season } : {};
    const { data } = await api.get(`teams/${teamSlug}/performance/`, { params });
    return data;
  } catch (error) {
    console.log("Error fetching team performance:", error);
    throw error;
  }
};

export const fetchTeamGames = async (teamSlug, params = {}) => {
  try {
    const { data } = await api.get(`teams/${teamSlug}/games/`, { params });
    return data;
  } catch (error) {
    console.log("Error fetching team games:", error);
    throw error;
  }
};

export const fetchAllTeamGames = async (teamSlug) => {
  try {
    const { data } = await api.get(`teams/${teamSlug}/games_all/`);
    return data;
  } catch (error) {
    console.log("Error fetching all team games:", error);
    throw error;
  }
};

export const fetchTeamTrainingSessions = async (teamSlug, params = {}) => {
  try {
    const { data } = await api.get(`teams/${teamSlug}/training_sessions/`, { params });
    return data;
  } catch (error) {
    console.log("Error fetching team training sessions:", error);
    throw error;
  }
};

export const fetchTeamStatistics = async (teamSlug, period = 'season') => {
  try {
    const { data } = await api.get(`teams/${teamSlug}/statistics/?period=${period}`);
    return data;
  } catch (error) {
    console.log("Error fetching team statistics:", error);
    throw error;
  }
};

export const fetchTeamScoringAnalytics = async (teamSlug, filters = {}) => {
  try {
    const { data } = await api.get(`teams/${teamSlug}/scoring_analytics/`, { 
      params: filters 
    });
    return data;
  } catch (error) {
    throw error;
  }
};

