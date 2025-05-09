import api from ".";

export const createLeague = async (newLeague) => {
  try {
    const { data } = await api.post("leagues/", newLeague);
    return data;
  } catch (error) {
    console.log("Error creating league:", error);
    throw error;
  }
};

export const fetchLeagues = async () => {
  try {
    const { data } = await api.get("leagues/");
    return data;
  } catch (error) {
    console.log("Error fetching leagues:", error);
    throw error;
  }
};

export const fetchLeagueDetails = async (id) => {
  try {
    const { data } = await api.get(`leagues/${id}/`);
    return data;
  } catch (error) {
    console.log("Error fetching league details:", error);
    throw error;
  }
};

export const updateLeague = async (id, updatedLeague) => {
  try {
    const { data } = await api.patch(`leagues/${id}/`, updatedLeague);
    return data;
  } catch (error) {
    console.log("Error updating league:", error);
    throw error;
  }
};

export const deleteLeague = async (id) => {
  try {
    await api.delete(`leagues/${id}/`);
    return true;
  } catch (error) {
    console.log("Error deleting league:", error);
    throw error;
  }
};

export const fetchLeagueRankings = async (id) => {
  try {
    const { data } = await api.get(`leagues/${id}/standings/`);
    return data;
  } catch (error) {
    console.log("Error fetching league rankings:", error);
    throw error;
  }
};

export const fetchLeagueStatistics = async (id) => {
  try {
    const { data } = await api.get(`leagues/${id}/statistics/`);
    return data;
  } catch (error) {
    console.log("Error fetching league statistics:", error);
    throw error;
  }
};

export const fetchLeagueComprehensiveStats = async (id) => {
  try {
    const { data } = await api.get(`leagues/${id}/comprehensive_stats/`);
    return data;
  } catch (error) {
    console.log("Error fetching comprehensive league statistics:", error);
    throw error;
  }
};

export const fetchLeagueTeamForm = async (id) => {
  try {
    const { data } = await api.get(`leagues/${id}/team_form/`);
    return data;
  } catch (error) {
    console.log("Error fetching team form data:", error);
    throw error;
  }
};

export const addTeamToLeague = async (league_id, team_id) => {
  try {
    const { data } = await api.post(`leagues/${league_id}/add_team/`, {
      team_id,
    });
    return data;
  } catch (error) {
    console.log("Error adding team to league:", error);
    throw error;
  }
};

export const removeTeamFromLeague = async (league_id, team_id) => {
  try {
    const { data } = await api.post(`leagues/${league_id}/remove_team/`, {
      team_id,
    });
    return data;
  } catch (error) {
    console.log("Error removing team from league:", error);
    throw error;
  }
};
