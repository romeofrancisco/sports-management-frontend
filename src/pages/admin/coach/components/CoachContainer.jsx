import React, { useState } from "react";
import { useDebounce } from "use-debounce";
import CoachFilterBar from "./CoachFilterBar";
import { useCoaches } from "@/hooks/useCoaches";
import PageError from "@/pages/PageError";
import ContentLoading from "@/components/common/ContentLoading";
import DeleteCoachModal from "@/components/modals/DeleteCoachModal";
import CoachModal from "@/components/modals/CoachModal";
import CoachCard from "./CoachCard";
import CoachTable from "./CoachTable";
import { useModal } from "@/hooks/useModal";
import { Users, UserCheck, Grid3X3, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import TablePagination from "@/components/ui/table-pagination";

const CoachContainer = () => {
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [filter, setFilter] = useState({ search: "", sex: "", sport: "" });
  const [viewMode, setViewMode] = useState("cards"); // "cards" or "table"

  const [debouncedSearch] = useDebounce(filter.search, 500);
  const debouncedFilter = { ...filter, search: debouncedSearch };
  
  const { data, isLoading, isError } = useCoaches(
    debouncedFilter,
    currentPage,
    pageSize
  );
  const coaches = data?.results || [];
  const totalCoaches = data?.count || 0;
  const totalPages = Math.ceil(totalCoaches / pageSize);
  const modals = {
    delete: useModal(),
    update: useModal(),
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleDeleteCoach = (coach) => {
    setSelectedCoach(coach);
    modals.delete.openModal();
  };

  const handleUpdateCoach = (coach) => {
    setSelectedCoach(coach);
    modals.update.openModal();
  };

  if (isError) return <PageError />;

  return (
    <div className="space-y-6">
      {" "}      {/* Filter Section */}
      <div className="bg-card/50 backdrop-blur-sm rounded-xl p-4 border border-primary/10 shadow-sm">
        <CoachFilterBar filter={filter} setFilter={handleFilterChange} />
      </div>      {/* Content Section */}
      <div className="bg-gradient-to-br from-card/60 via-card/40 to-primary/5 rounded-xl p-6 border-2 border-primary/10 shadow-xl">
        {/* Stats Header - Always visible */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-primary/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <UserCheck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">
                Registered Coaches
              </h2>
              <p className="text-sm text-muted-foreground">
                {isLoading ? (
                  "Loading coaches..."
                ) : coaches && coaches.length > 0 ? (
                  <>
                    {totalCoaches} coach{totalCoaches !== 1 ? "es" : ""}{" "}
                    managing teams
                  </>
                ) : (
                  "No coaches found"
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* View Toggle - Always visible */}
            <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="h-8 px-3"
              >
                <List className="h-4 w-4" />
                <span className="ml-1.5 hidden sm:inline">Table</span>
              </Button>
              <Button
                variant={viewMode === "cards" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("cards")}
                className="h-8 px-3"
              >
                <Grid3X3 className="h-4 w-4" />
                <span className="ml-1.5 hidden sm:inline">Cards</span>
              </Button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <ContentLoading />
          </div>        ) : coaches && coaches.length > 0 ? (
          <>{/* Coaches Content - Cards or Table */}
            {viewMode === "cards" ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {coaches.map((coach, index) => (
                    <div
                      key={coach.id}
                      className="animate-in fade-in-50 duration-500"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <CoachCard
                        coach={coach}
                        onDelete={handleDeleteCoach}
                        onUpdate={handleUpdateCoach}
                      />
                    </div>
                  ))}
                </div>

                {/* Pagination for cards view */}
                <TablePagination
                  currentPage={currentPage}
                  pageSize={pageSize}
                  totalItems={totalCoaches}
                  onPageChange={setCurrentPage}
                  onPageSizeChange={(newSize) => {
                    setPageSize(newSize);
                    setCurrentPage(1);
                  }}
                  itemName="coaches"
                />
              </>
            ) : (
              <CoachTable
                coaches={coaches}
                totalItems={totalCoaches}
                totalPages={totalPages}
                currentPage={currentPage}
                pageSize={pageSize}
                isLoading={isLoading}
                onPageChange={setCurrentPage}
                onPageSizeChange={(newSize) => {
                  setPageSize(newSize);
                  setCurrentPage(1);
                }}
                onDelete={handleDeleteCoach}
                onUpdate={handleUpdateCoach}
              />
            )}
          </>
        ) : (
          // Empty State
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="p-4 bg-primary/10 rounded-full mb-4">
              <UserCheck className="h-12 w-12 text-primary/70" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No Coaches Found
            </h3>{" "}
            <p className="text-muted-foreground max-w-md">
              {filter.search || filter.sex || filter.sport
                ? "No coaches match your current filter criteria. Try adjusting your search or filters."
                : "Get started by registering your first coach. They can then be assigned to manage teams and players."}
            </p>
          </div>
        )}
      </div>
      {/* Modals */}
      <CoachModal
        isOpen={modals.update.isOpen}
        onClose={modals.update.closeModal}
        coach={selectedCoach}
      />
      <DeleteCoachModal
        isOpen={modals.delete.isOpen}
        onClose={modals.delete.closeModal}
        coach={selectedCoach}
      />
    </div>
  );
};

export default CoachContainer;
