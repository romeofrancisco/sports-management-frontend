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
  searchAll,
  searchFolders,
  searchDocuments,
} from "@/api/documentsApi";
import { toast } from "sonner";
import { useState, useRef } from "react";
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
        richColors: true,
        description: `${data.name} has been created.`,
      });
    },
  });
};

export const useUploadFile = () => {
  const queryClient = useQueryClient();
  const [uploadProgress, setUploadProgress] = useState(0);
  const toastIdRef = useRef(null);

  const mutation = useMutation({
    mutationFn: (fileData) =>
      uploadFile(fileData, (progress) => {
        setUploadProgress(progress);

        if (progress === 100) {
          // Upload complete, show processing message
          if (toastIdRef.current) {
            toast.loading("Processing file...", {
              richColors: true,
              description: (
                <span className="text-muted-foreground">
                  Your file is being processed.
                </span>
              ),
              id: toastIdRef.current,
            });
          }
        } else if (progress > 0) {
          // Show/update progress toast with progress bar
          if (toastIdRef.current) {
            toast.loading(
              <div className="flex flex-col gap-2 w-full min-w-[280px] md:min-w-[300px]">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Uploading file...</span>
                  <span className="text-sm text-muted-foreground">
                    {progress}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>,
              {
                richColors: true,
                id: toastIdRef.current,
                duration: Infinity, // Don't auto-dismiss during upload
              }
            );
          }
        }
      }),
    onMutate: () => {
      // Initialize toast and store ID in ref (synchronous, available immediately)
      const id = toast.loading("Preparing upload...");
      toastIdRef.current = id;
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
      if (toastIdRef.current) {
        toast.success("File uploaded successfully", {
          richColors: true,
          id: toastIdRef.current,
          description: data?.title + " has been uploaded.",
        });
      }

      // Reset state
      setUploadProgress(0);
      toastIdRef.current = null;
    },
    onError: (error) => {
      // Dismiss progress toast and show error
      if (toastIdRef.current) {
        toast.error("Upload failed", {
          richColors: true,
          id: toastIdRef.current,
          description:
            error?.response?.data?.detail ||
            error.message ||
            "Failed to upload file",
        });
      }

      // Reset state
      setUploadProgress(0);
      toastIdRef.current = null;
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
      toast.success("Download started", {
        richColors: true,
        description: "Your file download has started.",
      });
    },
    onError: (error) => {
      toast.error("Download failed", {
        richColors: true,
        description:
          error?.response?.data?.detail ||
          error.message ||
          "Failed to download file",
      });
    },
  });
};

export const useCopyFile = () => {
  const queryClient = useQueryClient();
  const { isAdmin, isCoach, isPlayer } = useRolePermissions();
  const toastIdRef = useRef(null);

  return useMutation({
    mutationFn: async ({ fileId, currentFolder, rootData }) => {
      let targetFolderId = null;

      try {
        if (isCoach() || isPlayer()) {
          // For coaches and players, get their personal folder from the dedicated API endpoint
          const personalFolder = await getUserPersonalFolder();
          targetFolderId = personalFolder.id;
          
          if (!targetFolderId) {
            throw new Error("Unable to find your personal folder to copy to.");
          }
        } else if (isAdmin()) {
          // Admin copies to null (root level) - files appear at admin's root
          targetFolderId = null;
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
    onMutate: () => {
      // Show loading toast
      const id = toast.loading("Copying file...", {
        richColors: true,
        description: (
          <span className="text-muted-foreground">
            Your file is being processed.
          </span>
        ),
      });
      toastIdRef.current = id;
    },
    onSuccess: (data, variables) => {
      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({
        queryKey: ["folder-contents"],
      });

      queryClient.invalidateQueries({
        queryKey: ["root-folders"],
      });

      // Update the loading toast to success
      if (toastIdRef.current) {
        toast.success("File copied successfully", {
          richColors: true,
          description: "The file has been copied to your folder.",
          id: toastIdRef.current,
        });
      }

      // Reset toast ref
      toastIdRef.current = null;
    },
    onError: (error) => {
      // Update the loading toast to error
      if (toastIdRef.current) {
        toast.error("Cannot copy file", {
          richColors: true,
          description: error.message,
          id: toastIdRef.current,
        });
      }

      // Reset toast ref
      toastIdRef.current = null;
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
        richColors: true,
        description: "The file has been removed.",
      });
    },
    onError: (error) => {
      toast.error("Delete failed", {
        richColors: true,
        description:
          error?.response?.data?.detail ||
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
        richColors: true,
        description: "The file name has been updated.",
      });
    },
    onError: (error) => {
      toast.error("Rename failed", {
        richColors: true,
        description:
          error?.response?.data?.detail ||
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
        richColors: true,
        description: `Folder renamed to "${data.name}"`,
      });
    },
    onError: (error) => {
      toast.error("Failed to rename folder", {
        richColors: true,
        description:
          error?.response?.data?.detail || error.message || "An error occurred",
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
        richColors: true,
        description:
          error?.response?.data?.detail || error.message || "An error occurred",
      });
    },
  });
};

export const useSearchDocuments = (query, enabled = true) => {
  return useQuery({
    queryKey: ["search-documents", query],
    queryFn: () => searchAll(query),
    enabled: enabled && !!query && query.length > 0,
    staleTime: 30000, // Cache results for 30 seconds
  });
};
