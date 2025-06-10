import React, { useState, useEffect, useMemo } from "react";
import {
  useTrainingSession,
  useUpdatePlayerAttendance,
  useStartTrainingSession,
} from "@/hooks/useTrainings";
import DataTable from "../../../common/DataTable";
import { useForm, Controller, useWatch } from "react-hook-form";
import getAttendanceColumns from "../../../table_columns/AttendanceTableColumns";
import { ScrollArea } from "../../../ui/scroll-area";
import { Button } from "../../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { Badge } from "../../../ui/badge";
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  AlertCircle,
  CheckCircle2,
  ClipboardCheck,
  BarChart3,
  PlayCircle,
} from "lucide-react";
import { toast } from "sonner";

const AttendanceManagement = ({ session, onSaveSuccess }) => {
  const { data: trainingSession, isLoading } = useTrainingSession(session?.id);
  const {
    mutate: updatePlayerAttendance,
    isError,
    error,
  } = useUpdatePlayerAttendance();
  const { mutate: startTraining, isPending: isStartingTraining } =
    useStartTrainingSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get session status to determine if we should show start training button
  const getSessionStatus = () => {
    if (session?.status) {
      return session.status;
    }

    // Fallback to client-side calculation
    const now = new Date();
    const sessionStart = new Date(`${session.date}T${session.start_time}`);
    const sessionEnd = new Date(`${session.date}T${session.end_time}`);

    if (now < sessionStart) {
      return "upcoming";
    } else if (now >= sessionStart && now <= sessionEnd) {
      return "ongoing";
    } else {
      return "completed";
    }
  };

  const sessionStatus = getSessionStatus();
  // Use react-hook-form for player records
  const { control, handleSubmit, reset, getValues, setValue } = useForm({
    defaultValues: {
      playerRecords: [],
    },
  });

  // Watch the playerRecords for real-time updates
  const watchedPlayerRecords = useWatch({
    control,
    name: "playerRecords",
    defaultValue: [],
  });

  // Sync form with fetched data
  useEffect(() => {
    if (trainingSession?.player_records) {
      reset({ playerRecords: trainingSession.player_records });
    }
  }, [trainingSession, reset]);

  // Handler for status change
  const handleStatusChange = (recordId, newStatus) => {
    const current = getValues("playerRecords");
    const updated = current.map((rec) =>
      rec.id === recordId ? { ...rec, attendance_status: newStatus } : rec
    );

    // Set values directly instead of using reset to avoid UI refresh
    setValue("playerRecords", updated, { shouldValidate: true });
  };

  // Handler for notes change that avoids losing focus
  const handleNotesChange = (recordId, newNotes) => {
    // Use a debounced update to avoid re-rendering during typing
    const current = getValues("playerRecords");
    const updated = current.map((rec) =>
      rec.id === recordId ? { ...rec, notes: newNotes } : rec
    );

    // Set values with shouldDirty: true but no validation to minimize re-renders
    setValue("playerRecords", updated, {
      shouldValidate: false,
      shouldDirty: true,
    });
  }; // Confirm handler: start training first then save attendance
  const onSubmit = (data) => {
    // Check if there are any pending players
    const pendingPlayers = data.playerRecords.filter(
      (record) => record.attendance_status === "pending"
    );

    if (pendingPlayers.length > 0) {
      toast.error(
        `Cannot save attendance: ${pendingPlayers.length} player(s) still marked as pending. Please mark all players as present, late, or absent.`
      );
      return;
    }

    setIsSubmitting(true);

    // Make sure the playerRecords contains all required fields for the backend
    const validRecords = data.playerRecords.map((record) => ({
      id: record.id,
      attendance_status: record.attendance_status || "pending",
      notes: record.notes || "",
    }));

    // If session is upcoming, start training first then save attendance
    if (sessionStatus === "upcoming") {
      startTraining(trainingSession?.id, {
        onSuccess: () => {
          // Now save attendance after training has started
          updatePlayerAttendance(
            {
              sessionId: trainingSession?.id,
              playerRecords: validRecords,
            },            {
              onSuccess: async () => {
                setIsSubmitting(false);

                // Auto-advance to next step after a small delay
                setTimeout(() => {
                  if (onSaveSuccess) {
                    onSaveSuccess();
                  }
                }, 100);
              },
              onError: (error) => {
                setIsSubmitting(false);
                console.error("Attendance update error:", error);
              },
            }
          );
        },
        onError: (error) => {
          setIsSubmitting(false);
          console.error("Training start error:", error);
        },
      });
    } else {
      // For ongoing or completed sessions, just save attendance
      updatePlayerAttendance(
        {
          sessionId: trainingSession?.id,
          playerRecords: validRecords,
        },        {
          onSuccess: async () => {
            setIsSubmitting(false);

            setTimeout(() => {
              if (onSaveSuccess) {
                onSaveSuccess();
              }
            }, 100);
          },
          onError: (error) => {
            setIsSubmitting(false);
            console.error("Attendance update error:", error);
          },
        }
      );
    }
  }; // Calculate attendance statistics from form data (reactive to changes)
  const formAttendanceStats = useMemo(() => {
    if (!watchedPlayerRecords || watchedPlayerRecords.length === 0) return null;

    const stats = watchedPlayerRecords.reduce((acc, record) => {
      const status = record.attendance_status || "pending";
      acc[status] = (acc[status] || 0) + 1;
      acc.total = (acc.total || 0) + 1;
      return acc;
    }, {});

    return stats;
  }, [watchedPlayerRecords]);

  // Calculate attendance statistics from API data (for display purposes)
  const getAttendanceStats = () => {
    if (!trainingSession?.player_records) return null;

    const stats = trainingSession.player_records.reduce((acc, record) => {
      const status = record.attendance_status || "pending";
      acc[status] = (acc[status] || 0) + 1;
      acc.total = (acc.total || 0) + 1;
      return acc;
    }, {});

    return stats;
  };

  const attendanceStats = getAttendanceStats();

  if (isLoading) {
    return <div className="py-8 text-center">Loading player records...</div>;
  }

  if (
    !trainingSession?.player_records ||
    trainingSession.player_records.length === 0
  ) {
    return (
      <div className="text-center py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Players Enrolled</h3>
            <p className="text-muted-foreground text-sm">
              No players are enrolled in this training session. Please check the
              session configuration or contact an administrator.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Instructions */}
      <div>
        <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
          <Users className="h-6 w-6" />
          Step 1: Mark Attendance
        </h2>
        <p className="text-muted-foreground">
          Mark attendance for all players in this training session. This
          information is required before configuring metrics and recording
          performance data.
        </p>
      </div>
      {/* Attendance Statistics */}
      {
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Attendance Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Total</span>
                </div>
                <div className="text-2xl font-bold">
                  {attendanceStats?.total || 0}
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <UserCheck className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Present</span>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {attendanceStats?.present || 0}
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-amber-600" />
                  <span className="text-sm font-medium">Late</span>
                </div>
                <div className="text-2xl font-bold text-amber-600">
                  {attendanceStats?.late || 0}
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <UserX className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium">Absent</span>
                </div>
                <div className="text-2xl font-bold text-red-600">
                  {attendanceStats?.absent || 0}
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium">Pending</span>
                </div>
                <div className="text-2xl font-bold text-orange-600">
                  {attendanceStats?.pending || 0}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      }
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const currentRecords = getValues("playerRecords");
                const updatedRecords = currentRecords.map((record) => ({
                  ...record,
                  attendance_status: "present",
                }));
                setValue("playerRecords", updatedRecords, {
                  shouldValidate: true,
                });
                toast.success("All players marked as present");
              }}
              className="flex items-center gap-2"
            >
              <UserCheck className="h-4 w-4" />
              Mark All Present
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const currentRecords = getValues("playerRecords");
                const updatedRecords = currentRecords.map((record) => ({
                  ...record,
                  attendance_status: "absent",
                }));
                setValue("playerRecords", updatedRecords, {
                  shouldValidate: true,
                });
                toast.success("All players marked as absent");
              }}
              className="flex items-center gap-2"
            >
              <UserX className="h-4 w-4" />
              Mark All Absent
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const currentRecords = getValues("playerRecords");
                const updatedRecords = currentRecords.map((record) => ({
                  ...record,
                  attendance_status: "pending",
                }));
                setValue("playerRecords", updatedRecords, {
                  shouldValidate: true,
                });
                toast.success("All attendance reset to pending");
              }}
              className="flex items-center gap-2"
            >
              <AlertCircle className="h-4 w-4" />
              Reset All{" "}
            </Button>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Attendance Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5" />
              Player Attendance List
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg">
              <ScrollArea className="h-[60vh]">
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
                            handleNotesChange
                          ),
                        [handleStatusChange, handleNotesChange]
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
              </ScrollArea>
            </div>
          </CardContent>
        </Card>{" "}
        {/* Submit Section */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {formAttendanceStats && formAttendanceStats.pending > 0 ? (
                  <div className="flex items-center gap-2 text-amber-600">
                    <AlertCircle className="h-4 w-4" />
                    {formAttendanceStats.pending} player(s) still marked as
                    pending - must be resolved before proceeding
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="h-4 w-4" />
                    All players have been marked
                  </div>
                )}
              </div>{" "}
              <Button
                type="submit"
                disabled={
                  isSubmitting ||
                  (formAttendanceStats && formAttendanceStats.pending > 0)
                }
                className={`min-w-[180px] flex items-center gap-2 ${
                  sessionStatus === "upcoming"
                    ? "bg-green-600 hover:bg-green-700"
                    : ""
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    {sessionStatus === "upcoming"
                      ? "Starting Training..."
                      : "Saving..."}
                  </>
                ) : formAttendanceStats && formAttendanceStats.pending > 0 ? (
                  <>
                    <AlertCircle className="h-4 w-4" />
                    Mark All Players
                  </>
                ) : (
                  <>
                    {sessionStatus === "upcoming" ? (
                      <>
                        <PlayCircle className="h-4 w-4" />
                        Save & Start Training
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        Save Attendance
                      </>
                    )}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default AttendanceManagement;
