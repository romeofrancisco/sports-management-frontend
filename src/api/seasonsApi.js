import api from ".";

export const createSeason = async (leagueId, seasonData) => {
    try {
      const { data } = await api.post(`leagues/${leagueId}/`, seasonData);
      return data;
    } catch (error) {
      throw error;
    }
  };
  
  export const fetchSeasons = async (leagueId) => {
    try {
      const { data } = await api.get(`leagues/${leagueId}/`);
      return data;
    } catch (error) {
      throw error;
    }
  };
  
  export const updateSeason = async (leagueId, seasonData) => {
    try {
      const { data } = await api.patch(`leagues/${leagueId}/`, seasonData);
      return data;
    } catch (error) {
      throw error;
    }
  };
  
  export const deleteSeason = async (leagueId) => {
    try {
      const { data } = await api.delete(`leagues/${leagueId}/`);
      return data;
    } catch (error) {
      throw error;
    }
  };
  