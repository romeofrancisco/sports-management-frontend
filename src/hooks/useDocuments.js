import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchRootFolders,
  fetchFolderContents,
  uploadFile,
  downloadFile,
  copyFile,
  deleteFile,
  renameFile,
  getMyDocuments,
  getUserPersonalFolder,
  createFolder,
  renameFolder,
  deleteFolder,
} from "@/api/documentsApi";
import { toast } from "sonner";
import { useState } from "react";
import { useRolePermissions } from "./useRolePermissions";

export const useRootFolders = () => {
  return useQuery({
    queryKey: ["root-folders"],
    queryFn: () => fetchRootFolders(),
  });
};

export const useFolderContents = (folderId) => {
  return useQuery({
    queryKey: ["folder-contents", folderId],
    queryFn: () => fetchFolderContents(folderId),
    enabled: !!folderId,
  });
};

export const useCreateFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (folderData) => createFolder(folderData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["folder-contents", variables.parent],
      });

      queryClient.invalidateQueries({
        queryKey: ["root-folders"],
      });

      toast.success("Folder created successfully", {
        description: `${data.name} has been created.`,
      });
    },
    onError: (error) => {
      toast.error("Failed to create folder", {
        description:
          error?.response?.data?.message ||
          error.message ||
          "An error occurred",
      });
    },
  });
};

export const useUploadFile = () => {
  const queryClient = useQueryClient();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [toastId, setToastId] = useState(null);

  const mutation = useMutation({
    mutationFn: (fileData) =>
      uploadFile(fileData, (progress) => {
        setUploadProgress(progress);

        if (progress === 100) {
          // Upload complete, show processing message
          if (toastId) {
            toast.loading("Processing file...", { id: toastId });
          }
        } else {
          // Show/update progress toast
          const id = toastId || toast.loading(`Uploading... ${progress}%`);
          if (!toastId) setToastId(id);
          else toast.loading(`Uploading... ${progress}%`, { id: toastId });
        }
      }),
    onMutate: () => {
      // Initialize toast
      const id = toast.loading("Preparing upload...");
      setToastId(id);
    },
    onSuccess: (data, variables) => {
      // Invalidate the folder contents for the uploaded folder
      queryClient.invalidateQueries({
        queryKey: ["folder-contents", variables.folder],
      });
      // Also invalidate root folders in case it was uploaded to root
      queryClient.invalidateQueries({
        queryKey: ["root-folders"],
      });

      // Dismiss progress toast and show success
      if (toastId) {
        toast.success("File uploaded successfully", {
          id: toastId,
          description: data?.title + " has been uploaded.",
        });
      }

      // Reset state
      setUploadProgress(0);
      setToastId(null);
    },
    onError: (error) => {
      // Dismiss progress toast and show error
      if (toastId) {
        toast.error("Upload failed", {
          id: toastId,
          description:
            error?.response?.data?.message ||
            error.message ||
            "Failed to upload file",
        });
      }

      // Reset state
      setUploadProgress(0);
      setToastId(null);
    },
  });

  return {
    ...mutation,
    uploadProgress,
  };
};

export const useDownloadFile = () => {
  return useMutation({
    mutationFn: async ({ fileId, fileName }) => {
      const fileUrl = await downloadFile(fileId);

      // Open the Cloudinary URL directly - it will download due to fl_attachment flag
      const link = document.createElement("a");
      link.href = fileUrl;
      link.target = "_blank"; // Open in new tab as fallback
      link.download = fileName || "download"; // Suggest filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    onSuccess: () => {
      toast.success("Download started");
    },
    onError: (error) => {
      toast.error("Download failed", {
        description:
          error?.response?.data?.message ||
          error.message ||
          "Failed to download file",
      });
    },
  });
};

export const useCopyFile = () => {
  const queryClient = useQueryClient();
  const { isAdmin, isCoach, isPlayer } = useRolePermissions();

  return useMutation({
    mutationFn: async ({ fileId, currentFolder, rootData }) => {
      let targetFolderId = null;

      try {
        if (isCoach() || isPlayer()) {
          // For coaches and players, get their personal folder from the dedicated API endpoint
          const personalFolder = await getUserPersonalFolder();
          targetFolderId = personalFolder.id;
        } else if (isAdmin()) {
          // Admin can copy to current folder (if exists) or first available folder
          targetFolderId = currentFolder?.id || rootData?.folders?.[0]?.id;
        }

        if (!targetFolderId) {
          throw new Error("Unable to find your personal folder to copy to.");
        }

        // Perform the copy operation
        return await copyFile(fileId, targetFolderId);
      } catch (error) {
        // Re-throw with better error message
        throw new Error(
          error.response?.data?.error ||
            error.message ||
            "Error finding your personal folder to copy to."
        );
      }
    },
    onSuccess: (data, variables) => {
      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({
        queryKey: ["folder-contents"],
      });

      queryClient.invalidateQueries({
        queryKey: ["root-folders"],
      });

      toast.success("File copied successfully", {
        description: "The file has been copied to your folder.",
      });
    },
    onError: (error) => {
      toast.error("Cannot copy file", {
        description: error.message,
      });
    },
  });
};

export const useDeleteFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFile,
    onSuccess: () => {
      // Invalidate all folder queries to refresh the list
      queryClient.invalidateQueries({
        queryKey: ["folder-contents"],
      });
      queryClient.invalidateQueries({
        queryKey: ["root-folders"],
      });

      toast.success("File deleted successfully", {
        description: "The file has been removed.",
      });
    },
    onError: (error) => {
      toast.error("Delete failed", {
        description:
          error?.response?.data?.message ||
          error.message ||
          "Failed to delete file",
      });
    },
  });
};

export const useRenameFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ fileId, newTitle }) => renameFile(fileId, newTitle),
    onSuccess: () => {
      // Invalidate all folder queries to refresh the list
      queryClient.invalidateQueries({
        queryKey: ["folder-contents"],
      });
      queryClient.invalidateQueries({
        queryKey: ["root-folders"],
      });

      toast.success("File renamed successfully", {
        description: "The file name has been updated.",
      });
    },
    onError: (error) => {
      toast.error("Rename failed", {
        description:
          error?.response?.data?.error ||
          error.message ||
          "Failed to rename file",
      });
    },
  });
};

export const useMyDocuments = () => {
  return useQuery({
    queryKey: ["my-documents"],
    queryFn: getMyDocuments,
  });
};

export const useRenameFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ folderId, newName }) => renameFolder(folderId, newName),
    onSuccess: (data) => {
      // Invalidate queries to refresh the folder list
      queryClient.invalidateQueries({ queryKey: ["root-folders"] });
      queryClient.invalidateQueries({ queryKey: ["folder-contents"] });

      toast.success("Folder renamed successfully", {
        description: `Folder renamed to "${data.name}"`,
      });
    },
    onError: (error) => {
      toast.error("Failed to rename folder", {
        description:
          error?.response?.data?.message ||
          error.message ||
          "An error occurred",
      });
    },
  });
};

export const useDeleteFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (folderId) => deleteFolder(folderId),
    onSuccess: () => {
      // Invalidate queries to refresh the folder list
      queryClient.invalidateQueries({ queryKey: ["root-folders"] });
      queryClient.invalidateQueries({ queryKey: ["folder-contents"] });

      toast.success("Folder deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete folder", {
        description:
          error?.response?.data?.message ||
          error.message ||
          "An error occurred",
      });
    },
  });
};
