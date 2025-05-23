import React, { useState, useEffect } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "../../ui/button";
import {
  useTrainingSessions,
  useTrainingMetrics,
  useSessionMetrics,
  useAssignSessionMetrics,
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
  };
  const { data, isLoading, isError } = useTrainingSessions(
    filter,
    currentPage,
    pageSize
  );
  const { data: metrics = [], isLoading: metricsLoading } =
    useTrainingMetrics();
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
    onConfigureMetrics: (session) => {
      setSelectedSession(session);
      modals.metricsConfig.openModal();
    },
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

    window.addEventListener(
      "configureSessionMetrics",
      handleConfigureSessionMetrics
    );
    window.addEventListener(
      "configurePlayerMetrics",
      handleConfigurePlayerMetrics
    );

    return () => {
      window.removeEventListener(
        "configureSessionMetrics",
        handleConfigureSessionMetrics
      );
      window.removeEventListener(
        "configurePlayerMetrics",
        handleConfigurePlayerMetrics
      );
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
        sessionMetrics={sessionMetrics}
        onSelectPlayer={(player) => {
          setSelectedPlayerTraining(player);
          modals.playerSelect.closeModal();
          // Add a small delay before opening the metrics modal
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
    </div>
  );
};

export default TrainingSessionsList;
