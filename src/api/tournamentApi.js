import api from ".";

export const fetchTournaments = async () => {
  try {
    const { data } = await api.get("/tournaments/");
    return data;
  } catch (error) {
    console.error("Error fetching tournaments:", error);
    throw error;
  }
};

export const fetchTournamentDetails = async (tournamentId) => {
  try {
    const { data } = await api.get(`/tournaments/${tournamentId}/`);
    return data;
  } catch (error) {
    console.error("Error fetching tournament details:", error);
    throw error;
  }
};

export const createTournament = async (tournamentData) => {
  try {
    const { data } = await api.post("/tournaments/", tournamentData);
    return data;
  } catch (error) {
    console.error("Error creating tournament:", error);
    throw error;
  }
};

export const updateTournament = async (tournamentId, tournamentData) => {
  try {
    const { data } = await api.put(
      `/tournaments/${tournamentId}/`,
      tournamentData
    );
    return data;
  } catch (error) {
    console.error("Error updating tournament:", error);
    throw error;
  }
};

export const deleteTournament = async (tournamentId) => {
  try {
    await api.delete(`/tournaments/${tournamentId}/`);
  } catch (error) {
    console.error("Error deleting tournament:", error);
    throw error;
  }
};

export const fetchTournamentStandings = async (tournamentId) => {
  try {
    const { data } = await api.get(`/tournaments/${tournamentId}/standings/`);
    return data;
  } catch (error) {
    console.error("Error fetching tournament standings:", error);
    throw error;
  }
};

export const fetchTournamentStatistics = async (tournamentId) => {
  try {
    const { data } = await api.get(`/tournaments/${tournamentId}/statistics/`);
    return data;
  } catch (error) {
    console.error("Error fetching tournament statistics:", error);
    throw error;
  }
};

export const fetchTournamentComprehensiveStats = async (tournamentId) => {
  try {
    const { data } = await api.get(
      `/tournaments/${tournamentId}/comprehensive_stats/`
    );
    return data;
  } catch (error) {
    console.error("Error fetching tournament comprehensive stats:", error);
    throw error;
  }
};

export const fetchTournamentTeamForm = async (tournamentId) => {
  try {
    const { data } = await api.get(`/tournaments/${tournamentId}/team_form/`);
    return data;
  } catch (error) {
    console.error("Error fetching tournament team form:", error);
    throw error;
  }
};

export const fetchTournamentLeaders = async (tournamentId) => {
  try {
    const { data } = await api.get(`/tournaments/${tournamentId}/leaders/`);
    return data;
  } catch (error) {
    console.error("Error fetching tournament leaders:", error);
    throw error;
  }
};

export const addTeamToTournament = async (tournamentId, teamId) => {
  try {
    const { data } = await api.post(`/tournaments/${tournamentId}/add_team/`, {
      team_id: teamId,
    });
    return data;
  } catch (error) {
    console.error("Error adding team to tournament:", error);
    throw error;
  }
};

export const removeTeamFromTournament = async (tournamentId, teamId) => {
  try {
    const { data } = await api.post(
      `/tournaments/${tournamentId}/remove_team/`,
      {
        team_id: teamId,
      }
    );
    return data;
  } catch (error) {
    console.error("Error removing team from tournament:", error);
    throw error;
  }
};

export const manageTournament = async (tournamentId, action) => {
  try {
    const { data } = await api.post(`/tournaments/${tournamentId}/manage/`, {
      action,
    });
    return data;
  } catch (error) {
    console.error("Error managing tournament:", error);
    throw error;
  }
};

export const fetchTournamentTeamStatistics = async (tournamentId, teamId) => {
  try {
    const { data } = await api.get(
      `/tournaments/${tournamentId}/team_statistics/?team_id=${teamId}`
    );
    return data;
  } catch (error) {
    console.error("Error fetching tournament team statistics:", error);
    throw error;
  }
};

export const fetchTournamentGames = async (tournamentId, filters = {}) => {
  try {
    const params = new URLSearchParams(filters);
    const { data } = await api.get(
      `/tournaments/${tournamentId}/games/?${params.toString()}`
    );
    // Return the data array directly (not paginated from this endpoint)
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching tournament games:", error);
    throw error;
  }
};

export const fetchTournamentBracket = async (tournamentId) => {
  try {
    const { data } = await api.get(`/brackets/?tournament=${tournamentId}`);
    // Return the first bracket if it exists, since a tournament should only have one bracket
    return data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error("Error fetching tournament bracket:", error);
    throw error;
  }
};
