import React from "react";
import { Check } from "lucide-react";

const ProgressLegend = () => {
  return (
    <div className="flex items-center justify-center gap-3 sm:gap-6 flex-wrap">
      <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
        <div className="relative">
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-primary rounded-full border-2 border-primary"></div>
        </div>
        <span className="text-foreground font-medium">Current</span>
      </div>
      <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
        <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-green-500 flex items-center justify-center">
          <Check className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white" />
        </div>
        <span className="text-foreground font-medium">Completed</span>
      </div>
      <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
        <div className="w-3 h-3 sm:w-4 sm:h-4 bg-muted rounded-full border-2 border-muted"></div>
        <span className="text-foreground font-medium">Pending</span>
      </div>
    </div>
  );
};

export default ProgressLegend;
