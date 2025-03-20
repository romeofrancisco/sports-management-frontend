import api from ".";

export const fetchSports = async () => {
  try {
    const { data } = await api.get("sports/");
    return data;
  } catch (error) {
    throw error;
  }
};

