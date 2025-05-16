import React, { useState } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "../../ui/button";
import { useTrainingSessions } from "@/hooks/useTrainings";
import TrainingSessionFormDialog from "../../modals/TrainingSessionFormDialog";
import DataTable from "@/components/common/DataTable";
import TablePagination from "@/components/ui/table-pagination";
import getTrainingSessionTableColumns from "./TrainingSessionTableColumns";
import { useModal } from "@/hooks/useModal";
import DeleteTrainingSessionModal from "@/components/modals/DeleteTrainingSessionModal";
import TrainingAttendanceModal from "@/components/modals/TrainingAttendanceModal";

const TrainingSessionsList = ({ coachId, teamId }) => {
  const [selectedSession, setSelectedSession] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filter, setFilter] = useState({ search: "", team: "", date: "" });

  const modals = {
    delete: useModal(),
    session: useModal(),
    attendance: useModal(),
  };

  const { data, isLoading, isError } = useTrainingSessions(
    filter,
    currentPage,
    pageSize
  );
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
  });

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
    </div>
  );
};

export default TrainingSessionsList;
