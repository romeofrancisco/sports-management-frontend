import api from ".";

export const fetchGames = async (filter) => {
  try {
    const { data } = await api.get("/games/", { params: filter });
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchGameDetails = async (id) => {
  try {
    const { data } = await api.get(`/games/${id}/`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const createGame = async (gameData) => {
  try {
    const { data } = await api.post("/games/", gameData);
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateGame = async (gameData, id) => {
  try {
    const { data } = await api.patch(`/games/${id}/`, gameData);
    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteGame = async (game) => {
  try {
    await api.delete(`/games/${game}/`);
  } catch (error) {
    throw error;
  }
};

export const fetchGamePlayers = async (gameId) => {
  try {
    const { data } = await api.get(`/games/${gameId}/players`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateStartingLineup = async (lineup, gameId) => {
  try {
    const { data } = await api.post(`games/${gameId}/starting_lineup/`, lineup);
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchStartingLineup = async (gameId) => {
  try {
    const { data } = await api.get(`games/${gameId}/starting_lineup/`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchCurrentPlayers = async (gameId) => {
  try {
    const { data } = await api.get(`games/${gameId}/current_players/`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const createSubstitution = async (substituteData) => {
  try {
    const { data } = await api.post(
      "substitutions/bulk_create/",
      substituteData
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export const manageGame = async (gameId, action) => {
  try {
    const { data } = await api.post(`games/${gameId}/manage/`, {
      action: action,
    });
    return data;
  } catch (error) {
    throw error;
  }
};
