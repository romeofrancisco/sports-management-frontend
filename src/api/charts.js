import api from ".";

export const fetchGameFlow = async (gameId) => {
  try {
    const { data } = await api.get(`games/${gameId}/game_flow/`);
    return data;
  } catch (error) {
    throw error;
  }
};
