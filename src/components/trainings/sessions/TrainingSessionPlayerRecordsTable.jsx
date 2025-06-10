import React from "react";
import DataTable from "@/components/common/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Settings } from "lucide-react";
import { toast } from "sonner";

const attendanceStatusColor = {
  present: "bg-red-100 text-red-800",
  absent: "bg-rose-100 text-rose-800",
  late: "bg-amber-100 text-amber-800",
  excused: "bg-yellow-100 text-yellow-800",
  pending: "bg-orange-100 text-orange-800",
};

const columns = (onManage) => [
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
        <Badge
          className={
            attendanceStatusColor[value] || "bg-gray-100 text-gray-800"
          }
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
      );
    },
  },
  {
    header: "Notes",
    accessorKey: "notes",
    cell: ({ getValue }) =>
      getValue() || <span className="text-muted-foreground">-</span>,
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => (
      <Button
        size="sm"
        variant="outline"
        onClick={() => onManage(row.original)}
        className="flex items-center gap-2"
      >
        <Settings className="h-4 w-4" />
        Manage Session
      </Button>
    ),
  },
];

const TrainingSessionPlayerRecordsTable = ({ playerRecords, sessionId }) => {
  const navigate = useNavigate();

  const handleManage = (record) => {
    if (sessionId) {
      navigate(`/sessions/${sessionId}/manage/attendance`);
    } else {
      toast.error("Session information not available");
    }
  };

  return (
    <div className="rounded-lg border bg-background p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Player Attendance</h3>
        {sessionId && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/sessions/${sessionId}/manage/attendance`)}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Manage All Attendance
          </Button>
        )}
      </div>
      <DataTable
        columns={columns(handleManage)}
        data={playerRecords}
        className="text-xs md:text-sm"
        showPagination={false}
      />
    </div>
  );
};

export default TrainingSessionPlayerRecordsTable;
