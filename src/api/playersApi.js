import api from ".";

export const createPlayer = async (playerData) => {
  try {
    const { data } = await api.post("players/", playerData);
    return data;
  } catch (error) {
    console.log(error)
    throw error;
  }
};

export const updatePlayer = async (player, playerData) => {
  try {
    const { data } = await api.patch(`players/${player}/`, playerData);
    return data;
  } catch (error) {
    console.log(error)
    throw error;
  }
};

export const deletePlayer = async (slug) => {
  try {
    await api.delete(`players/${slug}/`);
  } catch (error) {
    throw error;
  }
};

export const fetchPlayers = async (filter) => {
  try {
    const { data } = await api.get("players", { params: filter });
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchPlayerDetails = async (player) => {
  try {
    const { data } = await api.get(`players/${player}/`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const reactivatePlayer = async (playerId) => {
  try {
    const { data } = await api.post(`players/${playerId}/reactivate/`);
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Upload a document to a player (coach-created player)
 */
export const uploadPlayerDocument = async (playerSlug, documentData) => {
  try {
    const formData = new FormData();
    formData.append("document_type", documentData.document_type);
    formData.append("title", documentData.title);
    formData.append("file", documentData.file);

    const { data } = await api.post(
      `players/${playerSlug}/upload-document/`,
      formData
    );
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch all documents for a player
 */
export const fetchPlayerDocuments = async (playerSlug) => {
  try {
    const { data } = await api.get(`players/${playerSlug}/documents/`);
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a document from a player
 */
export const deletePlayerDocument = async (playerSlug, documentId) => {
  try {
    await api.delete(`players/${playerSlug}/documents/${documentId}/`);
  } catch (error) {
    throw error;
  }
};
