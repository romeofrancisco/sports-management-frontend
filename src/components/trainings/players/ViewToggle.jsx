import React from "react";
import { Button } from "@/components/ui/button";
import { LineChart, BarChart } from "lucide-react";

const ViewToggle = ({ activeView, onViewChange }) => {
  return (
    <div className="flex gap-1 sm:gap-2 w-full sm:w-auto">
      <Button
        variant={activeView === "individual" ? "default" : "outline"}
        size="sm"
        className="flex-1 sm:flex-initial shadow-sm text-xs sm:text-sm px-2 sm:px-3 py-2"
        onClick={() => onViewChange("individual")}
      >
        <LineChart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
        <span className="hidden xs:inline">Individual</span>
        <span className="xs:hidden">Single</span>
      </Button>
      <Button
        variant={activeView === "compare" ? "default" : "outline"}
        size="sm"
        className="flex-1 sm:flex-initial shadow-sm text-xs sm:text-sm px-2 sm:px-3 py-2"
        onClick={() => onViewChange("compare")}
      >
        <BarChart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
        <span className="hidden xs:inline">Compare</span>
        <span className="xs:hidden">Multi</span>
      </Button>
    </div>
  );
};

export default ViewToggle;
