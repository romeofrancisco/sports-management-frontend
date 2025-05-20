import React, { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { LineChart, BarChart, ChevronRight, Users } from "lucide-react";
import { useSports } from "@/hooks/useSports";
import { useTeams } from "@/hooks/useTeams";
import { useModal } from "@/hooks/useModal";
import "./player-progress-styles.css";
import ContentLoading from "@/components/common/ContentLoading";
import PlayerMetricRecorderModal from "@/components/modals/PlayerMetricRecorderModal";
import { Input } from "@/components/ui/input";
import PlayerSearchFilter from "./PlayerSearchFilter";
import TeamSearchFilter from "./TeamSearchFilter";
import TablePagination from "@/components/ui/table-pagination";

// Import the components
import PlayerProgressQuickActions from "./PlayerProgressQuickActions";
import PlayerProgressStats from "./PlayerProgressStats";
import PlayerProgressIndividualView from "./PlayerProgressIndividualView";
import PlayerProgressCompareView from "./PlayerProgressCompareView";
import PlayerProgressMultiView from "./PlayerProgressMultiView";
import EmptyStateView from "./EmptyStateView";
import { usePlayers, useTeamPlayers } from "@/hooks/usePlayers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const PlayerProgressSection = () => {
  const [filter, setFilter] = useState({
    selectedPlayer: null,
    selectedTeam: null,
    dateRange: {
      from: null,
      to: null,
    },
    viewType: "individual",
  });

  // Filters for player list
  const [playerFilters, setPlayerFilters] = useState({
    search: "",
    team: null,
    sport: null,
  });
  // Pagination state for players
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  const { open: openModal } = useModal();

  // Fetch sports
  const { data: sports = [], isLoading: isSportsLoading } = useSports();

  // Fetch teams
  const { data: teams = [], isLoading: isTeamsLoading } = useTeams(
    {sport: playerFilters.sport},
  );

  // Fetch all players with pagination for Individual tab
  const {
    data: playersData = { results: [], count: 0 },
    isLoading: isPlayersLoading,
  } = usePlayers(
    {
      search: playerFilters.search,
      team: playerFilters.team,
      sport: playerFilters.sport,
    },
    page,
    pageSize
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [playerFilters]);
  // Player data with pagination
  const players = playersData.results || [];
  const totalPlayers = playersData.count || 0;
  const totalPages = Math.ceil(totalPlayers / pageSize);

  // Filter teams based on search and sport filters
  const filteredTeams = useMemo(() => {
    return teams.filter((team) => {
      // Filter by search term
      const searchMatch =
        !playerFilters.search ||
        team.name.toLowerCase().includes(playerFilters.search.toLowerCase());

      // Filter by sport
      const sportMatch =
        !playerFilters.sport ||
        team.sport === playerFilters.sport ||
        team.sport_id === playerFilters.sport;

      return searchMatch && sportMatch;
    });
  }, [teams, playerFilters.search, playerFilters.sport]);

  // Format date range for API requests
  const dateRangeParams = useMemo(() => {
    return {
      date_from: filter.dateRange?.from
        ? filter.dateRange.from.toISOString().split("T")[0]
        : undefined,
      date_to: filter.dateRange?.to
        ? filter.dateRange.to.toISOString().split("T")[0]
        : undefined,
    };
  }, [filter.dateRange]);

  // Handle player selection (for individual view)
  const handlePlayerSelect = (playerId) => {
    setFilter((prev) => ({
      ...prev,
      selectedPlayer: playerId,
    }));
  };

  // Handle team selection (for compare view)
  const handleTeamSelect = (teamSlug) => {
    setFilter((prev) => ({
      ...prev,
      selectedTeam: teamSlug,
    }));
  };
  // Handle view type change
  const handleViewTypeChange = (type) => {
    setFilter((prev) => ({
      ...prev,
      viewType: type,
      // Reset selections when switching views
      selectedPlayer: null,
      selectedTeam: null,
    }));

    // Reset filters when switching views
    setPlayerFilters({
      search: "",
      team: "",
      sport: "",
    });

    // Reset to first page when switching to individual view
    if (type === "individual") {
      setPage(1);
    }
  }; // Handle pagination
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // Handle page size change
  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setPage(1); // Reset to first page when page size changes
  };

  // Handle player filter changes
  const handlePlayerFilterChange = (key, value) => {
    setPlayerFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Handle opening the player metric recorder modal
  const handleOpenMetricRecorder = (playerId, teamSlug) => {
    openModal(PlayerMetricRecorderModal, {
      playerId,
      teamSlug,
    });
  };

  // Handle back button from individual view
  const handleBackToList = () => {
    setFilter((prev) => ({
      ...prev,
      selectedPlayer: null,
    }));
  };

  // Handle back button from team view
  const handleBackToTeamList = () => {
    setFilter((prev) => ({
      ...prev,
      selectedTeam: null,
    }));
  };
  // Loading state
  const isLoading = isSportsLoading || isTeamsLoading || isPlayersLoading;

  // Find selected player name
  const selectedPlayerName =
    players.find((p) => p.id === filter.selectedPlayer)?.name || "Player";

  // Create player card component
  const PlayerCard = ({ player }) => (
    <Card
      className="shadow-sm border cursor-pointer hover:border-primary/60 transition-colors"
      onClick={() => handlePlayerSelect(player.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={player.profile} alt={player.full_name} />
            <AvatarFallback>
              {player.first_name.charAt(0).toUpperCase()}
              {player.last_name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{player.full_name}</h3>
            <p className="text-xs text-muted-foreground">
              {player.team.name || "No team assigned"}
            </p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );

  // Create team card component
  const TeamCard = ({ team }) => (
    <Card
      className="shadow-sm border cursor-pointer hover:border-primary/60 transition-colors"
      onClick={() => handleTeamSelect(team.slug)}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={team.logo} alt={team.name} />
            <AvatarFallback>{team.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{team.name}</h3>
            <p className="text-xs text-muted-foreground">
              {team.sport_name || "Sport"}
            </p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Player Progress Tracking
          </h2>
          <p className="text-muted-foreground mt-1">
            Track and analyze player performance metrics over time
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={filter.viewType === "individual" ? "default" : "outline"}
            size="sm"
            className="shadow-sm"
            onClick={() => handleViewTypeChange("individual")}
          >
            <LineChart className="h-4 w-4 mr-2" />
            Individual
          </Button>
          <Button
            variant={filter.viewType === "compare" ? "default" : "outline"}
            size="sm"
            className="shadow-sm"
            onClick={() => handleViewTypeChange("compare")}
          >
            <BarChart className="h-4 w-4 mr-2" />
            Compare
          </Button>
        </div>
      </div>
      {/* Main Content Section */}
      <div className="space-y-6">
        {/* Individual View Tab Content */}
        {filter.viewType === "individual" && (
          <>
            {filter.selectedPlayer ? (
              <>
                {/* Individual Player View */}
                {isLoading ? (
                  <Card className="border shadow-sm overflow-hidden">
                    <div className="p-8 flex flex-col items-center justify-center gap-4">
                      <div className="flex items-center gap-4">
                        <ContentLoading />
                      </div>
                      <div className="w-full max-w-md space-y-3">
                        <div className="h-2 bg-muted rounded w-full"></div>
                        <div className="h-2 bg-muted rounded w-4/5"></div>
                        <div className="h-2 bg-muted rounded w-3/5"></div>
                      </div>
                    </div>
                  </Card>
                ) : (
                  <>
                    <PlayerProgressQuickActions
                      openModal={() =>
                        handleOpenMetricRecorder(filter.selectedPlayer, null)
                      }
                      playerId={filter.selectedPlayer}
                    />
                    <PlayerProgressStats />
                    <PlayerProgressIndividualView
                      playerId={filter.selectedPlayer}
                      playerName={selectedPlayerName}
                      dateRangeParams={dateRangeParams}
                      handleBackToCompare={handleBackToList}
                      openModal={() =>
                        handleOpenMetricRecorder(filter.selectedPlayer, null)
                      }
                    />
                  </>
                )}
              </>
            ) : (
              <>
                {/* Player List */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle>Players</CardTitle>
                    <CardDescription>
                      Select a player to view individual progress
                    </CardDescription>
                  </CardHeader>
                  {/* Player Filters - Always visible */}
                  <div className="px-6 pb-4">
                    <PlayerSearchFilter
                      sports={sports}
                      teams={teams}
                      filters={playerFilters}
                      onFilterChange={handlePlayerFilterChange}
                    />
                  </div>
                  <CardContent>
                    {isPlayersLoading ? (
                      <div className="p-4 flex flex-col items-center justify-center gap-4">
                        <div className="flex items-center gap-4">
                          <ContentLoading />
                        </div>
                        <div className="w-full max-w-md space-y-3">
                          <div className="h-2 bg-muted rounded w-full"></div>
                          <div className="h-2 bg-muted rounded w-4/5"></div>
                          <div className="h-2 bg-muted rounded w-3/5"></div>
                        </div>
                      </div>
                    ) : players.length === 0 ? (
                      <div className="text-center p-4">
                        <p className="text-muted-foreground">
                          No players found
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {players.map((player) => (
                            <PlayerCard key={player.id} player={player} />
                          ))}
                        </div>

                        {/* Pagination */}
                        <TablePagination
                          currentPage={page}
                          pageSize={pageSize}
                          totalItems={totalPlayers}
                          onPageChange={handlePageChange}
                          onPageSizeChange={handlePageSizeChange}
                          isLoading={isPlayersLoading}
                          pageSizeOptions={[12, 24, 36, 48]}
                          itemName="players"
                        />
                      </>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </>
        )}

        {/* Compare View Tab Content */}
        {filter.viewType === "compare" && (
          <>
            {filter.selectedTeam ? (
              <>
                {/* Team Multi-View */}
                <Card>
                  <CardHeader className="pb-3 border-b">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 rounded-full"
                          onClick={handleBackToTeamList}
                        >
                          <ChevronRight className="h-4 w-4 rotate-180" />
                        </Button>
                        Team Comparison
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <PlayerProgressMultiView
                      teamSlug={filter.selectedTeam}
                      dateRange={dateRangeParams}
                    />
                  </CardContent>
                </Card>
              </>
            ) : (
              <>
                {/* Team List */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle>Teams</CardTitle>
                    <CardDescription>
                      Select a team to compare players
                    </CardDescription>
                  </CardHeader>
                  {/* Team Filters - Always visible */}
                  <div className="px-6 pb-4">
                    <TeamSearchFilter
                      sports={sports}
                      filters={playerFilters}
                      onFilterChange={handlePlayerFilterChange}
                    />
                  </div>
                  <CardContent>
                    {isTeamsLoading ? (
                      <div className="p-4 flex flex-col items-center justify-center gap-4">
                        <div className="flex items-center gap-4">
                          <ContentLoading />
                        </div>
                        <div className="w-full max-w-md space-y-3">
                          <div className="h-2 bg-muted rounded w-full"></div>
                          <div className="h-2 bg-muted rounded w-4/5"></div>
                          <div className="h-2 bg-muted rounded w-3/5"></div>
                        </div>
                      </div>
                    ) : teams.length === 0 || filteredTeams.length === 0 ? (
                      <div className="text-center p-4">
                        <p className="text-muted-foreground">No teams found</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredTeams.map((team) => (
                          <TeamCard key={team.id} team={team} />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PlayerProgressSection;
