import React, { useState } from "react";
import SportDetailsHeader from "./components/SportDetailsHeader";
import SportStatsTable from "./components/SportStatsTable";
import SportFormulaTable from "./components/SportFormulaTable";
import SportPositionsTable from "./components/SportPositionsTable";
import LeaderCategoriesTable from "./components/LeaderCategoriesTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import {
  Search,
  SlidersHorizontal,
  CheckCircle,
  Calculator,
  Users,
  X,
  Filter,
  ListFilter,
  LayoutGrid,
  Table2,
  ChevronDown,
  Trophy
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSportStats } from "@/hooks/useStats";
import { useParams } from "react-router";
import SportStatsCardView from "./components/SportStatsCardView";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Sport = () => {
  const { sport } = useParams();
  const [activeTab, setActiveTab] = useState("stats");
  const [viewMode, setViewMode] = useState("table");
  const [statFilter, setStatFilter] = useState({
    search: "",
    category: "all",
    type: "all",
  });
  const [filterVisible, setFilterVisible] = useState(true);

  // Get stats data with the filter
  const { data: stats } = useSportStats(sport, {});

  const recordingStats = stats?.filter((stat) => stat.is_record) || [];
  const formulaStats = stats?.filter((stat) => !stat.is_record) || [];

  const filteredStats =
    stats?.filter((stat) => {
      // Search filter
      const matchesSearch =
        !statFilter.search ||
        stat.name.toLowerCase().includes(statFilter.search.toLowerCase()) ||
        stat.code.toLowerCase().includes(statFilter.search.toLowerCase()) ||
        (stat.display_name &&
          stat.display_name
            .toLowerCase()
            .includes(statFilter.search.toLowerCase()));

      // Category filter
      const matchesCategory =
        statFilter.category === "all" ||
        (statFilter.category === "scoring" &&
          (stat.point_value > 0 || stat.code.includes("PT"))) ||
        (statFilter.category === "performance" &&
          (stat.name.includes("%") || stat.code.includes("PCT"))) ||
        (statFilter.category === "counting" &&
          stat.is_points &&
          !stat.name.includes("%")) ||
        (statFilter.category === "negative" && stat.is_negative);

      // Type filter
      const matchesType =
        statFilter.type === "all" ||
        (statFilter.type === "recording" && stat.is_record) ||
        (statFilter.type === "calculated" && !stat.is_record) ||
        (statFilter.type === "boxscore" && stat.is_boxscore) ||
        (statFilter.type === "comparison" && stat.is_team_comparison);

      return matchesSearch && matchesCategory && matchesType;
    }) || [];

  // Get filter display names for UI
  const getCategoryDisplayName = (categoryValue) => {
    switch (categoryValue) {
      case "scoring":
        return "Scoring Stats";
      case "performance":
        return "Performance Metrics";
      case "counting":
        return "Counting Stats";
      case "negative":
        return "Negative Actions";
      default:
        return null;
    }
  };

  const getTypeDisplayName = (typeValue) => {
    switch (typeValue) {
      case "recording":
        return "Recording Stats";
      case "calculated":
        return "Calculated Stats";
      case "boxscore":
        return "Boxscore Stats";
      case "comparison":
        return "Comparison Stats";
      default:
        return null;
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setStatFilter({
      search: "",
      category: "all",
      type: "all",
    });
  };

  // Clear individual filter
  const clearFilter = (filterType) => {
    setStatFilter((prev) => ({
      ...prev,
      [filterType]: filterType === "search" ? "" : "all",
    }));
  };

  // Get active filters count
  const getActiveFiltersCount = () => {
    let count = 0;
    if (statFilter.search) count++;
    if (statFilter.category !== "all") count++;
    if (statFilter.type !== "all") count++;
    return count;
  };

  // Toggle filter visibility
  const toggleFilterVisibility = () => {
    setFilterVisible(!filterVisible);
  };

  return (
    <div className="w-full max-w-screen overflow-x-hidden bg-background">
      <SportDetailsHeader />

      <div className="container mx-auto px-4 py-6">
        <Card className="shadow-sm border rounded-lg overflow-hidden">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="border-b">
              <div className="px-4 pb-4">
                <TabsList className="h-14 w-full max-w-lg">
                  <TabsTrigger
                    value="stats"
                    className="text-xs md:text-sm flex items-center gap-1.5"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Stats
                  </TabsTrigger>
                  <TabsTrigger
                    value="formulas"
                    className="text-xs md:text-sm flex items-center gap-1.5"
                  >
                    <Calculator className="h-4 w-4" />
                    Formulas
                  </TabsTrigger>
                  <TabsTrigger
                    value="leaders"
                    className="text-xs md:text-sm flex items-center gap-1.5"
                  >
                    <Trophy className="h-4 w-4" />
                    Leaders
                  </TabsTrigger>
                  <TabsTrigger
                    value="positions"
                    className="text-xs md:text-sm flex items-center gap-1.5"
                  >
                    <Users className="h-4 w-4" />
                    Positions
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            <TabsContent
              value="stats"
              className="p-0 focus-visible:outline-none focus-visible:ring-0"
            >
              <div className="p-4 border-b bg-muted/20">
                <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold">Stats</h2>
                    <Badge variant="outline" className="bg-primary/10">
                      {filteredStats.length} stats
                    </Badge>
                    {getActiveFiltersCount() > 0 && (
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        <Filter className="h-3 w-3" />
                        {getActiveFiltersCount()} filter
                        {getActiveFiltersCount() !== 1 ? "s" : ""}
                      </Badge>
                    )}
                  </div>

                  <div className="flex gap-2 items-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleFilterVisibility}
                      className="flex items-center gap-1.5"
                    >
                      <ListFilter className="h-4 w-4" />
                      {filterVisible ? "Hide Filters" : "Show Filters"}
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1.5"
                        >
                          {viewMode === "table" ? (
                            <Table2 className="h-4 w-4" />
                          ) : (
                            <LayoutGrid className="h-4 w-4" />
                          )}
                          {viewMode === "table" ? "Table View" : "Card View"}
                          <ChevronDown className="h-4 w-4 ml-1" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>View Options</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setViewMode("table")}
                          className="flex items-center gap-2"
                        >
                          <Table2 className="h-4 w-4" />
                          <span>Table View</span>
                          {viewMode === "table" && (
                            <CheckCircle className="h-3 w-3 ml-1 text-primary" />
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setViewMode("cards")}
                          className="flex items-center gap-2"
                        >
                          <LayoutGrid className="h-4 w-4" />
                          <span>Card View</span>
                          {viewMode === "cards" && (
                            <CheckCircle className="h-3 w-3 ml-1 text-primary" />
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {filterVisible && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="search"
                          placeholder="Search stats by name or code..."
                          className="pl-9 bg-background"
                          value={statFilter.search}
                          onChange={(e) =>
                            setStatFilter((prev) => ({
                              ...prev,
                              search: e.target.value,
                            }))
                          }
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2 justify-end place-self-end w-full">
                        <Select
                          value={statFilter.category}
                          onValueChange={(value) =>
                            setStatFilter((prev) => ({
                              ...prev,
                              category: value,
                            }))
                          }
                        >
                          <SelectTrigger className="bg-background w-full sm:w-auto">
                            <div className="flex items-center gap-2">
                              <SlidersHorizontal className="h-4 w-4" />
                              <span>
                                Category:{" "}
                                {statFilter.category === "all"
                                  ? "All Categories"
                                  : getCategoryDisplayName(statFilter.category)}
                              </span>
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            <SelectItem value="scoring">
                              Scoring Stats
                            </SelectItem>
                            <SelectItem value="performance">
                              Performance Metrics
                            </SelectItem>
                            <SelectItem value="counting">
                              Counting Stats
                            </SelectItem>
                            <SelectItem value="negative">
                              Negative Actions
                            </SelectItem>
                          </SelectContent>
                        </Select>

                        <Select
                          value={statFilter.type}
                          onValueChange={(value) =>
                            setStatFilter((prev) => ({ ...prev, type: value }))
                          }
                        >
                          <SelectTrigger className="bg-background w-full sm:w-auto">
                            <div className="flex items-center gap-2">
                              <SlidersHorizontal className="h-4 w-4" />
                              <span>
                                Type:{" "}
                                {statFilter.type === "all"
                                  ? "All Types"
                                  : getTypeDisplayName(statFilter.type)}
                              </span>
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="recording">
                              Recording Stats
                            </SelectItem>
                            <SelectItem value="calculated">
                              Calculated Stats
                            </SelectItem>
                            <SelectItem value="boxscore">
                              Boxscore Stats
                            </SelectItem>
                            <SelectItem value="comparison">
                              Comparison Stats
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Active filters display */}
                    {(statFilter.search ||
                      statFilter.category !== "all" ||
                      statFilter.type !== "all") && (
                      <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-border/40">
                        <div className="text-sm text-muted-foreground mr-1 font-medium">
                          Active filters:
                        </div>

                        {statFilter.search && (
                          <Badge
                            variant="secondary"
                            className="flex items-center gap-1 pl-2 bg-secondary/80"
                          >
                            <span>Search: {statFilter.search}</span>
                            <button
                              onClick={() => clearFilter("search")}
                              className="ml-1 rounded-full hover:bg-muted p-0.5"
                              aria-label="Clear search filter"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        )}

                        {statFilter.category !== "all" && (
                          <Badge
                            variant="secondary"
                            className="flex items-center gap-1 pl-2 bg-secondary/80"
                          >
                            <span>
                              Category:{" "}
                              {getCategoryDisplayName(statFilter.category)}
                            </span>
                            <button
                              onClick={() => clearFilter("category")}
                              className="ml-1 rounded-full hover:bg-muted p-0.5"
                              aria-label="Clear category filter"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        )}

                        {statFilter.type !== "all" && (
                          <Badge
                            variant="secondary"
                            className="flex items-center gap-1 pl-2 bg-secondary/80"
                          >
                            <span>
                              Type: {getTypeDisplayName(statFilter.type)}
                            </span>
                            <button
                              onClick={() => clearFilter("type")}
                              className="ml-1 rounded-full hover:bg-muted p-0.5"
                              aria-label="Clear type filter"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        )}

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={resetFilters}
                          className="ml-auto text-xs text-primary hover:text-primary/80 font-medium h-7 px-2"
                        >
                          Reset all filters
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="p-4">
                {viewMode === "table" ? (
                  <SportStatsTable filter={statFilter} />
                ) : (
                  <SportStatsCardView
                    stats={filteredStats}
                    filter={{
                      is_record:
                        statFilter.type === "recording"
                          ? true
                          : statFilter.type === "calculated"
                          ? false
                          : null,
                    }}
                  />
                )}
              </div>
            </TabsContent>

            <TabsContent
              value="formulas"
              className="p-0 focus-visible:outline-none focus-visible:ring-0"
            >
              <SportFormulaTable />
            </TabsContent>

            <TabsContent
              value="leaders"
              className="p-0 focus-visible:outline-none focus-visible:ring-0"
            >
              <LeaderCategoriesTable />
            </TabsContent>

            <TabsContent
              value="positions"
              className="p-0 focus-visible:outline-none focus-visible:ring-0"
            >
              <SportPositionsTable />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Sport;
