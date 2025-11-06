import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useDebounce } from "use-debounce";
import { useTeams, useReactivateTeam } from "@/hooks/useTeams";
import { useModal } from "@/hooks/useModal";
import DeleteTeamModal from "@/components/modals/DeleteTeamModal";
import TeamModal from "@/components/modals/TeamModal";
import TeamFiltersBar from "./TeamFiltersBar";
import TeamCard from "./TeamCard.jsx";
import TeamsTableView from "./TeamsTableView";
import { TeamsListSkeleton } from "@/components/teams";
import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import TablePagination from "@/components/ui/table-pagination";
import { Users, Table2, LayoutGrid } from "lucide-react";

const TeamsContainer = () => {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [viewMode, setViewMode] = useState("cards"); // "table" or "cards"
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [filter, setFilter] = useState({
    search: "",
    sport: null,
    division: null,
  });

  const [debouncedSearch] = useDebounce(filter.search, 500);
  const debouncedFilter = { ...filter, search: debouncedSearch };
  const { data, isLoading, isError } = useTeams(
    debouncedFilter,
    currentPage,
    pageSize
  );
  const teams = data?.results || [];
  const totalTeams = data?.count || 0;
  const totalPages = Math.ceil(totalTeams / pageSize);

  const deleteModal = useModal();
  const updateModal = useModal();
  const navigate = useNavigate();
  
  const reactivateTeamMutation = useReactivateTeam();

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };
  
  const handleReactivateTeam = (team) => {
    reactivateTeamMutation.mutate({ teamSlug: team.slug });
  };

  return (
    <Card className="bg-gradient-to-br from-card via-card to-card/95 shadow-xl border-2 border-primary/20 transition-all duration-300 hover:shadow-2xl hover:border-primary/30 relative overflow-hidden">
      <CardHeader className="flex flex-col border-b-2 border-primary/20 justify-between gap-4 pb-5 bg-transparent">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-3 rounded-xl">
              <Users className="size-7 text-primary-foreground" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-foreground">Teams</h2>
                <Badge className="h-6 text-[11px]">{totalTeams} teams</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Register, manage, and track team profiles and statistics for your sports organization.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "table" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="flex items-center gap-2"
            >
              <Table2 className="h-4 w-4" />
              Table
            </Button>
            <Button
              variant={viewMode === "cards" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("cards")}
              className="flex items-center gap-2"
            >
              <LayoutGrid className="h-4 w-4" />
              Cards
            </Button>
          </div>
        </div>
        <TeamFiltersBar filter={filter} setFilter={handleFilterChange} />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <TeamsListSkeleton viewMode={viewMode} pageSize={pageSize} />
        ) : teams && teams.length > 0 ? (
          viewMode === "cards" ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {teams.map((team, index) => (
                  <TeamCard
                    key={team.id || index}
                    team={team}
                    onView={() => navigate(`/teams/${team.slug}`)}
                    onEdit={() => {
                      setSelectedTeam(team);
                      updateModal.openModal();
                    }}
                    onDelete={() => {
                      setSelectedTeam(team);
                      deleteModal.openModal();
                    }}
                    onReactivate={() => handleReactivateTeam(team)}
                  />
                ))}
              </div>

              {/* Pagination for cards view */}
              {totalTeams > 0 && (
                <TablePagination
                  currentPage={currentPage}
                  pageSize={pageSize}
                  totalItems={totalTeams}
                  onPageChange={setCurrentPage}
                  onPageSizeChange={(newSize) => {
                    setPageSize(newSize);
                    setCurrentPage(1);
                  }}
                  isLoading={isLoading}
                  pageSizeOptions={[12, 24, 36, 48]}
                  itemName="teams"
                />
              )}
            </>
          ) : (
            <TeamsTableView
              teams={teams}
              totalItems={totalTeams}
              totalPages={totalPages}
              currentPage={currentPage}
              pageSize={pageSize}
              isLoading={isLoading}
              onPageChange={setCurrentPage}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize);
                setCurrentPage(1);
              }}
              onUpdateTeam={(team) => {
                setSelectedTeam(team);
                updateModal.openModal();
              }}
              onDeleteTeam={(team) => {
                setSelectedTeam(team);
                deleteModal.openModal();
              }}
              onReactivateTeam={handleReactivateTeam}
            />
          )
        ) : (
          <div className="text-center py-16 relative">
            {/* Enhanced background effects for empty state */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 rounded-lg opacity-50"></div>
            <div className="relative">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mb-6 shadow-lg border-2 border-primary/20">
                <Users className="h-10 w-10 text-primary" />
              </div>
              <p className="text-foreground font-bold text-lg mb-2">
                No teams found
              </p>
              <p className="text-muted-foreground font-medium max-w-sm mx-auto">
                {filter.search || filter.sport || filter.division
                  ? "Try adjusting your filters to find teams"
                  : "Create your first team to get started with team management"}
              </p>
            </div>
          </div>
        )}
      </CardContent>

      <DeleteTeamModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        team={selectedTeam}
      />
      <TeamModal
        isOpen={updateModal.isOpen}
        onClose={updateModal.closeModal}
        team={selectedTeam}
      />
    </Card>
  );
};

export default TeamsContainer;
