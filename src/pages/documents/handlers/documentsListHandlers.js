/**
 * Handle navigation from breadcrumb
 * @param {number} index - Index in navigation stack
 * @param {Function} setSearchQuery - Function to set search query
 * @param {Function} handleBreadcrumbClick - Function to handle breadcrumb click
 */
export const handleBreadcrumbNavigation = (index, setSearchQuery, handleBreadcrumbClick) => {
  setSearchQuery("");
  handleBreadcrumbClick(index);
};

/**
 * Handle folder click from search results
 * @param {Object} folder - Folder object
 * @param {Function} setSearchQuery - Function to set search query
 * @param {Function} setNavigationPath - Function to set navigation path
 * @param {Function} navigateToFolder - Function to navigate to folder
 */
export const handleSearchFolderClick = (folder, setSearchQuery, setNavigationPath, navigateToFolder) => {
  setSearchQuery("");

  if (folder.location) {
    const pathParts = folder.location.split(" > ");
    const pathFolders = pathParts.map((name, index) => {
      if (index === pathParts.length - 1) {
        return folder;
      }
      return {
        id: `breadcrumb-${index}-${name}`,
        name: name,
      };
    });
    setNavigationPath(pathFolders);
  } else {
    navigateToFolder(folder);
  }
};

/**
 * Handle paste operation (copy or move)
 * @param {Object} params - Parameters object
 */
export const handlePaste = ({
  clipboardFile,
  clipboardAction,
  currentFolder,
  rootData,
  moveMutation,
  copyMutation,
  setClipboardFile,
  setClipboardAction,
}) => {
  if (!clipboardFile) return;

  if (clipboardAction === 'cut') {
    // Move the file
    let targetFolderId = null;
    
    if (currentFolder) {
      targetFolderId = currentFolder.id;
    } else if (rootData) {
      targetFolderId = null;
    }
    
    moveMutation.mutate(
      {
        fileId: clipboardFile.id,
        targetFolderId: targetFolderId,
      },
      {
        onSuccess: () => {
          setClipboardFile(null);
          setClipboardAction(null);
        },
      }
    );
  } else {
    // Copy the file
    copyMutation.mutate(
      {
        fileId: clipboardFile.id,
        currentFolder,
        rootData,
      },
      {
        onSuccess: () => {
          setClipboardFile(null);
          setClipboardAction(null);
        },
      }
    );
  }
};

/**
 * Handle file card drag start
 * @param {Object} file - File object
 * @param {Function} setDraggedFileCard - Function to set dragged file card
 */
export const handleFileCardDragStart = (file, setDraggedFileCard) => {
  setDraggedFileCard(file);
};

/**
 * Handle file card drag end
 * @param {Function} setDraggedFileCard - Function to set dragged file card
 */
export const handleFileCardDragEnd = (setDraggedFileCard) => {
  setDraggedFileCard(null);
};

/**
 * Handle file drop on folder
 * @param {Object} fileData - File data object
 * @param {Object} targetFolder - Target folder object
 * @param {Object} moveMutation - Move mutation object
 */
export const handleFileDrop = (fileData, targetFolder, moveMutation) => {
  if (!fileData || !fileData.fileId) return;
  
  moveMutation.mutate({
    fileId: fileData.fileId,
    targetFolderId: targetFolder.id,
  });
};

/**
 * Handle drag over event for file upload
 * @param {Event} e - Drag event
 * @param {boolean} isDraggingOver - Current dragging state
 * @param {Function} setIsDraggingOver - Function to set dragging state
 */
export const handleDragOver = (e, isDraggingOver, setIsDraggingOver) => {
  // Check if we're dragging a file card (internal) or files from outside
  const isFileCard = e.dataTransfer.types.includes("application/x-file-card");
  
  if (isFileCard) return;
  
  // Check if we're dragging actual files
  const hasFiles = Array.from(e.dataTransfer.items || []).some(
    item => item.kind === 'file'
  );
  
  if (!hasFiles) return;
  
  e.preventDefault();
  e.stopPropagation();
  e.dataTransfer.dropEffect = "copy";
  
  if (!isDraggingOver) {
    setIsDraggingOver(true);
  }
};

/**
 * Handle drag enter event for file upload
 * @param {Event} e - Drag event
 * @param {Function} setIsDraggingOver - Function to set dragging state
 */
export const handleDragEnter = (e, setIsDraggingOver) => {
  // Check if we're dragging a file card (internal)
  const isFileCard = e.dataTransfer.types.includes("application/x-file-card");
  
  if (isFileCard) return;
  
  // Check if we're dragging actual files
  const hasFiles = Array.from(e.dataTransfer.items || []).some(
    item => item.kind === 'file'
  );
  
  if (!hasFiles) return;
  
  e.preventDefault();
  e.stopPropagation();
  setIsDraggingOver(true);
};

/**
 * Handle drag leave event for file upload
 * @param {Event} e - Drag event
 * @param {boolean} isDraggingOver - Current dragging state
 * @param {Function} setIsDraggingOver - Function to set dragging state
 */
export const handleDragLeave = (e, isDraggingOver, setIsDraggingOver) => {
  e.preventDefault();
  e.stopPropagation();
  
  if (!isDraggingOver) return;
  
  // Only set to false if we're leaving the CardContent area
  const rect = e.currentTarget.getBoundingClientRect();
  const x = e.clientX;
  const y = e.clientY;

  if (
    x <= rect.left ||
    x >= rect.right ||
    y <= rect.top ||
    y >= rect.bottom
  ) {
    setIsDraggingOver(false);
  }
};

/**
 * Handle drop event for file upload
 * @param {Event} e - Drop event
 * @param {Function} setIsDraggingOver - Function to set dragging state
 * @param {Function} setDraggedFiles - Function to set dragged files
 * @param {Function} setIsMultipleUploadOpen - Function to open upload dialog
 */
export const handleDrop = (e, setIsDraggingOver, setDraggedFiles, setIsMultipleUploadOpen) => {
  e.preventDefault();
  e.stopPropagation();
  setIsDraggingOver(false);

  // Only handle if it's files from outside (not internal drag)
  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
    const files = Array.from(e.dataTransfer.files);
    setDraggedFiles(files);
    setIsMultipleUploadOpen(true);
  }
};

/**
 * Handle long press start for touch devices
 * @param {Object} longPressTimerRef - Ref to store timer
 * @param {Function} setContextMenuOpen - Function to open context menu
 */
export const handleTouchStart = (longPressTimerRef, setContextMenuOpen) => {
  longPressTimerRef.current = setTimeout(() => {
    setContextMenuOpen(true);
  }, 500);
};

/**
 * Handle touch end event
 * @param {Object} longPressTimerRef - Ref to store timer
 */
export const handleTouchEnd = (longPressTimerRef) => {
  if (longPressTimerRef.current) {
    clearTimeout(longPressTimerRef.current);
  }
};

/**
 * Handle touch move event
 * @param {Object} longPressTimerRef - Ref to store timer
 */
export const handleTouchMove = (longPressTimerRef) => {
  if (longPressTimerRef.current) {
    clearTimeout(longPressTimerRef.current);
  }
};
