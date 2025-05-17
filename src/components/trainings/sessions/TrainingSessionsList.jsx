import React, { useState, useEffect } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "../../ui/button";
import { 
  useTrainingSessions, 
  useTrainingMetrics, 
  useSessionMetrics, 
  useAssignSessionMetrics,
  useAssignPlayerTrainingMetrics
} from "@/hooks/useTrainings";
import TrainingSessionFormDialog from "@/components/modals/trainings/TrainingSessionFormDialog";
import DataTable from "@/components/common/DataTable";
import TablePagination from "@/components/ui/table-pagination";
import getTrainingSessionTableColumns from "../../table_columns/TrainingSessionTableColumns";
import { useModal } from "@/hooks/useModal";
import DeleteTrainingSessionModal from "@/components/modals/trainings/DeleteTrainingSessionModal";
import TrainingAttendanceModal from "@/components/modals/trainings/TrainingAttendanceModal";
import PlayerMetricRecordModal from "@/components/modals/PlayerMetricRecordModal";
import PlayerSelectModal from "@/components/modals/trainings/PlayerSelectModal";
import SessionMetricsConfigModal from "@/components/trainings/metrics/SessionMetricsConfigModal";
import { toast } from "sonner";

const TrainingSessionsList = ({ coachId, teamId }) => {  
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedPlayerTraining, setSelectedPlayerTraining] = useState(null);
  const [sessionMetrics, setSessionMetrics] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filter, setFilter] = useState({ search: "", team: "", date: "" });
  const modals = {
    delete: useModal(),
    session: useModal(),
    attendance: useModal(),
    metrics: useModal(),
    playerSelect: useModal(),
    metricsConfig: useModal(),
  };  const { data, isLoading, isError } = useTrainingSessions(
    filter,
    currentPage,
    pageSize
  );
  const { metrics = [], isLoading: metricsLoading } = useTrainingMetrics();
  const { mutate: assignMetrics } = useAssignSessionMetrics();
  const { mutate: assignPlayerMetrics } = useAssignPlayerTrainingMetrics();
  const sessions = data?.results || [];
  const totalSessions = data?.count || 0;

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
      <div className="text-red-500 p-4">Error loading training sessions.</div>
    );
  const columns = getTrainingSessionTableColumns({
    onEdit: (session) => {
      setSelectedSession(session);
      modals.session.openModal();
    },
    onDelete: (session) => {
      setSelectedSession(session);
      modals.delete.openModal();
    },
    onAttendance: (session) => {
      setSelectedSession(session);
      modals.attendance.openModal();
    },
    onConfigureMetrics: async (session) => {
      setSelectedSession(session);
      // Fetch the metrics for this session
      try {
        const { fetchTrainingMetrics } = await import("@/api/trainingsApi");
        const sessionMetricsData = await fetchTrainingMetrics({ session: session.id });
        setSessionMetrics(sessionMetricsData || []);
        modals.metricsConfig.openModal();
      } catch (error) {
        console.error("Error fetching session metrics:", error);
        toast.error("Failed to load session metrics", {
          description: error.message || "Please try again",
          richColors: true
        });
      }
    },onRecord: async (session) => {
      try {
        // Store the selected session for later use
        setSelectedSession(session);
        
        // Import the API directly to avoid bundling issues
        const { fetchTrainingSession, fetchTrainingMetrics } = await import("@/api/trainingsApi");
        
        // Fetch detailed session data including player records
        const detailedSession = await fetchTrainingSession(session.id);

        // Fetch the metrics for this specific session
        try {
          const sessionMetricsData = await fetchTrainingMetrics({ session: session.id });
          setSessionMetrics(sessionMetricsData || []);
          
          // If no metrics for this session, show a warning
          if (!sessionMetricsData || sessionMetricsData.length === 0) {
            toast.warning("No metrics configured for this session", {
              description: "This session doesn't have any metrics configured. All available metrics will be shown.",
              richColors: true,
            });
          }
        } catch (metricsError) {
          console.error("Error fetching session metrics:", metricsError);
          // Fall back to all metrics if session-specific ones fail
          setSessionMetrics(metrics);
        }
        
        // Check if session has player records
        if (detailedSession?.player_records?.length > 0) {
          // Filter for players who are present or late
          const presentPlayers = detailedSession.player_records.filter(
            record => record.attendance_status === 'present' || record.attendance_status === 'late'
          );
          
          if (presentPlayers.length === 0) {
            // No present players to record metrics for
            toast.warning("No players marked as present or late for this session", {
              description: "Please update attendance first before recording metrics.",
              richColors: true,
            });
            return;
          }
          
          if (presentPlayers.length === 1) {
            // If only one player, select it automatically
            setSelectedPlayerTraining(presentPlayers[0]);
            modals.metrics.openModal();
          } else {
            // Set the player records for the select modal
            setSelectedSession({
              ...session,
              player_records: presentPlayers
            });
            modals.playerSelect.openModal();
          }        } else {
          // If no player records at all, guide user to mark attendance first
          toast.info("No attendance records found", {
            description: "Would you like to mark attendance for this training session now?",
            richColors: true,
            action: {
              label: "Mark Attendance",
              onClick: () => modals.attendance.openModal()
            }
          });
        }
      } catch (error) {
        console.error("Error fetching session details:", error);
        toast.error("Failed to load session details", {
          description: error.message || "Please try again",
          richColors: true
        });
      }
    }
  });

  // Event listeners for metrics configuration
  useEffect(() => {
    const handleConfigureSessionMetrics = (event) => {
      if (event.detail?.sessionId) {
        // Implement session metrics configuration logic if needed
        // This is already being handled in the TrainingSessionsList component
      }
    };

    const handleConfigurePlayerMetrics = (event) => {
      if (event.detail?.playerTrainingId) {
        // You could implement additional player-specific actions here
        // This is already being handled in the PlayerSelectModal
      }
    };

    window.addEventListener('configureSessionMetrics', handleConfigureSessionMetrics);
    window.addEventListener('configurePlayerMetrics', handleConfigurePlayerMetrics);

    return () => {
      window.removeEventListener('configureSessionMetrics', handleConfigureSessionMetrics);
      window.removeEventListener('configurePlayerMetrics', handleConfigurePlayerMetrics);
    };
  }, []);

  return (
    <div className="md:px-5 md:border md:bg-muted/30 md:p-5 lg:p-8 my-5 rounded-lg sm:max-w-[calc(100vw-5.5rem)] lg:max-w-[calc(100vw-5rem)]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Training Sessions</h2>
        <Button
          onClick={() => {
            setSelectedSession(null);
            modals.session.openModal();
          }}
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          New Session
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={sessions}
        loading={isLoading}
        className="text-xs md:text-sm"
        showPagination={false}
        pageSize={pageSize}
      />
      {totalSessions > 0 && (
        <TablePagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={totalSessions}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          isLoading={isLoading}
          itemName="sessions"
        />
      )}
      <TrainingSessionFormDialog
        open={modals.session.isOpen}
        onOpenChange={modals.session.closeModal}
        sessionId={selectedSession?.id}
        onSuccess={() => {
          setCurrentPage(1);
        }}
      />
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
      />      <PlayerMetricRecordModal
        isOpen={modals.metrics.isOpen}
        onClose={modals.metrics.closeModal}
        playerTraining={selectedPlayerTraining}
        metrics={sessionMetrics.length > 0 ? sessionMetrics : metrics}
      />      <PlayerSelectModal
        isOpen={modals.playerSelect.isOpen}
        onClose={modals.playerSelect.closeModal}
        players={selectedSession?.player_records || []}
        sessionMetrics={sessionMetrics}
        onSelectPlayer={(player) => {
          setSelectedPlayerTraining(player);
          modals.playerSelect.closeModal();
          modals.metrics.openModal();
        }}
        onConfigurePlayerMetrics={(player, metricIds) => {
          assignPlayerMetrics({
            playerTrainingId: player.id,
            metricIds: metricIds
          });
        }}
      />
      <SessionMetricsConfigModal
        isOpen={modals.metricsConfig.isOpen}
        onClose={modals.metricsConfig.closeModal}
        session={selectedSession}
        sessionMetrics={sessionMetrics}
        onSave={(metricIds) => {
          assignMetrics({
            sessionId: selectedSession.id,
            metricIds: metricIds
          });
        }}
      />
    </div>
  );
};

export default TrainingSessionsList;
