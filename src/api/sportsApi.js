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

export const deleteSport = async (sportId) => {
  try {
    const { data } = await api.delete(`sports/${sportId}/`);
    return data;
  } catch (error) {
    // If it's a 500 error with foreign key constraints,
    // the backend should handle this gracefully
    console.error("Delete sport error:", error);
    throw error;
  }
};

export const reactivateSport = async (sportSlug) => {
  try {
    const { data } = await api.post(`sports/${sportSlug}/reactivate/`);
    return data;
  } catch (error) {
    console.error("Reactivate sport error:", error);
    throw error;
  }
};

export const createPosition = async (positionData) => {
  try {
    const { data } = await api.post("positions/", positionData);
    return data;
  } catch (error) {
    throw error;
  }
};

export const updatePosition = async (positionId, positionData) => {
  try {
    const { data } = await api.patch(`positions/${positionId}/`, positionData);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deletePosition = async (positionId) => {
  try {
    const { data } = await api.delete(`positions/${positionId}/`);
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

export const fetchStatCategories = async (filter) => {
  try {
    const { data } = await api.get(`sport-categories/`, {
      params: filter,
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const createStatCategory = async (category) => {
  console.log("Creating category:", category);
  try {
    const { data } = await api.post(`sport-categories/`, category);
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateStatCategory = async (categoryId, categoryData) => {
  console.log("Updating category:", categoryId, categoryData);
  try {
    const { data } = await api.patch(
      `sport-categories/${categoryId}/`,
      categoryData
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteStatCategories = async (id) => {
  try {
    const { data } = await api.delete(`sport-categories/${id}/`);
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

export const fetchSportStatsOverview = async (sport) => {
  try {
    const { data } = await api.get(`sport-stats/overview/?sport=${sport}`);
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

export const reactivateSportStat = async (statId) => {
  try {
    const { data } = await api.post(`sport-stats/${statId}/reactivate/`);
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
    console.log(error);
    throw error;
  }
};

export const updateSportStats = async (statId, statData) => {
  try {
    const { data } = await api.patch(`sport-stats/${statId}/`, statData);
    return data;
  } catch (error) {
    throw error;
  }
};
