import React, { useState } from "react";
import { PlusIcon, Table2, LayoutGrid, Target, Calendar } from "lucide-react";
import { Button } from "../../ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useTrainingSessions } from "@/hooks/useTrainings";
import DataTable from "@/components/common/DataTable";
import TablePagination from "@/components/ui/table-pagination";
import getTrainingSessionTableColumns from "../../table_columns/TrainingSessionTableColumns";
import TrainingSessionCard from "./TrainingSessionCard";
import EnhancedTrainingFilter from "./EnhancedTrainingFilter";
import { useModal } from "@/hooks/useModal";
import DeleteTrainingSessionModal from "@/components/modals/trainings/DeleteTrainingSessionModal";
import TrainingSessionFormDialog from "@/components/modals/trainings/TrainingSessionFormDialog";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { set } from "date-fns";

const TrainingSessionsList = () => {
  const navigate = useNavigate();
  const [selectedSession, setSelectedSession] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [viewMode, setViewMode] = useState("cards"); // Default to cards view
  const [filter, setFilter] = useState({
    search: "",
    team: "",
    date: "",
    status: "",
  });

  const modals = {
    delete: useModal(),
    sessions: useModal(),
  };
  const { data, isLoading, isError, refetch } = useTrainingSessions(
    filter,
    currentPage,
    pageSize
  );
  const sessions = data?.results || [];
  const totalSessions = data?.count || 0;

  console.log("TrainingSessionsList render - sessions:", sessions);

  // Function to handle manage session navigation
  const handleManageSession = (session) => {
    navigate(`/sessions/${session.id}/manage/session-metrics`);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  if (isError)
    return (
      <TabLayout>
        <TabContent>
          <div className="text-red-500">Error loading training sessions.</div>
        </TabContent>
      </TabLayout>
    );
  const columns = getTrainingSessionTableColumns({
    onEdit: (session) => {
      setSelectedSession(session);
      modals.sessions.openModal();
    },
    onDelete: (session) => {
      setSelectedSession(session);
      modals.delete.openModal();
    },
    onManage: handleManageSession,
  });
  return (
    <>
      <Card className="gap-0">
        <CardHeader className="flex flex-col border-b-2 border-primary/20 justify-between gap-4 pb-5 bg-transparent">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="bg-primary p-3 rounded-xl">
                <Calendar className="size-7 text-primary-foreground" />
              </div>
              <div>
                <div className="flex gap-1 items-center">
                  <h2 className="text-2xl font-bold text-foreground">
                    Training Sessions
                  </h2>
                  <Badge className="hidden md:inline-flex h-6 p-1 text-[11px]">
                    {totalSessions} sessions
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Manage and organize training sessions for teams.
                </p>
              </div>
            </div>
            {/* View Toggle */}
            <div className="hidden md:flex items-center gap-2">
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("table")}
                className="flex items-center gap-2"
              >
                <Table2 />
              </Button>
              <Button
                variant={viewMode === "cards" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("cards")}
                className="flex items-center gap-2"
              >
                <LayoutGrid />
              </Button>
            </div>
          </div>

          {/* Enhanced Filters */}
          <EnhancedTrainingFilter
            filters={filter}
            onFilterChange={setFilter}
            onNewSession={() => {
              setSelectedSession(null);
              modals.sessions.openModal();
            }}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
        </CardHeader>

        <CardContent className="px-0">
          {/* Loading and Error States */}
          {isError ? (
            <div className="text-center py-16">
              <div className="text-red-500">
                Error loading training sessions.
              </div>
            </div>
          ) : (
            <>
              {/* Content based on view mode */}
              {viewMode === "table" ? (
                <>
                  <div>
                    <DataTable
                      columns={columns}
                      data={sessions}
                      loading={isLoading}
                      className="text-xs sm:text-sm"
                      showPagination={false}
                      pageSize={pageSize}
                    />
                  </div>
                </>
              ) : (
                <>
                  {sessions.length === 0 && !isLoading ? (
                    <div className="text-center py-16 relative">
                      {/* Enhanced background effects for empty state */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 rounded-lg opacity-50"></div>
                      <div className="relative">
                        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mb-6 shadow-lg border-2 border-primary/20">
                          <Target className="h-10 w-10 text-primary" />
                        </div>
                        <p className="text-foreground font-bold text-lg mb-2">
                          No training sessions found
                        </p>
                        <p className="text-muted-foreground font-medium max-w-sm mx-auto mb-6">
                          {filter.search ||
                          filter.team ||
                          filter.date ||
                          filter.status
                            ? "Try adjusting your filters to find sessions"
                            : "Create your first training session to get started"}
                        </p>
                        <Button
                          onClick={onNewSession}
                          className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg transition-all duration-300 hover:scale-105"
                        >
                          <PlusIcon className="mr-2 h-4 w-4" />
                          Create Session
                        </Button>
                      </div>
                    </div>
                  ) : isLoading ? (
                    <div className="text-center py-16">
                      <div className="text-muted-foreground">
                        Loading sessions...
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
                      {sessions.map((session) => (
                        <TrainingSessionCard
                          key={session.id}
                          session={session}
                          onEdit={() => {
                            setSelectedSession(session);
                            modals.sessions.openModal();
                          }}
                          onDelete={(session) => {
                            setSelectedSession(session);
                            modals.delete.openModal();
                          }}
                          onViewDetails={() => handleManageSession(session)}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Pagination */}
              {totalSessions > 0 && (
                <div className="border-t pt-4 px-6">
                  <TablePagination
                    currentPage={currentPage}
                    pageSize={pageSize}
                    totalItems={totalSessions}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                    isLoading={isLoading}
                    itemName="sessions"
                    pageSizeOptions={[12, 24, 36, 48]}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <DeleteTrainingSessionModal
        isOpen={modals.delete.isOpen}
        onClose={modals.delete.closeModal}
        session={selectedSession}
        onSuccess={() => {
          setCurrentPage(1);
        }}
      />
      {/* Training session form dialog moved inside list */}
      <TrainingSessionFormDialog
        open={modals.sessions.isOpen}
        onOpenChange={modals.sessions.closeModal}
        sessionId={selectedSession?.id}
        onSuccess={() => {
          setCurrentPage(1);
          modals.sessions.closeModal();
          // refresh list
          refetch?.();
        }}
      />
    </>
  );
};

export default TrainingSessionsList;
