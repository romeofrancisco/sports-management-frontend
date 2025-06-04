import React, { useState } from "react";
import { 
  Search, 
  Filter, 
  X, 
  Users, 
  Trophy, 
  MapPin,
  ChevronDown,
  Sparkles,
  SlidersHorizontal
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

/**
 * Enhanced visual filter component for players with better UX
 */
const EnhancedPlayerFilter = ({ sports, teams, filters, onFilterChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [sportOpen, setSportOpen] = useState(false);
  const [teamOpen, setTeamOpen] = useState(false);

  const handleFilterChange = (key, value) => {
    if (onFilterChange) {
      onFilterChange(key, value);
    }
  };

  const clearFilter = (key) => {
    handleFilterChange(key, null);
  };

  const clearAllFilters = () => {
    handleFilterChange("search", "");
    handleFilterChange("sport", null);
    handleFilterChange("team", null);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.sport) count++;
    if (filters.team) count++;
    return count;
  };

  const getSelectedSportName = () => {
    if (!filters.sport) return null;
    return sports?.find(s => s.id.toString() === filters.sport)?.name;
  };

  const getSelectedTeamName = () => {
    if (!filters.team) return null;
    return teams?.find(t => t.slug === filters.team)?.name;
  };

  return (
    <Card className="border-0 bg-gradient-to-r from-muted/20 gap-0 via-background to-muted/20 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary/10 rounded-md">
              <SlidersHorizontal className="h-4 w-4 text-primary" />
            </div>
            <CardTitle className="text-base font-semibold">
              Filters
            </CardTitle>
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                {getActiveFiltersCount()} active
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {getActiveFiltersCount() > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="h-8 px-2 text-xs text-muted-foreground hover:text-destructive"
              >
                Clear all
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 w-8 p-0"
            >
              <ChevronDown className={cn(
                "h-4 w-4 transition-transform duration-200",
                isExpanded && "rotate-180"
              )} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Search Bar - Always Visible */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search players by name..."
            className="pl-10 pr-10 bg-background/50 border-muted-foreground/20 focus:border-primary/50 focus:ring-primary/20"
            value={filters.search || ""}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
          {filters.search && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => clearFilter("search")}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Active Filters Display */}
        {getActiveFiltersCount() > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {filters.search && (
              <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100">
                <Search className="h-3 w-3 mr-1" />
                "{filters.search}"
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => clearFilter("search")}
                  className="ml-1 h-4 w-4 p-0 hover:bg-blue-200/50"
                >
                  <X className="h-2 w-2" />
                </Button>
              </Badge>
            )}
            {getSelectedSportName() && (
              <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100">
                <Trophy className="h-3 w-3 mr-1" />
                {getSelectedSportName()}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => clearFilter("sport")}
                  className="ml-1 h-4 w-4 p-0 hover:bg-green-200/50"
                >
                  <X className="h-2 w-2" />
                </Button>
              </Badge>
            )}
            {getSelectedTeamName() && (
              <Badge variant="outline" className="bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100">
                <Users className="h-3 w-3 mr-1" />
                {getSelectedTeamName()}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => clearFilter("team")}
                  className="ml-1 h-4 w-4 p-0 hover:bg-purple-200/50"
                >
                  <X className="h-2 w-2" />
                </Button>
              </Badge>
            )}
          </div>
        )}

        {/* Expandable Filters */}
        {isExpanded && (
          <div className="space-y-4 animate-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Sport Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Trophy className="h-3 w-3" />
                  Sport
                </label>
                <Popover open={sportOpen} onOpenChange={setSportOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={sportOpen}
                      className="w-full justify-between bg-background/50 border-muted-foreground/20 hover:border-primary/50"
                    >
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-muted-foreground" />
                        <span className={cn(
                          getSelectedSportName() ? "text-foreground" : "text-muted-foreground"
                        )}>
                          {getSelectedSportName() || "All Sports"}
                        </span>
                      </div>
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search sports..." />
                      <CommandList>
                        <CommandEmpty>No sport found.</CommandEmpty>
                        <CommandGroup>
                          <CommandItem
                            onSelect={() => {
                              handleFilterChange("sport", null);
                              setSportOpen(false);
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-muted-foreground/40" />
                              All Sports
                            </div>
                          </CommandItem>
                          {sports?.map((sport) => (
                            <CommandItem
                              key={sport.id}
                              value={sport.name}
                              onSelect={() => {
                                handleFilterChange("sport", sport.id.toString());
                                setSportOpen(false);
                              }}
                            >
                              <div className="flex items-center gap-2">
                                <div className={cn(
                                  "w-2 h-2 rounded-full",
                                  filters.sport === sport.id.toString() 
                                    ? "bg-primary" 
                                    : "bg-muted-foreground/40"
                                )} />
                                {sport.name}
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Team Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  Team
                </label>
                <Popover open={teamOpen} onOpenChange={setTeamOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={teamOpen}
                      className="w-full justify-between bg-background/50 border-muted-foreground/20 hover:border-primary/50"
                    >
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className={cn(
                          getSelectedTeamName() ? "text-foreground" : "text-muted-foreground"
                        )}>
                          {getSelectedTeamName() || "All Teams"}
                        </span>
                      </div>
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search teams..." />
                      <CommandList>
                        <CommandEmpty>No team found.</CommandEmpty>
                        <CommandGroup>
                          <CommandItem
                            onSelect={() => {
                              handleFilterChange("team", null);
                              setTeamOpen(false);
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-muted-foreground/40" />
                              All Teams
                            </div>
                          </CommandItem>
                          {teams?.map((team) => (
                            <CommandItem
                              key={team.id}
                              value={team.name}
                              onSelect={() => {
                                handleFilterChange("team", team.slug);
                                setTeamOpen(false);
                              }}
                            >
                              <div className="flex items-center gap-2">
                                <div className={cn(
                                  "w-2 h-2 rounded-full",
                                  filters.team === team.slug 
                                    ? "bg-primary" 
                                    : "bg-muted-foreground/40"
                                )} />
                                {team.name}
                                {team.sport_name && (
                                  <span className="text-xs text-muted-foreground">
                                    • {team.sport_name}
                                  </span>
                                )}
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedPlayerFilter;
