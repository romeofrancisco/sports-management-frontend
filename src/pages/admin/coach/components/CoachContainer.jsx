import React, { useState } from "react";
import { useDebounce } from "use-debounce";
import CoachFilterBar from "./CoachFilterBar";
import { useCoaches, useReactivateCoach } from "@/hooks/useCoaches";
import PageError from "@/pages/PageError";
import ContentLoading from "@/components/common/ContentLoading";
import DeleteCoachModal from "@/components/modals/DeleteCoachModal";
import CoachModal from "@/components/modals/CoachModal";
import CoachCard from "./CoachCard";
import CoachTable from "./CoachTable";
import { useModal } from "@/hooks/useModal";
import { Users, ClipboardList, Grid3X3, List } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

  const reactivateCoachMutation = useReactivateCoach();

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

  const handleReactivateCoach = (coach) => {
    reactivateCoachMutation.mutate({ id: coach.id });
  };

  if (isError) return <PageError />;

  return (
    <Card className="bg-gradient-to-br from-card via-card to-card/95 shadow-xl border-2 border-primary/20 transition-all duration-300 hover:shadow-2xl hover:border-primary/30 relative overflow-hidden">
      <CardHeader className="flex flex-col border-b-2 border-primary/20 justify-between gap-4 pb-5 bg-transparent">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-3 rounded-xl">
              <ClipboardList className="size-7 text-primary-foreground" />
            </div>
            <div>
              <div className="flex gap-2">
                <h2 className="text-2xl font-bold text-foreground">Coaches</h2>
                <Badge>{totalCoaches} coaches</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Register, manage, and track coach profiles and assignments for
                your sports organization.
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
              <List className="h-4 w-4" />
              Table
            </Button>
            <Button
              variant={viewMode === "cards" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("cards")}
              className="flex items-center gap-2"
            >
              <Grid3X3 className="h-4 w-4" />
              Cards
            </Button>
          </div>
        </div>
        <CoachFilterBar filter={filter} setFilter={handleFilterChange} />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <ContentLoading />
          </div>
        ) : coaches && coaches.length > 0 ? (
          <>
            {/* Coaches Content - Cards or Table */}
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
                        onReactivate={handleReactivateCoach}
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
                onReactivate={handleReactivateCoach}
              />
            )}
          </>
        ) : (
          // Empty State
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="p-4 bg-primary/10 rounded-full mb-4">
              <ClipboardList className="h-12 w-12 text-primary/70" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No Coaches Found
            </h3>
            <p className="text-muted-foreground max-w-md">
              {filter.search || filter.sex || filter.sport
                ? "No coaches match your current filter criteria. Try adjusting your search or filters."
                : "Get started by registering your first coach. They can then be assigned to manage teams and players."}
            </p>
          </div>
        )}
      </CardContent>
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
    </Card>
  );
};

export default CoachContainer;
