import React from "react";
import { Search, Grid3X3, LayoutGrid } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const LeaguesHeader = ({ 
  filteredCount, 
  viewMode, 
  setViewMode, 
  searchTerm, 
  setSearchTerm 
}) => {
  return (
    <>
      {/* Enhanced Header with View Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-foreground">Leagues</h2>
          <div className="px-2 py-2 bg-primary/10 rounded-full flex">
            <span className="text-xs font-medium text-primary">
              {filteredCount} leagues
            </span>
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
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search leagues..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-background/50 border-primary/20 focus:border-primary/40 transition-all duration-300"
          />
        </div>
      </div>

      <Separator className="max-h-[0.5px] mb-6 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </>
  );
};

export default LeaguesHeader;
