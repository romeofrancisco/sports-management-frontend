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

  return {
    navigationStack,
    currentFolder,
    isRoot,
    handleFolderClick,
    handleBreadcrumbClick,
  };
};
