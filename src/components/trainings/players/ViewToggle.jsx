import React from "react";
import { Button } from "@/components/ui/button";
import { User, Users } from "lucide-react";

const ViewToggle = ({ activeView, onViewChange }) => {
  return (
    <div className="inline-flex gap-0.5 sm:gap-1 p-0.5 sm:p-1 bg-background/90 backdrop-blur-sm rounded-lg border border-primary/20 shadow-sm">
      <Button
        variant={activeView === "individual" ? "default" : "ghost"}
        size="sm"
        className={`
          relative transition-all duration-200 px-2 py-1.5 sm:px-3 sm:py-2 rounded-md font-medium text-xs sm:text-sm 
          flex items-center gap-1 sm:gap-2 min-w-[70px] sm:min-w-[100px] justify-center whitespace-nowrap
          ${
            activeView === "individual"
              ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-sm hover:shadow-md"
              : "hover:bg-primary/10 text-muted-foreground hover:text-primary"
          }
        `}
        onClick={() => onViewChange("individual")}
      >
        <User className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
        <span className="hidden sm:inline">Individual</span>
        <span className="inline sm:hidden">Ind.</span>
      </Button>
      <Button
        variant={activeView === "compare" ? "default" : "ghost"}
        size="sm"
        className={`
          relative transition-all duration-200 px-2 py-1.5 sm:px-3 sm:py-2 rounded-md font-medium text-xs sm:text-sm 
          flex items-center gap-1 sm:gap-2 min-w-[70px] sm:min-w-[100px] justify-center whitespace-nowrap
          ${
            activeView === "compare"
              ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-sm hover:shadow-md"
              : "hover:bg-primary/10 text-muted-foreground hover:text-primary"
          }
        `}
        onClick={() => onViewChange("compare")}
      >
        <Users className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
        <span className="hidden sm:inline">Teams</span>
        <span className="inline sm:hidden">Tm.</span>
      </Button>
    </div>
  );
};

export default ViewToggle;
