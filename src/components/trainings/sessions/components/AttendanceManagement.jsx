import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import {
  BadgeInfo,
  Check,
  CheckCircle,
  Users,
  UserCheck,
  RotateCcw,
} from "lucide-react";
import { Button } from "../../../ui/button";
import { toast } from "sonner";
import useAttendanceManagement from "./attendance/useAttendanceManagement";
import AttendanceWarningCard from "./attendance/AttendanceWarningCard";
import AttendanceStatistics from "./attendance/AttendanceStatistics";
import AttendanceTable from "./attendance/AttendanceTable";
import EmptyAttendanceState from "./attendance/EmptyAttendanceState";

const AttendanceManagement = ({ session, onSaveSuccess, workflowData }) => {
  const {
    trainingSession,
    attendanceStats,
    formAttendanceStats,
    sessionStatus,
    isLoading,
    isSubmitting,
    canMarkAttendance,
    isFormDisabled,
    control,
    handleSubmit,
    getValues,
    setValue,
    handleStatusChange,
    handleNotesChange,
    onSubmit,
  } = useAttendanceManagement(session, onSaveSuccess, workflowData);

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

  if (isLoading) {
    return <div className="py-8 text-center">Loading player records...</div>;
  }

  if (
    !trainingSession?.player_records ||
    trainingSession.player_records.length === 0
  ) {
    return <EmptyAttendanceState />;
  }
  return (
    <Card className="h-full pt-0 gap-0 flex flex-col shadow-xl border-2 border-primary/20 bg-card transition-all duration-300 hover:shadow-2xl animate-in fade-in-50 duration-500 overflow-hidden">
      <CardHeader className=" border-b-2 border-primary/20 shadow-lg p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary text-primary-foreground">
              <Users className="size-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                Attendance Management
              </h2>
              <p className="text-sm font-normal">
                Step 3 of training session setup
              </p>
            </div>
          </div>
          {/* Quick Actions */}
          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!canMarkAttendance || isFormDisabled}
              onClick={handleMarkAllPresent}
              className="flex-1"
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

        <div className="mt-4 p-4 rounded-lg border border-primary/20 bg-primary/10">
          <p className="text-sm inline-flex items-center gap-1 leading-relaxed text-primary">
            <BadgeInfo className="size-4" /> Mark attendance for all players in
            this training session. Players can now see their assigned metrics in
            advance.
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 flex flex-col h-full p-0 bg-background">
        {/* Date Warning Card */}
        <AttendanceWarningCard canMarkAttendance={canMarkAttendance} />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 flex-1">
          {/* Attendance Table with Quick Actions and Submit Section */}
          <AttendanceTable
            control={control}
            handleStatusChange={handleStatusChange}
            handleNotesChange={handleNotesChange}
            canMarkAttendance={canMarkAttendance}
            isFormDisabled={isFormDisabled}
            formAttendanceStats={formAttendanceStats}
            isSubmitting={isSubmitting}
            sessionStatus={sessionStatus}
          />
        </form>
      </CardContent>
    </Card>
  );
};

export default AttendanceManagement;
