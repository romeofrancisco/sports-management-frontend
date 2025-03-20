import api from ".";

export const fetchTeams = async () => {
  try {
    const { data } = await api.get("teams/");
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

export const fetchCoaches = async () => {
  try {
    const { data } = await api.get("coaches/");
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
