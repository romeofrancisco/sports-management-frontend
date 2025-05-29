import React from "react";

const LoadingState = () => {
  return (
    <div className="space-y-4">
      <div className="h-8 bg-muted animate-pulse rounded"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-32 bg-muted animate-pulse rounded-lg"
          ></div>
        ))}
      </div>
    </div>
  );
};

export default LoadingState;
