import React from "react";

const SeasonCardSkeleton = ({ pageSize }) => {
  return (
    <>
      {Array.from({ length: pageSize }).map((_, index) => (
        <div
          key={index}
          className="relative bg-gradient-to-br from-card via-card to-card/95 border-2 border-primary/10 rounded-xl p-6 shadow-lg animate-pulse overflow-hidden"
        >
          {/* Background decorative elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-xl opacity-30"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-secondary/5 to-transparent rounded-full blur-lg opacity-25"></div>

          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2 flex-1">
                <div className="p-1.5 rounded-lg bg-primary/20 animate-pulse">
                  <div className="h-4 w-4 bg-primary/30 rounded"></div>
                </div>
                <div className="space-y-2 flex-1">
                  <div className="h-5 bg-gradient-to-r from-primary/20 to-secondary/20 rounded w-2/3"></div>
                  <div className="h-4 bg-muted rounded w-1/3"></div>
                </div>
              </div>
              <div className="h-8 w-8 bg-muted rounded"></div>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg">
                <div className="h-4 bg-muted rounded"></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gradient-to-br from-primary/5 to-transparent rounded-lg">
                  <div className="h-3 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </div>
                <div className="p-3 bg-gradient-to-br from-secondary/5 to-transparent rounded-lg">
                  <div className="h-3 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default SeasonCardSkeleton;
