import React from "react";
import {
  FilterDateRange,
  FilterLeague,
  FilterSeason,
  FilterGameStatus,
  FilterGameType,
  SearchFilter,
  FilterSport,
} from "@/components/common/Filters";
import { GAME_TYPE_VALUES, GAME_STATUS, GAME_TYPES } from "@/constants/game";
import {
  Search,
  Filter,
  X,
  Calendar,
  Trophy,
  Target,
  Clock,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useSports } from "@/hooks/useSports";
import { useLeagues } from "@/hooks/useLeagues";
import { useSeasons } from "@/hooks/useSeasons";

const GameFilterBar = ({ filter, setFilter }) => {
  const { data: sports } = useSports();
  const { data: leagues } = useLeagues();
  const { data: seasons } = useSeasons(filter.league);

  const hasActiveFilters =
    filter.team_name ||
    filter.type ||
    filter.league ||
    filter.season ||
    filter.status ||
    filter.start_date ||
    filter.end_date ||
    filter.sport;

  const handleLeagueChange = (leagueId) => {
    setFilter((prev) => ({ ...prev, league: leagueId, season: "" }));
  };

  const handleTypeChange = (type) => {
    setFilter((prev) => ({
      ...prev,
      type,
      league: type === GAME_TYPE_VALUES.LEAGUE ? prev.league : "",
      season: "",
    }));
  };
  const clearAllFilters = () => {
    setFilter({
      team_name: "",
      type: "",
      league: "",
      season: "",
      status: "",
      start_date: "",
      end_date: "",
      sport: "",
    });
  };

  const clearSpecificFilter = (filterType) => {
    const updates = { [filterType]: "" };

    // Clear dependent filters
    if (filterType === "type") {
      updates.league = "";
      updates.season = "";
    } else if (filterType === "league") {
      updates.season = "";
    }

    setFilter((prev) => ({ ...prev, ...updates }));
  };

  // Helper functions to get display names
  const getSportName = () => {
    if (!filter.sport || !sports) return null;
    const sport = sports.find((s) => s.id === parseInt(filter.sport));
    return sport?.name || null;
  };

  const getGameTypeName = () => {
    if (!filter.type) return null;
    const gameType = GAME_TYPES.find((t) => t.value === filter.type);
    return gameType?.label || filter.type;
  };

  const getLeagueName = () => {
    if (!filter.league || !leagues) return null;
    const league = leagues.find((l) => l.id === parseInt(filter.league));
    return league?.name || null;
  };

  const getSeasonName = () => {
    if (!filter.season || !seasons?.results) return null;
    const season = seasons.results.find(
      (s) => s.id === parseInt(filter.season)
    );
    return season ? `${season.name} ${season.year}` : null;
  };

  const getStatusName = () => {
    if (!filter.status) return null;
    const status = GAME_STATUS.find((s) => s.value === filter.status);
    return status?.label || filter.status;
  };

  const getDateRangeName = () => {
    if (!filter.start_date && !filter.end_date) return null;
    if (filter.start_date && filter.end_date) {
      return `${new Date(filter.start_date).toLocaleDateString()} - ${new Date(
        filter.end_date
      ).toLocaleDateString()}`;
    }
    if (filter.start_date)
      return `From ${new Date(filter.start_date).toLocaleDateString()}`;
    if (filter.end_date)
      return `Until ${new Date(filter.end_date).toLocaleDateString()}`;
    return null;
  };

  return (
    <Card className="bg-gradient-to-r from-card/60 to-card/40 backdrop-blur-sm border border-primary/20 shadow-sm">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Main Filter Controls - Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-3">
            {/* Search Filter - Takes more space on larger screens */}
            <div className="sm:col-span-2 lg:col-span-3 xl:col-span-2 2xl:col-span-2">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                <SearchFilter
                  value={filter.team_name}
                  onChange={(team_name) =>
                    setFilter((prev) => ({ ...prev, team_name }))
                  }
                  placeholder="Search by team name..."
                  hideLabel={true}
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
              <FilterGameStatus
                value={filter.status}
                onChange={(status) =>
                  setFilter((prev) => ({ ...prev, status }))
                }
                className="flex-1"
                hideLabel={true}
              />
            </div>

            {/* Sport Filter */}
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
              <FilterSport
                value={filter.sport}
                onChange={(sport) => setFilter((prev) => ({ ...prev, sport }))}
                className="flex-1"
                hideLabel={true}
              />
            </div>

            {/* Date Range Filter */}
            <div className="lg:col-span-1 xl:col-span-1 2xl:col-span-1">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                <FilterDateRange
                  value={{
                    start_date: filter.start_date,
                    end_date: filter.end_date,
                  }}
                  onChange={({ start_date, end_date }) =>
                    setFilter((prev) => ({ ...prev, start_date, end_date }))
                  }
                  className="flex-1"
                  hideLabel={true}
                />
              </div>
            </div>

            {/* Game Type Filter */}
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground shrink-0" />
              <FilterGameType
                value={filter.type}
                onChange={handleTypeChange}
                className="flex-1"
                hideLabel={true}
              />
            </div>
            {/* League & Season Filters - Only show when League type is selected */}
            {filter.type === GAME_TYPE_VALUES.LEAGUE && (
              <>
                {/* League Filter */}
                <div className="sm:col-span-1 flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-muted-foreground shrink-0" />
                  <FilterLeague
                    value={filter.league}
                    type={filter.type}
                    onChange={handleLeagueChange}
                    className="flex-1"
                    hideLabel={true}
                  />
                </div>
                {/* Season Filter */}
                <div className="sm:col-span-1 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                  <FilterSeason
                    value={filter.season}
                    league={filter.league}
                    onChange={(seasonId) =>
                      setFilter((prev) => ({ ...prev, season: seasonId }))
                    }
                    className="flex-1"
                    hideLabel={true}
                  />
                </div>
              </>
            )}
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <span className="text-xs font-medium text-muted-foreground shrink-0">
                Active filters:
              </span>

              {filter.team_name && (
                <Badge
                  variant="secondary"
                  className="text-xs flex items-center gap-1"
                >
                  <Search className="h-3 w-3" />"{filter.team_name}"
                  <Button
                    onClick={() => clearSpecificFilter("team_name")}
                    variant="ghost"
                    size="sm"
                    className="ml-1 h-3 w-3 p-0 hover:bg-destructive/20"
                  >
                    <X className="h-2 w-2" />
                  </Button>
                </Badge>
              )}

              {filter.type && getGameTypeName() && (
                <Badge
                  variant="secondary"
                  className="text-xs flex items-center gap-1"
                >
                  <Target className="h-3 w-3" />
                  {getGameTypeName()}
                  <Button
                    onClick={() => clearSpecificFilter("type")}
                    variant="ghost"
                    size="sm"
                    className="ml-1 h-3 w-3 p-0 hover:bg-destructive/20"
                  >
                    <X className="h-2 w-2" />
                  </Button>
                </Badge>
              )}

              {filter.league && getLeagueName() && (
                <Badge
                  variant="secondary"
                  className="text-xs flex items-center gap-1"
                >
                  <Trophy className="h-3 w-3" />
                  {getLeagueName()}
                  <Button
                    onClick={() => clearSpecificFilter("league")}
                    variant="ghost"
                    size="sm"
                    className="ml-1 h-3 w-3 p-0 hover:bg-destructive/20"
                  >
                    <X className="h-2 w-2" />
                  </Button>
                </Badge>
              )}

              {filter.season && getSeasonName() && (
                <Badge
                  variant="secondary"
                  className="text-xs flex items-center gap-1"
                >
                  <Calendar className="h-3 w-3" />
                  {getSeasonName()}
                  <Button
                    onClick={() => clearSpecificFilter("season")}
                    variant="ghost"
                    size="sm"
                    className="ml-1 h-3 w-3 p-0 hover:bg-destructive/20"
                  >
                    <X className="h-2 w-2" />
                  </Button>
                </Badge>
              )}

              {filter.status && getStatusName() && (
                <Badge
                  variant="secondary"
                  className="text-xs flex items-center gap-1"
                >
                  <Clock className="h-3 w-3" />
                  {getStatusName()}
                  <Button
                    onClick={() => clearSpecificFilter("status")}
                    variant="ghost"
                    size="sm"
                    className="ml-1 h-3 w-3 p-0 hover:bg-destructive/20"
                  >
                    <X className="h-2 w-2" />
                  </Button>
                </Badge>
              )}

              {(filter.start_date || filter.end_date) && getDateRangeName() && (
                <Badge
                  variant="secondary"
                  className="text-xs flex items-center gap-1"
                >
                  <Calendar className="h-3 w-3" />
                  {getDateRangeName()}
                  <Button
                    onClick={() =>
                      setFilter((prev) => ({
                        ...prev,
                        start_date: "",
                        end_date: "",
                      }))
                    }
                    variant="ghost"
                    size="sm"
                    className="ml-1 h-3 w-3 p-0 hover:bg-destructive/20"
                  >
                    <X className="h-2 w-2" />
                  </Button>
                </Badge>
              )}

              {filter.sport && getSportName() && (
                <Badge
                  variant="secondary"
                  className="text-xs flex items-center gap-1"
                >
                  <Globe className="h-3 w-3" />
                  {getSportName()}
                  <Button
                    onClick={() => clearSpecificFilter("sport")}
                    variant="ghost"
                    size="sm"
                    className="ml-1 h-3 w-3 p-0 hover:bg-destructive/20"
                  >
                    <X className="h-2 w-2" />
                  </Button>
                </Badge>
              )}

              <Button
                onClick={clearAllFilters}
                variant="outline"
                size="sm"
                className="shrink-0 text-destructive hover:bg-destructive/10 border-destructive/30 ml-auto"
              >
                <X className="mr-1 h-3 w-3" />
                <span className="hidden sm:inline">Clear All Filters</span>
                <span className="sm:hidden">Clear</span>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GameFilterBar;
