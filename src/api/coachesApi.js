import api from ".";

export const fetchCoaches = async (filter) => {
  try {
    const { data } = await api.get("coaches/", { params: filter });
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

export const updateCoach = async (coachId, coachData) => {
  try {
    const { data } = await api.patch(`coaches/${coachId}/`, coachData);
    return data;
  } catch (error) {
    console.log(error);
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
