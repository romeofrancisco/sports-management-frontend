import React from "react";
import { Grid3X3, List, Plus, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRolePermissions } from "@/hooks/useRolePermissions";

const SeasonsHeader = ({
  viewMode,
  setViewMode,
  compact,
  isAdmin,
  onCreateSeason,
}) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110">
          <Calendar className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gradient">
            Seasons
          </h1>
          <p className="text-sm text-muted-foreground">
            {isAdmin()
              ? "Season history and management"
              : "Season history and information"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {!compact && (
          <div className="flex items-center bg-gradient-to-r from-primary/5 to-secondary/5 border-2 border-primary/20 rounded-lg p-1 shadow-sm">
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
              className={`h-8 px-3 transition-all duration-200 ${
                viewMode === "table"
                  ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-md"
                  : "hover:bg-primary/10 text-muted-foreground hover:text-primary"
              }`}
            >
              <List size={16} />
            </Button>
            <Button
              variant={viewMode === "cards" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("cards")}
              className={`h-8 px-3 transition-all duration-200 ${
                viewMode === "cards"
                  ? "bg-gradient-to-r from-secondary to-secondary/90 text-secondary-foreground shadow-md"
                  : "hover:bg-secondary/10 text-muted-foreground hover:text-secondary"
              }`}
            >
              <Grid3X3 size={16} />
            </Button>
          </div>
        )}

        {isAdmin() && (
          <Button
            onClick={onCreateSeason}
            className="gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            size="sm"
          >
            <Plus size={16} />
            New Season
          </Button>
        )}
      </div>
    </div>
  );
};

export default SeasonsHeader;
