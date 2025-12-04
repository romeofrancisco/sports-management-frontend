import api from ".";

export const createFolder = async (folderData) => {
  try {
    const { data } = await api.post(`/documents/folders/`, folderData);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const fetchRootFolders = async () => {
  try {
    const { data } = await api.get(`/documents/folders/root_folders/`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchFolderContents = async (folderId) => {
  try {
    const { data } = await api.get(`/documents/folders/${folderId}/contents/`);
    return data;
  } catch (error) {
    throw error;
  } 
};

export const fetchFolderDetails = async (folderId) => {
  try {
    const { data } = await api.get(`/documents/folders/${folderId}/`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const uploadFile = async (fileData, onUploadProgress) => {
  try {
    const formData = new FormData();
    formData.append("file", fileData.file);
    formData.append("title", fileData.title);
    
    // Only append folder if it's not null/undefined (admins can upload without a folder)
    if (fileData.folder !== null && fileData.folder !== undefined) {
      formData.append("folder", fileData.folder);
    }
    
    if (fileData.description) {
      formData.append("description", fileData.description);
    }

    const { data } = await api.post(`/documents/files/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress && progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onUploadProgress(percentCompleted);
        }
      },
    });
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const downloadFile = async (fileId) => {
  try {
    // First get the file details
    const { data } = await api.get(`/documents/files/${fileId}/`);
    
    // Check if it's a Google Drive file
    if (data.google_drive_id) {
      const ext = (data.file_extension || '').toLowerCase();
      
      // Determine the correct export format and base URL
      if (ext === '.xlsx' || ext === '.xls') {
        return `https://docs.google.com/spreadsheets/d/${data.google_drive_id}/export?format=xlsx`;
      } else if (ext === '.pptx' || ext === '.ppt') {
        return `https://docs.google.com/presentation/d/${data.google_drive_id}/export/pptx`;
      } else if (ext === '.pdf') {
        // PDFs stored in Drive - download directly
        return `https://drive.google.com/uc?export=download&id=${data.google_drive_id}`;
      } else if (['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.webp'].includes(ext)) {
        // Images - download directly from Drive
        return `https://drive.google.com/uc?export=download&id=${data.google_drive_id}`;
      } else if (ext === '.docx' || ext === '.doc') {
        return `https://docs.google.com/document/d/${data.google_drive_id}/export?format=docx`;
      } else {
        // Other files - try direct download from Drive
        return `https://drive.google.com/uc?export=download&id=${data.google_drive_id}`;
      }
    }
    
    // For Cloudinary files, use file_url (which fallbacks to cloudinary_url)
    const fileUrl = data.file_url || data.cloudinary_url || data.file;
    if (fileUrl) {
      return fileUrl;
    }
    
    throw new Error("No download URL available for this file");
  } catch (error) {
    throw error;
  }
};

export const copyFile = async (fileId, targetFolderId, tokens) => {
  try {
    const body = { target_folder: targetFolderId };
    if (tokens) body.tokens = tokens;
    const { data } = await api.post(`/documents/files/${fileId}/copy/`, body);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const moveFile = async (fileId, targetFolderId) => {
  try {
    const { data } = await api.patch(`/documents/files/${fileId}/move/`, {
      target_folder: targetFolderId,
    });
    return data;
  } catch (error) {
    console.log(error.response.data);
    throw error;
  }
};

export const deleteFile = async (fileId) => {
  try {
    await api.delete(`/documents/files/${fileId}/`);
  } catch (error) {
    throw error;
  }
};

export const renameFile = async (fileId, newTitle) => {
  try {
    const { data } = await api.patch(`/documents/files/${fileId}/rename/`, {
      title: newTitle,
    });
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getMyDocuments = async () => {
  try {
    const { data } = await api.get(`/documents/files/my_documents/`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getUserPersonalFolder = async () => {
  try {
    // Use the new personal_folder endpoint to get user's personal folder for copy operations
    const { data } = await api.get(`/documents/folders/personal_folder/`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const renameFolder = async (folderId, newName) => {
  try {
    const { data } = await api.patch(`/documents/folders/${folderId}/`, {
      name: newName,
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteFolder = async (folderId) => {
  try {
    await api.delete(`/documents/folders/${folderId}/`);
  } catch (error) {
    throw error;
  }
};

export const searchFolders = async (query) => {
  try {
    const { data } = await api.get(`/documents/folders/search/`, {
      params: { q: query },
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const searchDocuments = async (query) => {
  try {
    const { data } = await api.get(`/documents/files/search/`, {
      params: { q: query },
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const searchAll = async (query) => {
  try {
    const [foldersResponse, documentsResponse] = await Promise.all([
      searchFolders(query),
      searchDocuments(query),
    ]);
    
    return {
      results: [
        ...foldersResponse.results,
        ...documentsResponse.results,
      ],
      count: foldersResponse.count + documentsResponse.count,
    };
  } catch (error) {
    throw error;
  }
};
