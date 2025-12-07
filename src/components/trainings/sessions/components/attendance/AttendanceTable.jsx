import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../ui/card";
import { ScrollArea } from "../../../../ui/scroll-area";
import { Button } from "../../../../ui/button";
import {
  ClipboardCheck,
  AlertCircle,
  CheckCircle2,
  PlayCircle,
} from "lucide-react";
import { Controller } from "react-hook-form";
import DataTable from "../../../../common/DataTable";
import getAttendanceColumns from "../../../../table_columns/AttendanceTableColumns";
import { toast } from "sonner";

const AttendanceTable = ({
  control,
  handleStatusChange,
  handleNotesChange,
  canMarkAttendance,
  isFormDisabled,
  formAttendanceStats,
  isSubmitting,
  sessionStatus,
}) => {
  const getStatusMessage = () => {
    if (!canMarkAttendance) {
      return {
        color: "text-amber-600",
        icon: <AlertCircle className="h-4 w-4" />,
        message: "Attendance can only be marked on the session date",
      };
    }

    if (formAttendanceStats && formAttendanceStats.pending > 0) {
      return {
        color: "text-amber-600",
        icon: <AlertCircle className="h-4 w-4" />,
        message: `${formAttendanceStats.pending} player(s) still marked as pending`,
      };
    }

    return {
      color: "text-primary",
      icon: <CheckCircle2 className="h-4 w-4" />,
      message: "All players have been marked",
    };
  };

  const getButtonContent = () => {
    if (isSubmitting) {
      return (
        <>
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          {sessionStatus === "upcoming" ? "Starting Training..." : "Saving..."}
        </>
      );
    }

    if (!canMarkAttendance) {
      return (
        <>
          <AlertCircle className="h-4 w-4" />
          Not Session Date
        </>
      );
    }

    if (formAttendanceStats && formAttendanceStats.pending > 0) {
      return (
        <>
          <AlertCircle className="h-4 w-4" />
          Mark All Players
        </>
      );
    }

    if (sessionStatus === "upcoming") {
      return (
        <>
          <PlayCircle className="h-4 w-4" />
          Save & Start Training
        </>
      );
    }

    return (
      <>
        <CheckCircle2 className="h-4 w-4" />
        Save Attendance
      </>
    );
  };

  const statusInfo = getStatusMessage();
  return (
    <>
      <Controller
        control={control}
        name="playerRecords"
        render={({ field }) => {
          // Use a memoized version of the attendance columns to prevent re-renders
          const memoizedColumns = React.useMemo(
            () =>
              getAttendanceColumns(
                handleStatusChange,
                handleNotesChange,
                !canMarkAttendance || isFormDisabled
              ),
            [
              handleStatusChange,
              handleNotesChange,
              canMarkAttendance,
              isFormDisabled,
            ]
          );

          return (
            <DataTable
              columns={memoizedColumns}
              data={field.value || []}
              className="text-sm"
              showPagination={false}
              tableClassName="min-w-full"
              headerClassName="bg-muted/50 sticky top-0 z-10"
              rowClassName="hover:bg-muted/25"
            />
          );
        }}
      />

      {/* Submit Section */}

      <div className="flex flex-col md:flex-row gap-2 px-4 justify-between items-center">
        <div className={`text-sm ${statusInfo.color} flex items-center gap-2`}>
          {statusInfo.icon}
          {statusInfo.message}
        </div>
        <Button
          type="submit"
          disabled={
            !canMarkAttendance ||
            isFormDisabled ||
            isSubmitting ||
            (formAttendanceStats && formAttendanceStats.pending > 0)
          }
          className="w-full md:w-auto"
        >
          {getButtonContent()}
        </Button>
      </div>
    </>
  );
};

export default AttendanceTable;
