import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../ui/card";
import { ScrollArea } from "../../../../ui/scroll-area";
import { Button } from "../../../../ui/button";
import {
  ClipboardCheck,
  AlertCircle,
  CheckCircle2,
  PlayCircle,
  UserCheck,
  RotateCcw,
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
  getValues,
  setValue,
}) => {
  // Quick action handlers
  const handleMarkAllPresent = () => {
    const currentRecords = getValues("playerRecords");
    const updatedRecords = currentRecords.map((record) => ({
      ...record,
      attendance_status: "present",
    }));
    setValue("playerRecords", updatedRecords, {
      shouldValidate: true,
    });
    toast.success("All players marked as present");
  };

  const handleResetAll = () => {
    const currentRecords = getValues("playerRecords");
    const updatedRecords = currentRecords.map((record) => ({
      ...record,
      attendance_status: "pending",
    }));
    setValue("playerRecords", updatedRecords, {
      shouldValidate: true,
    });
    toast.success("All attendance reset to pending");
  };

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
        message: `${formAttendanceStats.pending} player(s) still marked as pending - must be resolved before proceeding`,
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
    <div className="animate-in fade-in-50 duration-500 delay-300 flex-1">
      <Card className="h-full bg-card border-2 border-primary/20 overflow-hidden gap-0 pb-0 flex flex-col">
        <CardHeader className="pb-4 bg-card border-b-2 border-primary/20">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-foreground">
              <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
                <ClipboardCheck className="h-5 w-5 text-primary" />
              </div>
              Player Attendance List
            </CardTitle>
            {/* Quick Actions */}{" "}
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!canMarkAttendance || isFormDisabled}
                onClick={handleMarkAllPresent}
                className="flex items-center gap-2 border-primary/20 hover:bg-primary/5 hover:border-primary/30"
              >
                <UserCheck className="h-4 w-4" />
                Mark All Present
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!canMarkAttendance || isFormDisabled}
                onClick={handleResetAll}
                className="flex items-center gap-2 border-primary/20 hover:bg-primary/5 hover:border-primary/30"
              >
                <RotateCcw className="h-4 w-4" />
                Reset All
              </Button>
            </div>
          </div>
        </CardHeader>
        {/* Table Content */}
        <CardContent className="p-0 flex-1 flex flex-col">
          <div className="flex-1">
            <div className="w-full">
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
            </div>
          </div>

          {/* Submit Section */}
          <div className="border-t">
            <div className="p-6">
              <div className="flex justify-between items-center">
                <div
                  className={`text-sm ${statusInfo.color} flex items-center gap-2`}
                >
                  {statusInfo.icon}
                  {statusInfo.message}
                </div>{" "}
                <Button
                  type="submit"
                  disabled={
                    !canMarkAttendance ||
                    isFormDisabled ||
                    isSubmitting ||
                    (formAttendanceStats && formAttendanceStats.pending > 0)
                  }
                  className="min-w-[180px] flex items-center gap-2 transition-all duration-300 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {getButtonContent()}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceTable;
