import { useState } from "react";

export const useDocumentNavigation = () => {
  const [navigationStack, setNavigationStack] = useState([]);

  const currentFolder = navigationStack[navigationStack.length - 1];
  const isRoot = !currentFolder;

  const handleFolderClick = (folder) => {
    setNavigationStack([...navigationStack, folder]);
  };

  const handleBreadcrumbClick = (index) => {
    if (index === -1) {
      // Go to root
      setNavigationStack([]);
    } else {
      // Go to specific folder in path
      setNavigationStack(navigationStack.slice(0, index + 1));
    }
  };

  const navigateToFolder = (folder) => {
    // Navigate directly to a folder, resetting the navigation stack
    setNavigationStack([folder]);
  };

  const setNavigationPath = (path) => {
    // Set the entire navigation path (for search results with location info)
    setNavigationStack(path);
  };

  return {
    navigationStack,
    currentFolder,
    isRoot,
    handleFolderClick,
    handleBreadcrumbClick,
    navigateToFolder,
    setNavigationPath,
  };
};
