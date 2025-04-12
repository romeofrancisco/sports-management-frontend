import api from ".";

export const fetchCoaches = async () => {
  try {
    const { data } = await api.get("coaches/");
    return data;
  } catch (error) {
    throw error;
  }
};

export const createCoach = async (coachData) => {
  try {
    const { data } = await api.post("coaches/", coachData);
    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteCoach = async (coachId) => {
  try {
    const { data } = await api.delete(`coaches/${coachId}/`);
    return data;
  } catch (error) {
    throw error;
  }
};
