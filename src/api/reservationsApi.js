import api from "@/api";

const toISO = (s) => {
  try {
    return s ? new Date(s).toISOString() : null;
  } catch (e) {
    return null;
  }
};

export const getReservations = async (params) => {
  try {
    const { data } = await api.get(`reservations/`, { params });
    const items = Array.isArray(data) ? data : data.results || [];
    return items.map((r) => ({
      id: r.id,
      title: r.facility?.name
        ? `${r.facility.name} - ${r.coach.name}`.trim()
        : `Reservation ${r.id}`,
      description: r.notes || "",
      startDate: toISO(r.start_datetime),
      endDate: toISO(r.end_datetime),
      color:
        r.status === "approved"
          ? "green"
          : r.status === "rejected"
          ? "red"
          : r.status === "cancelled"
          ? ""
          : r.status === "expired"
          ? "gray"
          : "orange",
      // Provide a generic `user` shape expected by calendar components (id + name)
      user: r.coach
        ? {
            id: r.coach.id,
            name: `${r.coach.first_name || ""} ${
              r.coach.last_name || ""
            }`.trim(),
          }
        : r.requested_by
        ? { id: r.requested_by.id, name: r.requested_by.name }
        : null,
      meta: {
        status: r.status,
        facility: r.facility,
        coach: r.coach,
        requested_by: r.requested_by,
      },
      raw: r,
    }));
  } catch (err) {
    throw err;
  }
};

export const getReservationsRaw = async (params) => {
  try {
    const { data } = await api.get(`reservations/`, { params });
    return data;
  } catch (err) {
    throw err;
  }
};

export const createReservation = async (newReservation) => {
  try {
    // Expect newReservation keys: facility_id, coach_id (optional), start_datetime, end_datetime, notes
    const payload = {
      facility_id: newReservation.facility_id,
      coach_id: newReservation.coach_id,
      start_datetime: newReservation.start_datetime,
      end_datetime: newReservation.end_datetime,
      notes: newReservation.notes,
    };
    const { data } = await api.post(`reservations/`, payload);
    return data;
  } catch (err) {
    throw err;
  }
};

export const updateReservation = async (id, updatedReservation) => {
  try {
    const payload = { ...updatedReservation };
    const { data } = await api.patch(`reservations/${id}/`, payload);
    return data;
  } catch (err) {
    throw err;
  }
};

export const deleteReservation = async (id) => {
  try {
    const { data } = await api.delete(`reservations/${id}/`);
    return data;
  } catch (err) {
    throw err;
  }
};
