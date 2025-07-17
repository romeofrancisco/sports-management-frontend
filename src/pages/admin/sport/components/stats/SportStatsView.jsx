import React, { useState } from "react";
import SportStatsTable from "./SportStatsTable";
import SportStatsCardView from "./SportStatsCardView";
import SportStatsFilterBar from "./SportStatsFilterBar";
import StatsOverview from "./StatsOverview";
import { Card } from "@/components/ui/card";
import {
  LayoutGrid,
  Table2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSportStats } from "@/hooks/useStats";
import { useParams } from "react-router";

const SportStatsView = () => {
  const { sport } = useParams();
  const [viewMode, setViewMode] = useState("cards"); // Default to cards as it's more user-friendly
  const [statFilter, setStatFilter] = useState({
    search: "",
    category: "all",
    type: "all",
  });

  // Get stats data with the filter - now using backend filtering
  const { data: stats } = useSportStats(sport, {
    search: statFilter.search || undefined,
    category: statFilter.category !== "all" ? statFilter.category : undefined,
    type: statFilter.type !== "all" ? statFilter.type : undefined,
  });

  // No need for frontend filtering since backend handles it
  const filteredStats = stats || [];

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <h2 className="text-xl sm:text-2xl font-bold">Statistics</h2>
          <Badge variant="outline" className="bg-primary/10 text-primary w-fit">
            {filteredStats.length} stats
          </Badge>
        </div>

        {/* View Toggle - More compact on mobile */}
        <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg w-fit">
          <Button
            variant={viewMode === "cards" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("cards")}
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3"
          >
            <LayoutGrid className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Cards</span>
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("table")}
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3"
          >
            <Table2 className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Table</span>
          </Button>
        </div>
      </div>

      {/* Stats Overview Section - Responsive spacing */}
      <StatsOverview />

      {/* Filter Section - Improved responsiveness */}
      <Card className="p-3 sm:p-4 lg:p-6 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
        <SportStatsFilterBar filter={statFilter} setFilter={setStatFilter} />
      </Card>

      {/* Content Section - Better mobile spacing */}
      <div className="bg-background">
        {viewMode === "table" ? (
          <SportStatsTable filter={statFilter} />
        ) : (
          <SportStatsCardView
            stats={filteredStats}
            filter={statFilter}
          />
        )}
      </div>
    </div>
  );
};

export default SportStatsView;
