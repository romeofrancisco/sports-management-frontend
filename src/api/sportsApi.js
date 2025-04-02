import api from ".";

export const fetchSports = async () => {
  try {
    const { data } = await api.get("sports/");
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchSportDetails = async (sport) => {
  try {
    const { data } = await api.get(`sports/${sport}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchPositions = async () => {
  try {
    const { data } = await api.get("positions/");
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchSportPositions = async (sport) => {
  try {
    const { data } = await api.get(`positions/?sport=${sport}`);
    console.log(data)
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchRecordableStats = async (gameId) => {
  try {
    const { data } = await api.get(
      `player-stats/recordable_stats/?game_id=${gameId}`
    );
    return data;
  } catch (error) {
    throw error;
  }
};
