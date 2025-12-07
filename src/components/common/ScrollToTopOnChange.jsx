import { useEffect } from "react";

export const useScrollToTopOnChange = (dependency, position = 0) => {
  useEffect(() => {
    // Use setTimeout to ensure DOM has updated
    setTimeout(() => {
      window.scrollTo({
        top: position,
        left: 0,
        behavior: 'smooth'
      });
    }, 0);
  }, [dependency]);
};

// Component version (deprecated - use the hook instead)
export const ScrollToTopOnChange = (dependency) => {
  useScrollToTopOnChange(dependency);
  return null;
}