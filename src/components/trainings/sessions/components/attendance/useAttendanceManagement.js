import { useState, useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  useTrainingSession,
  useUpdatePlayerAttendance,
  useStartTrainingSession,
} from "@/hooks/useTrainings";
import { toast } from "sonner";

const useAttendanceManagement = (session, onSaveSuccess, workflowData) => {
  const { data: trainingSession, isLoading } = useTrainingSession(session?.id);
  const {
    mutate: updatePlayerAttendance,
    isError,
    error,
  } = useUpdatePlayerAttendance();
  const { mutate: startTraining, isPending: isStartingTraining } =
    useStartTrainingSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get attendance step data from workflow
  const attendanceStep = workflowData?.steps?.find(step => step.id === 'attendance');
  const canMarkAttendance = attendanceStep?.canMarkAttendance ?? true;
  const isFormDisabled = attendanceStep?.isFormDisabled ?? false;

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
  };

  // Submit handler: start training first then save attendance
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
            },
            {
              onSuccess: async () => {
                setIsSubmitting(false);

                // Auto-advance to next step after a small delay to allow data refresh
                setTimeout(() => {
                  if (onSaveSuccess) {
                    onSaveSuccess();
                  }
                }, 500); // Increased delay to ensure data is refreshed
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
        },
        {
          onSuccess: async () => {
            setIsSubmitting(false);

            // Auto-advance to next step after a small delay to allow data refresh
            setTimeout(() => {
              if (onSaveSuccess) {
                onSaveSuccess();
              }
            }, 500); // Increased delay to ensure data is refreshed
          },
          onError: (error) => {
            setIsSubmitting(false);
            console.error("Attendance update error:", error);
          },
        }
      );
    }
  };

  // Calculate attendance statistics from form data (reactive to changes)
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
  return {
    // Data
    trainingSession,
    attendanceStats,
    formAttendanceStats,
    sessionStatus,
    isLoading,
    isSubmitting,
    canMarkAttendance,
    isFormDisabled,
    
    // Form methods
    control,
    handleSubmit,
    getValues,
    setValue,
    
    // Handlers
    handleStatusChange,
    handleNotesChange,
    onSubmit,
  };
};

export default useAttendanceManagement;
