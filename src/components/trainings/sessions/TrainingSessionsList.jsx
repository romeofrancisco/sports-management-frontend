import React, { useState } from "react";
import { PlusIcon, Table2, LayoutGrid, Target } from "lucide-react";
import { Button } from "../../ui/button";
import { Badge } from "@/components/ui/badge";
import {
  useTrainingSessions,
  useStartTrainingSession,
  useEndTrainingSession,
} from "@/hooks/useTrainings";
import DataTable from "@/components/common/DataTable";
import TablePagination from "@/components/ui/table-pagination";
import getTrainingSessionTableColumns from "../../table_columns/TrainingSessionTableColumns";
import TrainingSessionCard from "./TrainingSessionCard";
import { useModal } from "@/hooks/useModal";
import DeleteTrainingSessionModal from "@/components/modals/trainings/DeleteTrainingSessionModal";
import TrainingAttendanceModal from "@/components/modals/trainings/TrainingAttendanceModal";
import PlayerMetricRecordModal from "@/components/modals/PlayerMetricRecordModal";
import PlayerSelectModal from "@/components/modals/trainings/PlayerSelectModal";
import SessionMetricsConfigModal from "@/components/trainings/metrics/SessionMetricsConfigModal";
import { toast } from "sonner";

const TrainingSessionsList = ({ coachId, onNewSession, onEditSession }) => {
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedPlayerTraining, setSelectedPlayerTraining] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [viewMode, setViewMode] = useState("cards"); // "table" or "cards"
  const [filter, setFilter] = useState({ search: "", team: "", date: "" });
  const modals = {
    delete: useModal(),
    attendance: useModal(),
    metrics: useModal(),
    playerSelect: useModal(),
    metricsConfig: useModal(),
  };
  const { data, isLoading, isError, refetch } = useTrainingSessions(
    filter,
    currentPage,
    pageSize
  );
  const { mutate: startTraining, isPending: isStartingTraining } =
    useStartTrainingSession();
  const { mutate: endTraining, isPending: isEndingTraining } =
    useEndTrainingSession();

  const sessions = data?.results || [];
  const totalSessions = data?.count || 0;
  // Function to refresh session data and return updated session
  const handleDataRefresh = async () => {
    try {
      await refetch();

      // Also refetch the detailed session data if we have a selectedSession
      if (selectedSession?.id) {
        const { fetchTrainingSession } = await import("@/api/trainingsApi");
        const updatedSession = await fetchTrainingSession(selectedSession.id);
        setSelectedSession(updatedSession);
        return updatedSession;
      }
    } catch (error) {
      console.error("Error refreshing session data:", error);
    }
  };
  // Function to handle start training session
  const handleStartTraining = async (session) => {
    try {
      await startTraining(session.id, {
        onSuccess: () => {
          // Refresh the sessions data to reflect the status change
          refetch();
        },
      });
    } catch (error) {
      console.error("Error starting training session:", error);
    }
  };

  // Function to handle end training session
  const handleEndTraining = async (session) => {
    try {
      await endTraining(session.id, {
        onSuccess: () => {
          // Refresh the sessions data to reflect the status change
          refetch();
        },
      });
    } catch (error) {
      console.error("Error ending training session:", error);
    }
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
    );  const columns = getTrainingSessionTableColumns({
    onEdit: (session) => onEditSession?.(session),
    onDelete: (session) => {
      setSelectedSession(session);
      modals.delete.openModal();
    },
    onAttendance: (session) => {
      setSelectedSession(session);
      modals.attendance.openModal();
    },
    onConfigureMetrics: (session) => {
      setSelectedSession(session);
      modals.metricsConfig.openModal();
    },
    onStartTraining: handleStartTraining,
    onEndTraining: handleEndTraining,
    onRecord: async (session) => {
      try {
        setSelectedSession(session);
        const { fetchTrainingSession } = await import("@/api/trainingsApi");
        const detailedSession = await fetchTrainingSession(session.id);

        // Update the session with player records
        setSelectedSession(detailedSession);
        modals.playerSelect.openModal();
      } catch (error) {
        console.error("Error fetching session details:", error);
        toast.error("Failed to load session details", {
          description: error.message || "Please try again",
        });
      }
    },
  });  return (
    <>
      {/* Enhanced Header with View Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 p-4 md:p-6">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-foreground">
            Sessions
          </h2>
          <div className="px-2 py-2 bg-primary/10 rounded-full flex">
            <span className="text-xs font-medium text-primary">
              {totalSessions} session{totalSessions !== 1 ? "s" : ""}
            </span>
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

      <div className="px-4 md:px-6 pb-4 md:pb-6">
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
                <div className="overflow-x-auto">
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
                        {filter.search || filter.team || filter.date
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
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {sessions.map((session, index) => (
                      <div
                        key={session.id}
                        className="animate-in fade-in-50 duration-500"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >                        <TrainingSessionCard
                          session={session}
                          onEdit={() => onEditSession?.(session)}
                          onDeleted={() => {
                            setCurrentPage(1);
                          }}
                          onAttendance={() => {
                            setSelectedSession(session);
                            modals.attendance.openModal();
                          }}
                          onConfigureMetrics={() => {
                            setSelectedSession(session);
                            modals.metricsConfig.openModal();
                          }}
                          onRecord={async () => {
                            try {
                              setSelectedSession(session);
                              const { fetchTrainingSession } =
                                await import("@/api/trainingsApi");
                              const detailedSession =
                                await fetchTrainingSession(session.id);
                              setSelectedSession(detailedSession);
                              modals.playerSelect.openModal();
                            } catch (error) {
                              console.error(
                                "Error fetching session details:",
                                error
                              );
                              toast.error(
                                "Failed to load session details",
                                {
                                  description:
                                    error.message || "Please try again",
                                }
                              );
                            }
                          }}
                          onStartTraining={() =>
                            handleStartTraining(session)
                          }
                          onEndTraining={() => handleEndTraining(session)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Pagination */}
            {totalSessions > 0 && (
              <div className="border-t mt-6 pt-4">
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
      </div>

      {/* Modals */}
      <DeleteTrainingSessionModal
        isOpen={modals.delete.isOpen}
        onClose={modals.delete.closeModal}
        session={selectedSession}
        onSuccess={() => {
          setCurrentPage(1);
        }}
      />
      <TrainingAttendanceModal
        isOpen={modals.attendance.isOpen}
        onClose={modals.attendance.closeModal}
        session={selectedSession}
        onSuccess={() => {
          setCurrentPage(1);
        }}
      />
      <PlayerMetricRecordModal
        isOpen={modals.metrics.isOpen}
        onClose={modals.metrics.closeModal}
        playerTraining={selectedPlayerTraining}
      />
      <PlayerSelectModal
        isOpen={modals.playerSelect.isOpen}
        onClose={modals.playerSelect.closeModal}
        players={selectedSession?.player_records || []}
        sessionMetrics={selectedSession?.metrics || []}
        selectedSession={selectedSession}
        onDataRefresh={handleDataRefresh}
        onSelectPlayer={(player) => {
          setSelectedPlayerTraining(player);
          modals.playerSelect.closeModal();
          setTimeout(() => {
            modals.metrics.openModal();
          }, 0);
        }}
      />
      <SessionMetricsConfigModal
        isOpen={modals.metricsConfig.isOpen}
        onClose={modals.metricsConfig.closeModal}
        session={selectedSession}
      />
    </>
  );
};

export default TrainingSessionsList;
