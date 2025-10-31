import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export const useDocumentNavigation = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [navigationStack, setNavigationStack] = useState([]);

  // Get folder ID from URL params
  const folderIdFromUrl = searchParams.get("folder");

  const currentFolder = navigationStack[navigationStack.length - 1];
  const isRoot = !currentFolder;

  const updateUrl = (stack) => {
    if (stack.length === 0) {
      // At root, remove folder param
      searchParams.delete("folder");
    } else {
      // Set current folder ID
      const currentFolderId = stack[stack.length - 1]?.id;
      if (currentFolderId) {
        searchParams.set("folder", currentFolderId);
      }
    }
    setSearchParams(searchParams, { replace: true });
  };

  const handleFolderClick = (folder) => {
    const newStack = [...navigationStack, folder];
    setNavigationStack(newStack);
    updateUrl(newStack);
  };

  const handleBreadcrumbClick = (index) => {
    let newStack;
    if (index === -1) {
      // Go to root
      newStack = [];
    } else {
      // Go to specific folder in path
      newStack = navigationStack.slice(0, index + 1);
    }
    setNavigationStack(newStack);
    updateUrl(newStack);
  };

  const navigateToFolder = (folder) => {
    // Navigate directly to a folder, resetting the navigation stack
    const newStack = [folder];
    setNavigationStack(newStack);
    updateUrl(newStack);
  };

  const setNavigationPath = (path) => {
    // Set the entire navigation path (for search results with location info)
    setNavigationStack(path);
    updateUrl(path);
  };

  return {
    navigationStack,
    currentFolder,
    isRoot,
    handleFolderClick,
    handleBreadcrumbClick,
    navigateToFolder,
    setNavigationPath,
    folderIdFromUrl,
  };
};
