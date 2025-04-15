import api from ".";

export const createCoach = async (coachData) => {
  try {
    const { data } = await api.post("register-coach", coachData);
    return data;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (formData) => {
  try {
    const { data } = await api.post("login/", formData);
    return data;
  } catch (error) {
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await api.post("logout/", null);
  } catch (error) { 
    console.log(error);
    throw error;
  }
};

export const fetchUser = async () => {
  try {
    const { data } = await api.get("get-user/");
    return data;
  } catch {
    throw error;
  }
};

export const refreshToken = async () => {
  try {
    const { data } = await api.get("refresh/");
    return data;
  } catch (error) {
    throw error;
  }
};
