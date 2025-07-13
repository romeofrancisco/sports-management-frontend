import React from "react";
import { Eye, Filter, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const CardViewHeader = ({ stats, getActiveFiltersCount, onCreateStat }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          <h3 className="font-semibold text-lg sm:text-xl text-foreground">Card View</h3>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-primary/10 text-primary font-semibold px-2 py-1 text-xs sm:text-sm">
            {stats.length} {stats.length === 1 ? 'stat' : 'stats'}
          </Badge>
          {getActiveFiltersCount() > 0 && (
            <Badge
              variant="secondary"
              className="flex items-center gap-1.5 bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/50 dark:text-amber-300 dark:border-amber-800 text-xs sm:text-sm"
            >
              <Filter className="h-3 w-3" />
              {getActiveFiltersCount()} filter{getActiveFiltersCount() !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>
      </div>

      <Button
        onClick={onCreateStat}
        size="sm"
        className="bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-3 sm:px-4 py-2 text-xs sm:text-sm w-full sm:w-auto"
      >
        <PlusCircle className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
        Create New Stat
      </Button>
    </div>
  );
};

export default CardViewHeader;
