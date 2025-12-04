import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
  useDownloadFile,
  useCopyFile,
  useRenameFile,
  useDeleteFile,
} from "@/hooks/useDocuments";
import { useRolePermissions } from "@/hooks/useRolePermissions";
import { toast } from "sonner";
import {
  hasValidTokens,
  getStoredTokens,
} from "@/features/editors/hooks/useGoogleEditor";
import api from "@/api";
import docx from "@/assets/documents/docx.png";
import pdf from "@/assets/documents/pdf.png";
import pptx from "@/assets/documents/pptx.png";
import xlsx from "@/assets/documents/xlsx.png";
import txt from "@/assets/documents/txt.png";
import csv from "@/assets/documents/csv.png";
import img from "@/assets/documents/img.png";
import defaultFile from "@/assets/documents/default.png";

export const useFileCard = (file, currentFolder, rootData, onCopy, onCut) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { permissions } = useRolePermissions();
  const downloadMutation = useDownloadFile();
  const copyMutation = useCopyFile();
  const renameMutation = useRenameFile();
  const deleteMutation = useDeleteFile();

  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newFileName, setNewFileName] = useState(file.title);
  const [displayName, setDisplayName] = useState(file.title);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const inputRef = useRef(null);
  const longPressTimerRef = useRef(null);

  const canEdit = permissions.documents.canEdit(file);
  const canDelete = permissions.documents.canDelete(file);
  const canCopy = permissions.documents.canCopy();

  // Update displayName when file.title changes
  useEffect(() => {
    setDisplayName(file.title);
    setNewFileName(file.title);
  }, [file.title]);

  // Focus input when rename mode starts
  useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isRenaming]);

  // Cleanup long press timer on unmount
  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, []);

  // Touch handlers for mobile
  const handleTouchStart = () => {
    longPressTimerRef.current = setTimeout(() => {
      setContextMenuOpen(true);
    }, 500);
  };

  const handleTouchEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
  };

  const handleTouchMove = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
  };

  // File operations
  const handleDownload = () => {
    downloadMutation.mutate({
      fileId: file.id,
      fileName: file.title,
    });
  };

  // Helper function to open document after authentication
  const openDocumentAfterAuth = async (documentId) => {
    setIsOpening(true);
    const loadingToast = toast.loading("Opening document in Google Drive...");

    try {
      const tokens = getStoredTokens();

      // If document is only in Cloudinary, upload it to Google Drive first
      if (!file.google_drive_id && file.cloudinary_url) {
        const { data: uploadData } = await api.post(
          "/documents/google/upload/",
          {
            documentId: documentId,
            tokens,
          }
        );

        toast.dismiss(loadingToast);

        if (uploadData.embedUrl || uploadData.webViewLink) {
          // Invalidate queries to refresh the file with new google_drive_id
          queryClient.invalidateQueries({ queryKey: ["folders"] });
          queryClient.invalidateQueries({ queryKey: ["folder-contents"] });
          window.open(uploadData.embedUrl || uploadData.webViewLink, "_blank");
        } else {
          toast.error("Unable to open document in Google Drive");
        }
        return;
      }

      // Document already in Google Drive - open it directly
      const { data } = await api.post("/documents/google/open/", {
        documentId: documentId,
        tokens,
      });

      toast.dismiss(loadingToast);

      if (data.editUrl || data.webViewLink) {
        if (data.isCopy) {
          toast.success(
            "A copy has been created in your folder. You can edit it freely!"
          );
          // Invalidate folder queries to show the new copy in the file list
          queryClient.invalidateQueries({ queryKey: ["folders"] });
          queryClient.invalidateQueries({ queryKey: ["documents"] });
        }
        window.open(data.editUrl || data.webViewLink, "_blank");
      } else {
        toast.error("Unable to open document in Google Drive");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error("Failed to open document:", error);
      const errorMsg = error.response?.data?.error || "Failed to open document";
      toast.error(errorMsg);
    } finally {
      setIsOpening(false);
    }
  };

  // Helper function to start OAuth in new tab
  const startOAuthInNewTab = async (documentId) => {
    // Open new tab IMMEDIATELY (before async call) to avoid popup blocker
    const newTab = window.open("about:blank", "_blank");

    if (!newTab) {
      toast.error("Could not open new tab. Please allow popups for this site.");
      return;
    }

    // Mark this as a new tab flow (not a popup)
    sessionStorage.setItem("google_auth_new_tab", "true");

    // Show loading message in new tab
    newTab.document.write(`
      <html>
        <head><title>Connecting to Google Drive...</title></head>
        <body style="display:flex;align-items:center;justify-content:center;height:100vh;margin:0;font-family:system-ui,sans-serif;background:#f5f5f5;">
          <div style="text-align:center;">
            <div style="border:3px solid #e5e5e5;border-top:3px solid #3b82f6;border-radius:50%;width:40px;height:40px;animation:spin 1s linear infinite;margin:0 auto 16px;"></div>
            <p style="color:#666;">Connecting to Google Drive...</p>
          </div>
          <style>@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}</style>
        </body>
      </html>
    `);

    toast.info("Connecting to Google Drive...");
    
    try {
      const redirectUri = `${window.location.origin}/google-callback`;
      const { data } = await api.get("/documents/google/auth/", {
        params: { redirect_uri: redirectUri, document_id: documentId },
      });

      // Navigate new tab to auth URL - the callback page will handle opening the document
      newTab.location.href = data.authUrl;

    } catch (error) {
      console.error("Failed to start auth:", error);
      newTab.close();
      toast.error("Failed to connect to Google Drive");
    }
  };

  const handleEdit = async () => {
    const extension = file.file_extension
      ? file.file_extension.toLowerCase()
      : "";

    // Handle different file types
    const googleEditableExtensions = [
      ".doc",
      ".docx",
      ".xls",
      ".xlsx",
      ".ppt",
      ".pptx",
    ];
    const imageExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".bmp",
      ".svg",
      ".webp",
    ];
    const viewableExtensions = [".pdf", ".txt", ".csv"];

    // Get the file URL (from file_url which returns Google Drive URL or Cloudinary URL)
    const fileUrl = file.file_url || file.cloudinary_url || file.file;

    // PDFs - Open in Google Drive viewer or browser
    if (extension === ".pdf") {
      setIsOpening(true);
      try {
        if (file.google_drive_id) {
          // Open PDF in Google Drive viewer
          window.open(
            `https://drive.google.com/file/d/${file.google_drive_id}/view`,
            "_blank"
          );
        } else if (fileUrl) {
          // Use Office Online Viewer for better PDF experience
          const encodedUrl = encodeURIComponent(fileUrl);
          window.open(
            `https://view.officeapps.live.com/op/view.aspx?src=${encodedUrl}`,
            "_blank"
          );
        } else {
          toast.error("Unable to open PDF");
        }
      } finally {
        setIsOpening(false);
      }
      return;
    }

    // Images - Open directly in browser
    if (imageExtensions.includes(extension)) {
      setIsOpening(true);
      try {
        if (file.google_drive_id) {
          // Open image from Google Drive
          window.open(
            `https://drive.google.com/file/d/${file.google_drive_id}/view`,
            "_blank"
          );
        } else if (fileUrl) {
          // Open Cloudinary/direct URL
          window.open(fileUrl, "_blank");
        } else {
          toast.error("Unable to open image");
        }
      } finally {
        setIsOpening(false);
      }
      return;
    }

    // Text/CSV files - Open in browser or Google Docs
    if ([".txt", ".csv"].includes(extension)) {
      setIsOpening(true);
      try {
        if (file.google_drive_id) {
          // Open in Google Drive viewer
          window.open(
            `https://drive.google.com/file/d/${file.google_drive_id}/view`,
            "_blank"
          );
        } else if (fileUrl) {
          // Open direct URL
          window.open(fileUrl, "_blank");
        } else {
          toast.error("Unable to open file");
        }
      } finally {
        setIsOpening(false);
      }
      return;
    }

    // Google editable files (Word, Excel, PowerPoint)
    if (!googleEditableExtensions.includes(extension)) {
      toast.error(
        "This file type cannot be opened in the editor. Use Download instead."
      );
      return;
    }

    // Check if user has Google tokens first
    if (!hasValidTokens()) {
      // Start Google OAuth flow in new tab
      await startOAuthInNewTab(file.id);
      return;
    }

    // User has tokens - open document directly
    await openDocumentAfterAuth(file.id);
  };

  const handleCopy = () => {
    // Use callback to set clipboard instead of directly copying
    if (onCopy) {
      onCopy(file, "copy");
      toast.info("File copied to clipboard", {
        richColors: true,
      });
    }
  };

  const handleCut = () => {
    // Use callback to set clipboard for cut action
    if (onCut) {
      onCut(file, "cut");
      toast.info("File cut to clipboard", {
        richColors: true,
        description: "File will be moved when pasted",
      });
    }
  };

  // Rename handlers
  const handleRenameStart = () => {
    setIsRenaming(true);
    setNewFileName(displayName);
  };

  const handleRenameConfirm = () => {
    if (newFileName.trim() && newFileName !== displayName) {
      setDisplayName(newFileName.trim());
      renameMutation.mutate({
        fileId: file.id,
        newTitle: newFileName.trim(),
      });
    }
    setIsRenaming(false);
  };

  const handleRenameCancel = () => {
    setIsRenaming(false);
    setNewFileName(displayName);
  };

  // Delete handlers
  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    deleteMutation.mutate(file.id);
    setShowDeleteModal(false);
  };

  // Utility functions
  const formatFileSize = (bytes) => {
    if (!bytes) return "Unknown size";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(2)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(2)} MB`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getFileExtension = () => {
    if (file.file_extension) {
      return file.file_extension;
    }
    const parts = file.title.split(".");
    return parts.length > 1 ? parts.pop().toUpperCase() : "FILE";
  };

  const getFileIcon = () => {
    const extension = file.file_extension
      ? file.file_extension.toLowerCase()
      : "";

    const imageExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".bmp",
      ".svg",
      ".webp",
    ];
    if (imageExtensions.includes(extension)) {
      return { type: "image", src: img };
    }

    const iconMap = {
      ".pdf": pdf,
      ".doc": docx,
      ".docx": docx,
      ".xls": xlsx,
      ".xlsx": xlsx,
      ".ppt": pptx,
      ".pptx": pptx,
      ".txt": txt,
      ".csv": csv,
    };

    return { type: "icon", src: iconMap[extension] || defaultFile };
  };

  const isEditable = () => {
    const extension = file.file_extension
      ? file.file_extension.toLowerCase()
      : "";
    // Word, Excel, and PowerPoint files can be opened in Google editors
    return [".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx"].includes(
      extension
    );
  };

  // Check if file can be opened/viewed in browser (PDFs, images, text files)
  const isViewable = () => {
    const extension = file.file_extension
      ? file.file_extension.toLowerCase()
      : "";
    const viewableExtensions = [
      ".pdf",
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".bmp",
      ".svg",
      ".webp",
      ".txt",
      ".csv",
    ];
    return viewableExtensions.includes(extension);
  };

  // Get the appropriate action label for the file
  const getOpenActionLabel = () => {
    const extension = file.file_extension
      ? file.file_extension.toLowerCase()
      : "";
    if (
      [".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx"].includes(extension)
    ) {
      return "Open in Editor";
    } else if ([".pdf"].includes(extension)) {
      return "View PDF";
    } else if (
      [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg", ".webp"].includes(
        extension
      )
    ) {
      return "View Image";
    } else if ([".txt", ".csv"].includes(extension)) {
      return "View File";
    }
    return "Open";
  };

  return {
    // State
    contextMenuOpen,
    setContextMenuOpen,
    isRenaming,
    newFileName,
    setNewFileName,
    displayName,
    showDeleteModal,
    setShowDeleteModal,
    isOpening,
    inputRef,

    // Permissions
    canEdit,
    canDelete,
    canCopy,

    // Touch handlers
    handleTouchStart,
    handleTouchEnd,
    handleTouchMove,

    // File operations
    handleDownload,
    handleEdit,
    handleCopy,
    handleCut,

    // Rename handlers
    handleRenameStart,
    handleRenameConfirm,
    handleRenameCancel,

    // Delete handlers
    handleDeleteClick,
    confirmDelete,

    // Utility functions
    formatFileSize,
    formatDate,
    getFileExtension,
    getFileIcon,
    isEditable,
    isViewable,
    getOpenActionLabel,

    // Mutations
    deleteMutation,
  };
};
