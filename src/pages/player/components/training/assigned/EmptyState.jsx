import React from "react";
import { Target } from "lucide-react";

const EmptyState = ({ statusFilter }) => {
  return (
    <div className="text-center py-16">
      <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mb-6 shadow-lg border-2 border-primary/20">
        <Target className="h-10 w-10 text-primary" />
      </div>
      <p className="text-foreground font-bold text-lg mb-2">
        {statusFilter === "assigned" 
          ? "No new training assignments" 
          : "No assigned metrics found"}
      </p>
      <p className="text-muted-foreground font-medium max-w-sm mx-auto">
        {statusFilter === "assigned" 
          ? "You don't have any new training metrics assigned. Check back later or contact your coach."
          : "No training sessions with assigned metrics found. Try adjusting your filters."}
      </p>
    </div>
  );
};

export default EmptyState;
