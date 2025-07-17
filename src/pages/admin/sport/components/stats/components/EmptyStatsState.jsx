import React from "react";
import { BarChart2, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const EmptyStatsState = ({ getActiveFiltersCount, onCreateStat }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 lg:p-16 text-center bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl border-2 border-dashed border-muted-foreground/20 min-h-[300px] sm:min-h-[400px]">
      <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-primary/10 rounded-full">
        <BarChart2 className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-primary" />
      </div>
      <h3 className="text-xl sm:text-2xl font-bold mb-2 text-foreground">
        No Statistics Found
      </h3>
      <p className="text-muted-foreground mb-4 sm:mb-6 max-w-md leading-relaxed text-sm sm:text-base">
        {getActiveFiltersCount() > 0
          ? "No statistics match your current filters. Try adjusting your search criteria to discover more stats."
          : "Get started by creating your first statistic to track player and team performance metrics."}
      </p>
      <Button
        onClick={onCreateStat}
        size="lg"
        className="bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base"
      >
        <PlusCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
        Create Your First Statistic
      </Button>
    </div>
  );
};

export default EmptyStatsState;
