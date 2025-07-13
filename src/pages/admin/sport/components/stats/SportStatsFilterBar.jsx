import React from "react";
import {
  Search,
  X,
  Filter,
  Target,
  TrendingUp,
  Activity,
  Shield,
  Hash,
  Sliders,
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

const SportStatsFilterBar = ({ filter, setFilter }) => {
  // Reset all filters
  const resetFilters = () => {
    setFilter({
      search: "",
      category: "all",
      type: "all",
    });
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    switch (category) {
      case "scoring":
        return <Target className="h-4 w-4" />;
      case "performance":
        return <TrendingUp className="h-4 w-4" />;
      case "offensive":
        return <Activity className="h-4 w-4" />;
      case "defensive":
        return <Shield className="h-4 w-4" />;
      case "other":
        return <Hash className="h-4 w-4" />;
      default:
        return <Filter className="h-4 w-4" />;
    }
  };

  // Get active filters count
  const getActiveFiltersCount = () => {
    let count = 0;
    if (filter.search) count++;
    if (filter.category !== "all") count++;
    if (filter.type !== "all") count++;
    return count;
  };

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg shrink-0">
            <Sliders className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-base sm:text-lg">Filter Statistics</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Search and filter your sport statistics
            </p>
          </div>
        </div>

        {/* Active Filters Badge */}
        {getActiveFiltersCount() > 0 && (
          <Badge variant="secondary" className="bg-primary/10 text-primary w-fit">
            <Filter className="h-3 w-3 mr-1" />
            {getActiveFiltersCount()} active
          </Badge>
        )}
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Search Input */}
        <div className="lg:col-span-1">
          <label className="block text-sm font-medium text-foreground mb-2">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              placeholder="Search by name or code..."
              className="pl-10 bg-background border-2 focus:border-primary/50 transition-colors"
              value={filter.search}
              onChange={(e) =>
                setFilter((prev) => ({
                  ...prev,
                  search: e.target.value,
                }))
              }
            />
            {filter.search && (
              <button
                onClick={() => setFilter((prev) => ({ ...prev, search: "" }))}
                className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category and Type Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Category
            </label>
            <Select
              value={filter.category}
              onValueChange={(value) =>
                setFilter((prev) => ({
                  ...prev,
                  category: value,
                }))
              }
            >
              <SelectTrigger className="w-full bg-background border-2 focus:border-primary/50 transition-colors">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    All Categories
                  </div>
                </SelectItem>
                <SelectItem value="scoring">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-red-600" />
                    Scoring
                  </div>
                </SelectItem>
                <SelectItem value="performance">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    Performance
                  </div>
                </SelectItem>
                <SelectItem value="offensive">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-secondary" />
                    Offensive
                  </div>
                </SelectItem>
                <SelectItem value="defensive">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-orange-600" />
                    Defensive
                  </div>
                </SelectItem>
                <SelectItem value="other">
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    Other
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Type
            </label>
            <Select
              value={filter.type}
              onValueChange={(value) =>
                setFilter((prev) => ({ ...prev, type: value }))
              }
            >
              <SelectTrigger className="w-full bg-background border-2 focus:border-primary/50 transition-colors">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="basic">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-secondary rounded-full" />
                    Basic Stats
                  </div>
                </SelectItem>
                <SelectItem value="advanced">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full" />
                    Advanced Stats
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Active Filters Summary & Reset */}
      {getActiveFiltersCount() > 0 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 sm:pt-4 border-t bg-muted/20 -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6 rounded-b-lg">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-foreground">
              Active filters:
            </span>
            {filter.search && (
              <Badge variant="outline" className="bg-background px-2 py-1 text-xs sm:text-sm">
                Search: "{filter.search.length > 15 ? filter.search.slice(0, 15) + '...' : filter.search}"
              </Badge>
            )}
            {filter.category !== "all" && (
              <Badge variant="outline" className="bg-background px-2 py-1 text-xs sm:text-sm">
                <div className="flex items-center gap-1">
                  {getCategoryIcon(filter.category)}
                  {filter.category[0].toUpperCase() + filter.category.slice(1)}
                </div>
              </Badge>
            )}
            {filter.type !== "all" && (
              <Badge variant="outline" className="bg-background px-2 py-1 text-xs sm:text-sm">
                Type: {filter.type[0].toUpperCase() + filter.type.slice(1)}
              </Badge>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={resetFilters}
            className="text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors text-xs sm:text-sm shrink-0"
          >
            <X className="h-3 w-3 mr-1" />
            Clear All
          </Button>
        </div>
      )}
    </>
  );
};

export default SportStatsFilterBar;
