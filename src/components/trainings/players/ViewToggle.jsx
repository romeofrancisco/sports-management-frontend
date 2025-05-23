import React from "react";
import { Button } from "@/components/ui/button";
import { LineChart, BarChart } from "lucide-react";

const ViewToggle = ({ activeView, onViewChange }) => {
  return (
    <div className="flex gap-2">
      <Button
        variant={activeView === "individual" ? "default" : "outline"}
        size="sm"
        className="shadow-sm"
        onClick={() => onViewChange("individual")}
      >
        <LineChart className="h-4 w-4 mr-2" />
        Individual
      </Button>
      <Button
        variant={activeView === "compare" ? "default" : "outline"}
        size="sm"
        className="shadow-sm"
        onClick={() => onViewChange("compare")}
      >
        <BarChart className="h-4 w-4 mr-2" />
        Compare
      </Button>
    </div>
  );
};

export default ViewToggle;
