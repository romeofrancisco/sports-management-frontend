import api from "./index";

export const leaderApi = {
  // Get all leader categories
  getAll: async (params = {}) => {
    try {
      const response = await api.get("/leader-categories/", { params });
      return response.data;
    } catch (error) {
      console.log("Error fetching leader categories:", error);
      throw error;
    }
  },

  // Get leader categories by sport
  getBySport: async (sportSlug, leaderType = null) => {
    try {
      let params = { sport: sportSlug };
      if (leaderType) {
        params.leader_type = leaderType;
      }
      const response = await api.get("/leader-categories/by_sport/", { params });
      return response.data;
    } catch (error) {
      console.log("Error fetching leader categories by sport:", error);
      throw error;
    }
  },

  // Get a single leader category
  get: async (id) => {
    try {
      const response = await api.get(`/leader-categories/${id}/`);
      return response.data;
    } catch (error) {
      console.log("Error fetching leader category:", error);
      throw error;
    }
  },

  // Create a new leader category
  create: async (data) => {
    try {
      const response = await api.post("/leader-categories/", data);
      return response.data;
    } catch (error) {
      console.log("Error creating leader category:", error);
      throw error;
    }
  },

  // Update an existing leader category
  update: async (id, data) => {
    try {
      const response = await api.put(`/leader-categories/${id}/`, data);
      return response.data;
    } catch (error) {
      console.log("Error updating leader category:", error);
      throw error;
    }
  },

  // Delete a leader category
  delete: async (id) => {
    try {
      const response = await api.delete(`/leader-categories/${id}/`);
      return response.data;
    } catch (error) {
      console.log("Error deleting leader category:", error);
      throw error;
    }
  },
};

export default leaderApi;