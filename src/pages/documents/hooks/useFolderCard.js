import { useState, useRef, useEffect } from "react";
import { useRenameFolder, useDeleteFolder } from "@/hooks/useDocuments";
import { useRolePermissions } from "@/hooks/useRolePermissions";

export const useFolderCard = (folder) => {
  const { permissions } = useRolePermissions();
  const renameMutation = useRenameFolder();
  const deleteMutation = useDeleteFolder();

  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newFolderName, setNewFolderName] = useState(folder.name);
  const [displayName, setDisplayName] = useState(folder.name);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const inputRef = useRef(null);
  const longPressTimerRef = useRef(null);

  const canEdit = permissions.documents.canDelete({ owner: folder.owner });
  const canDelete = permissions.documents.canDelete({ owner: folder.owner });

  // Update displayName when folder.name changes
  useEffect(() => {
    setDisplayName(folder.name);
    setNewFolderName(folder.name);
  }, [folder.name]);

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

  // Rename handlers
  const handleRenameStart = () => {
    setIsRenaming(true);
    setNewFolderName(displayName);
  };

  const handleRenameConfirm = () => {
    if (newFolderName.trim() && newFolderName !== displayName) {
      setDisplayName(newFolderName.trim());
      renameMutation.mutate({
        folderId: folder.id,
        newName: newFolderName.trim(),
      });
    }
    setIsRenaming(false);
  };

  const handleRenameCancel = () => {
    setIsRenaming(false);
    setNewFolderName(displayName);
  };

  // Delete handlers
  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    deleteMutation.mutate(folder.id);
    setShowDeleteModal(false);
  };

  return {
    // State
    contextMenuOpen,
    setContextMenuOpen,
    isRenaming,
    newFolderName,
    setNewFolderName,
    displayName,
    showDeleteModal,
    setShowDeleteModal,
    inputRef,
    
    // Permissions
    canEdit,
    canDelete,
    
    // Touch handlers
    handleTouchStart,
    handleTouchEnd,
    handleTouchMove,
    
    // Rename handlers
    handleRenameStart,
    handleRenameConfirm,
    handleRenameCancel,
    
    // Delete handlers
    handleDeleteClick,
    confirmDelete,
    
    // Mutations
    deleteMutation,
  };
};
