import React from "react";

const RequireRotation = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-background p-4">
      <div className="text-center space-y-4">
        <div className="text-6xl">📱</div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Rotate Your Device</h2>
          <p className="text-muted-foreground max-w-sm">
            Please rotate your device to landscape mode for the best scoreboard experience.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RequireRotation;