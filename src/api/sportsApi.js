import api from ".";

export const fetchSports = async () => {
  const { data } = await api.get("sports/");
  return data;
};
