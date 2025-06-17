import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { BadgeInfo, Check, CheckCircle, Users } from "lucide-react";
import useAttendanceManagement from "./attendance/useAttendanceManagement";
import AttendanceWarningCard from "./attendance/AttendanceWarningCard";
import AttendanceStatistics from "./attendance/AttendanceStatistics";
import AttendanceTable from "./attendance/AttendanceTable";
import EmptyAttendanceState from "./attendance/EmptyAttendanceState";

const AttendanceManagement = ({ session, onSaveSuccess, workflowData }) => {  const {
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
      <CardHeader className="border-b-2 border-primary/20 shadow-lg py-5">
        <div className="flex items-center justify-between">
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

          {/* Compact Attendance Statistics */}
          <AttendanceStatistics attendanceStats={attendanceStats} />
        </div>

        <div className="mt-4 p-4 rounded-lg border border-primary/20 bg-primary/10">
          <p className="text-sm inline-flex items-center gap-1 leading-relaxed text-primary">
            <BadgeInfo className="size-4" /> Mark attendance for all players in
            this training session. Players can now see their assigned metrics in
            advance.
          </p>
        </div>
      </CardHeader>{" "}
      <CardContent className="space-y-6 flex flex-col h-full p-6 bg-background">
        {/* Date Warning Card */}
        <AttendanceWarningCard canMarkAttendance={canMarkAttendance} />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 flex-1">
          {/* Attendance Table with Quick Actions and Submit Section */}          <AttendanceTable
            control={control}
            handleStatusChange={handleStatusChange}
            handleNotesChange={handleNotesChange}
            canMarkAttendance={canMarkAttendance}
            isFormDisabled={isFormDisabled}
            formAttendanceStats={formAttendanceStats}
            isSubmitting={isSubmitting}
            sessionStatus={sessionStatus}
            getValues={getValues}
            setValue={setValue}
          />
        </form>
      </CardContent>
    </Card>
  );
};

export default AttendanceManagement;
