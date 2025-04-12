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
      const { data } = await api.get(`leagues/${leagueId}/seasons`);
      return data;
    } catch (error) {
      throw error;
    }
  };
  
  export const fetchSeasonDetails = async (leagueId, seasonId) => {
    try {
      const { data } = await api.get(`leagues/${leagueId}/seasons/${seasonId}/`);
      return data;
    } catch (error) {
      throw error;
    }
  };

  export const fetchSeasonStandings = async (leagueId, seasonId) => {
    try {
      const { data } = await api.get(`leagues/${leagueId}/seasons/${seasonId}/standings/`);
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
  
  export const createBracket = async (bracketData) => {
    try {
      const { data } = await api.post(`brackets/`, bracketData);
      return data;
    } catch (error) {
      console.log(error)
      throw error;
    }
  };

  export const fetchBracket = async (season) => {
    try {
      const { data } = await api.get(`brackets/for_season/${season}/`);
      return data;
    } catch (error) {
      throw error;
    }
  }