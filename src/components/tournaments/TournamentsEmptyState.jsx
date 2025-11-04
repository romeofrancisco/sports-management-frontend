import React from "react";
import { Trophy } from "lucide-react";

const TournamentsEmptyState = ({ searchTerm }) => {
  return (
    <div className="text-center py-16 relative">
      {/* Enhanced background effects for empty state */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 rounded-lg opacity-50"></div>
      <div className="relative">
        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mb-6 shadow-lg border-2 border-primary/20">
          <Trophy className="h-10 w-10 text-primary" />
        </div>
        <p className="text-foreground font-bold text-lg mb-2">
          {searchTerm ? "No tournaments found" : "No tournaments found"}
        </p>
        <p className="text-muted-foreground font-medium max-w-sm mx-auto">
          {searchTerm
            ? "Try adjusting your search terms to find tournaments"
            : "Create your first tournament to get started with tournament management"}
        </p>
      </div>
    </div>
  );
};

export default TournamentsEmptyState;
