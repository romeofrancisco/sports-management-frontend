import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDownloadFile, useCopyFile, useRenameFile, useDeleteFile } from "@/hooks/useDocuments";
import { useRolePermissions } from "@/hooks/useRolePermissions";
import { toast } from "sonner";
import docx from "@/assets/documents/docx.png";
import pdf from "@/assets/documents/pdf.png";
import pptx from "@/assets/documents/pptx.png";
import xlsx from "@/assets/documents/xlsx.png";
import txt from "@/assets/documents/txt.png";
import csv from "@/assets/documents/csv.png";
import defaultFile from "@/assets/documents/default.png";

export const useFileCard = (file, currentFolder, rootData, onCopy, onCut) => {
  const navigate = useNavigate();
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

  const handleEdit = () => {
    // Check if file is editable (docx, doc files)
    const extension = file.file_extension ? file.file_extension.toLowerCase() : "";
    const editableExtensions = ['doc', 'docx'];
    
    if (!editableExtensions.includes(extension)) {
      toast.error("Only Word documents (.doc, .docx) can be edited in the editor");
      return;
    }
    
    // Navigate to document editor
    navigate(`/documents/editor/${file.id}`);
  };

  const handleCopy = () => {
    // Use callback to set clipboard instead of directly copying
    if (onCopy) {
      onCopy(file, 'copy');
      toast.info("File copied to clipboard", {
        richColors: true,
      });
    }
  };

  const handleCut = () => {
    // Use callback to set clipboard for cut action
    if (onCut) {
      onCut(file, 'cut');
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
    const extension = file.file_extension ? file.file_extension.toLowerCase() : "";
    
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'];
    if (imageExtensions.includes(extension)) {
      return { type: 'image', src: file.file };
    }
    
    const iconMap = {
      'pdf': pdf,
      'doc': docx,
      'docx': docx,
      'xls': xlsx,
      'xlsx': xlsx,
      'ppt': pptx,
      'pptx': pptx,
      'txt': txt,
      'csv': csv,
    };

    return { type: 'icon', src: iconMap[extension] || defaultFile };
  };

  const isEditable = () => {
    const extension = file.file_extension ? file.file_extension.toLowerCase() : "";

    return ['doc', 'docx'].includes(extension);
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
    
    // Mutations
    deleteMutation,
  };
};
