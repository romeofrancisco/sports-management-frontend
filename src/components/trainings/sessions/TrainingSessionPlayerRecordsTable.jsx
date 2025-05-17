import React, { useState } from "react";
import DataTable from "@/components/common/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import TrainingAttendanceModal from "@/components/modals/trainings/TrainingAttendanceModal";

const attendanceStatusColor = {
  present: "bg-green-100 text-green-800",
  absent: "bg-red-100 text-red-800",
  late: "bg-yellow-100 text-yellow-800",
  excused: "bg-blue-100 text-blue-800",
  pending: "bg-gray-100 text-gray-800",
};

const columns = (onEdit) => [
  {
    header: "Player",
    accessorKey: "player_name",
  },
  {
    header: "Attendance",
    accessorKey: "attendance_status",
    cell: ({ getValue }) => {
      const value = getValue();
      return (
        <Badge className={attendanceStatusColor[value] || "bg-gray-100 text-gray-800"}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
      );
    },
  },
  {
    header: "Notes",
    accessorKey: "notes",
    cell: ({ getValue }) => getValue() || <span className="text-muted-foreground">-</span>,
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => (
      <Button size="sm" variant="outline" onClick={() => onEdit(row.original)}>
        Record Attendance
      </Button>
    ),
  },
];

const TrainingSessionPlayerRecordsTable = ({ playerRecords }) => {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setModalOpen(true);
  };

  return (
    <div className="rounded-lg border bg-background p-4">
      <h3 className="text-lg font-semibold mb-4">Player Attendance</h3>
      <DataTable columns={columns(handleEdit)} data={playerRecords} className="text-xs md:text-sm" showPagination={false} />
      <TrainingAttendanceModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        playerTraining={selectedRecord}
      />
    </div>
  );
};

export default TrainingSessionPlayerRecordsTable;
