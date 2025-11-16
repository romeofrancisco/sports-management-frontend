import api from "@/api";

export const getFacilities = async (params) => {
  try {
    const { data } = await api.get(`facilities/`, { params });
    // Backwards-compatible helper: return array for simple callers.
    return Array.isArray(data) ? data : data.results || [];
  } catch (err) {
    throw err;
  }
};

// Raw fetch that returns the full API response body (useful for pagination)
export const getFacilitiesRaw = async (params) => {
  try {
    const { data } = await api.get(`facilities/`, { params });
    return data;
  } catch (err) {
    throw err;
  }
};
