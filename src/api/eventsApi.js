import api from "@/api";

export const getEvents = async (params) => {
  // Try to fetch real events from the backend (events app). Fallback to mock.
  try {
    const { data } = await api.get(`events`, { params });
    const items = Array.isArray(data) ? data : data.results || [];
    return items.map((s) => {
      let start = null;
      let end = null;
      try {
        // Backend now returns ISO datetimes in `startDate` / `endDate` when available.
        if (s.startDate) start = new Date(s.startDate).toISOString();
        else if (s.startDate && s.startTime)
          start = new Date(`${s.startDate}T${s.startTime}`).toISOString();

        if (s.endDate) end = new Date(s.endDate).toISOString();
        else if (s.endDate && s.endTime)
          end = new Date(`${s.endDate}T${s.endTime}`).toISOString();
      } catch (err) {
        // ignore parse errors and fallback to null
      }

      return {
        id: s.id,
        title: s.title,
        description: s.description,
        startDate: start,
        endDate: end,
        color: s.color || "blue",
        user: s.user,
        meta: { status: s.status, location: s.location },
        type: s.type
      };
    });
  } catch (err) {
    throw err;
  }
};

export const createEvent = async (newEvent) => {
  try {
    const { data } = await api.post(`events/`, newEvent);
    return data;
  } catch (err) {
    throw err;
  }
};

export const updateEvent = async (id, updatedEvent) => {
  try {
    const { data } = await api.patch(`events/${id}/`, updatedEvent);
    return data;
  } catch (err) {
    throw err;
  }
};

export const deleteEvent = async (id) => {
  try {
    const { data } = await api.delete(`events/${id}/`);
    return data;
  } catch (err) {
    throw err;
  }
}



