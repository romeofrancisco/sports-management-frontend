import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import GameSchedule from "@/pages/admin/league/season/components/SeasonGameSchedule";
import { useSeasonGames } from "@/hooks/useSeasons";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Calendar, FilterIcon, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const GameSchedulePage = () => {
  const { league: leagueId, season: seasonId } = useParams();
  const [filters, setFilters] = useState({});
  const [appliedFilters, setAppliedFilters] = useState([]);
  const { data: games, isLoading, isError } = useSeasonGames(leagueId, seasonId, filters);

  const handleDateChange = (date) => {
    console.log("Date changed:", date);
    // You could update filters here if needed
  };
  
  // Filter handling
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
    
    // Track applied filters for UI display
    if (value) {
      setAppliedFilters(prev => {
        if (!prev.includes(key)) return [...prev, key];
        return prev;
      });
    } else {
      setAppliedFilters(prev => prev.filter(f => f !== key));
    }
  };
  
  const clearFilters = () => {
    setFilters({});
    setAppliedFilters([]);
  };
  
  // Get today's date in a readable format
  const getTodayFormatted = () => {
    return format(new Date(), "EEEE, MMMM d, yyyy");
  };

  return (
    <div className="container max-w-7xl py-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Game Schedule</h1>
          <p className="text-muted-foreground">{getTodayFormatted()}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Export Schedule
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Export the game schedule to your calendar</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="relative">
                <FilterIcon className="h-4 w-4 mr-2" />
                Filter
                {appliedFilters.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {appliedFilters.length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter Games</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={filters.homeGamesOnly}
                onCheckedChange={(checked) => handleFilterChange('homeGamesOnly', checked)}
              >
                Home Games Only
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filters.awayGamesOnly}
                onCheckedChange={(checked) => handleFilterChange('awayGamesOnly', checked)}
              >
                Away Games Only
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={filters.nationalTV}
                onCheckedChange={(checked) => handleFilterChange('nationalTV', checked)}
              >
                National TV Games
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filters.completed}
                onCheckedChange={(checked) => handleFilterChange('completed', checked)}
              >
                Completed Games
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              {appliedFilters.length > 0 && (
                <Button 
                  variant="ghost" 
                  className="w-full text-xs justify-center text-muted-foreground hover:text-destructive"
                  onClick={clearFilters}
                >
                  Clear All Filters
                </Button>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {isLoading ? (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 7 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
              <div className="space-y-4 pt-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : isError ? (
        <Card>
          <CardContent className="p-8 flex flex-col items-center">
            <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Unable to load games</h3>
            <p className="text-muted-foreground text-center mb-4">
              There was an error loading the game schedule. Please try again later.
            </p>
            <Button>Retry</Button>
          </CardContent>
        </Card>
      ) : (
        <GameSchedule games={games || []} onDateChange={handleDateChange} />
      )}
    </div>
  );
};

export default GameSchedulePage;