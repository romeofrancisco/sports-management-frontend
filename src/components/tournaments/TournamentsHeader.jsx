import React from "react";
import { Search, Grid3X3, LayoutGrid, Trophy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRolePermissions } from "@/hooks/useRolePermissions";

const TournamentsHeader = ({
  filteredCount,
  viewMode,
  setViewMode,
  searchTerm,
  setSearchTerm,
}) => {
  const { isAdmin } = useRolePermissions();

  return (
    <>
      {/* Enhanced Header with View Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-3 rounded-xl">
            <Trophy className="size-7 text-primary-foreground" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-foreground">Tournaments</h2>
              <Badge className="h-6 text-[11px]">{filteredCount} tournaments</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {isAdmin()
                ? "Create and manage sports tournaments"
                : "Browse and explore available sports tournaments"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "cards" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("cards")}
            className="flex items-center gap-2"
          >
            <LayoutGrid className="h-4 w-4" />
            Cards
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="flex items-center gap-2"
          >
            <Grid3X3 className="h-4 w-4" />
            List
          </Button>
        </div>
      </div>

      {/* Search Filter */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tournaments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-background/50 border-primary/20 focus:border-primary/40 transition-all duration-300"
        />
      </div>
    </>
  );
};

export default TournamentsHeader;
