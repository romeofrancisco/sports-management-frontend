import api from ".";

/**
 * Create a new player registration (public endpoint - self-registration)
 */
export const createPlayerRegistration = async (registrationData) => {
  try {
    const { data } = await api.post("player-registrations/", registrationData);
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Upload a document to a player registration
 */
export const uploadRegistrationDocument = async (registrationId, documentData) => {
  try {
    const formData = new FormData();
    formData.append("document_type", documentData.document_type);
    formData.append("title", documentData.title);
    formData.append("file", documentData.file);

    const { data } = await api.post(
      `player-registrations/${registrationId}/upload-document/`,
      formData
    );
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a document from a player registration
 */
export const deleteRegistrationDocument = async (registrationId, documentId) => {
  try {
    await api.delete(
      `player-registrations/${registrationId}/documents/${documentId}/`
    );
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch all player registrations (admin/coach only)
 */
export const fetchPlayerRegistrations = async (filters = {}) => {
  try {
    const { data } = await api.get("player-registrations/", { params: filters });
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch pending player registrations (admin/coach only)
 */
export const fetchPendingRegistrations = async () => {
  try {
    const { data } = await api.get("player-registrations/pending/");
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch registration statistics (admin/coach only)
 */
export const fetchRegistrationStats = async () => {
  try {
    const { data } = await api.get("player-registrations/stats/");
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch a single player registration detail
 */
export const fetchPlayerRegistration = async (registrationId) => {
  try {
    const { data } = await api.get(`player-registrations/${registrationId}/`);
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Approve a player registration (admin/coach only)
 */
export const approvePlayerRegistration = async (registrationId, approvalData) => {
  try {
    const { data } = await api.post(
      `player-registrations/${registrationId}/approve/`,
      approvalData
    );
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Reject a player registration (admin/coach only)
 */
export const rejectPlayerRegistration = async (registrationId, rejectionData) => {
  try {
    const { data } = await api.post(
      `player-registrations/${registrationId}/reject/`,
      rejectionData
    );
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a player registration (admin only)
 */
export const deletePlayerRegistration = async (registrationId) => {
  try {
    await api.delete(`player-registrations/${registrationId}/`);
  } catch (error) {
    throw error;
  }
};
