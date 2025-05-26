import React, { useState } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "../../ui/button";
import { useTrainingSessions } from "@/hooks/useTrainings";
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
import {
  TabLayout,
  TabHeader,
  TabContent,
  TabCard,
} from "@/components/common/TabLayout";

const TrainingSessionsList = () => {
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedPlayerTraining, setSelectedPlayerTraining] = useState(null);
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

  const { data, isLoading, isError, refetch } = useTrainingSessions(
    filter,
    currentPage,
    pageSize
  );

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
    },    onRecord: async (session) => {
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

  return (
    <TabLayout>
      <TabHeader
        title="Training Sessions"
        description="Manage and track training sessions"
        actions={
          <Button
            onClick={() => {
              setSelectedSession(null);
              modals.session.openModal();
            }}
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            New Session
          </Button>
        }
      />

      <TabContent>
        <TabCard className="p-0">
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

          {/* Pagination */}
          {totalSessions > 0 && (
            <div className="border-t p-4">
              <TablePagination
                currentPage={currentPage}
                pageSize={pageSize}
                totalItems={totalSessions}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                isLoading={isLoading}
                itemName="sessions"
              />
            </div>
          )}
        </TabCard>
      </TabContent>
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
      />      <PlayerSelectModal
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
    </TabLayout>
  );
};

export default TrainingSessionsList;
