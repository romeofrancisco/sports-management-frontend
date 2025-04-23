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

export const createSport = async (sportData) => {
  try {
    const { data } = await api.post("sports/", sportData);
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateSport = async (sportId, sportData) => {
  try {
    const { data } = await api.patch(`sports/${sportId}/`, sportData);
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

export const fetchSportStats = async (sport, filter) => {
  try {
    const { data } = await api.get(`sport-stats/?sport=${sport}`, {
      params: filter,
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteSportStat = async (statId) => {
  try {
    const { data } = await api.delete(`sport-stats/${statId}/`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const createSportStats = async (statData) => {
  try {
    const { data } = await api.post("sport-stats/", statData);
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateSportStats = async (statId, statData) => {
  console.log(statData);
  try {
    const { data } = await api.patch(`sport-stats/${statId}/`, statData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
};
