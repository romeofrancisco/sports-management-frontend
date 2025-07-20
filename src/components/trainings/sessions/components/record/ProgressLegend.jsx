import React from "react";
import { Check } from "lucide-react";

const ProgressLegend = () => {
  return (
    <div className="flex items-center justify-center gap-6">
      <div className="flex items-center gap-2 text-sm">
        <div className="relative">
          <div className="w-4 h-4 bg-primary rounded-full border-2 border-primary"></div>
        </div>
        <span className="text-foreground font-medium">Current</span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-green-500 flex items-center justify-center">
          <Check className="w-2.5 h-2.5 text-white" />
        </div>
        <span className="text-foreground font-medium">Completed</span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <div className="w-4 h-4 bg-muted rounded-full border-2 border-muted"></div>
        <span className="text-foreground font-medium">Pending</span>
      </div>
    </div>
  );
};

export default ProgressLegend;
