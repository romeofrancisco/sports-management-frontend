import api from ".";

export const createPlayer = async (playerData) => {
  try {
    const { data } = await api.post("players/", playerData);
    return data;
  } catch (error) {
    console.log(error)
    throw error;
  }
};

export const updatePlayer = async (player, playerData) => {
  try {
    const { data } = await api.patch(`players/${player}/`, playerData);
    return data;
  } catch (error) {
    throw error;
  }
};

export const deletePlayer = async (slug) => {
  try {
    await api.delete(`players/${slug}/`);
  } catch (error) {
    throw error;
  }
};

export const fetchPlayers = async (filter) => {
  try {
    const { data } = await api.get("players", { params: filter });
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchPlayerDetails = async (player) => {
  try {
    const { data } = await api.get(`players/${player}`);
    return data;
  } catch (error) {
    throw error;
  }
};
