import React from "react";

const FullPageLoading = ({ message = "Loading...", isVisible = true }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/10 backdrop-blur-sm flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
};

export default FullPageLoading;
