import React, { useState, useEffect, useMemo } from "react";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import {
  useTrainingSession,
  useUpdatePlayerAttendance,
} from "@/hooks/useTrainings";
import DataTable from "../common/DataTable";
import { useForm, Controller } from "react-hook-form";

import getAttendanceColumns from "../table_columns/AttendanceTableColumns";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";

const TrainingAttendanceModal = ({ isOpen, onClose, session }) => {
  const { data: trainingSession, isLoading } = useTrainingSession(session?.id);
  const { mutate: updatePlayerAttendance, isError, error } = useUpdatePlayerAttendance();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use react-hook-form for player records
  const { control, handleSubmit, reset, getValues, setValue } = useForm({
    defaultValues: {
      playerRecords: [],
    },
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
      shouldDirty: true 
    });
  };

  // Confirm handler: send updated records to backend
  const onSubmit = (data) => {
    setIsSubmitting(true);
    
    // Make sure the playerRecords contains all required fields for the backend
    const validRecords = data.playerRecords.map((record) => ({
      id: record.id,
      attendance_status: record.attendance_status || "pending",
      notes: record.notes || "",
    }));

    console.log("Sending attendance update:", {
      sessionId: trainingSession?.id,
      playerRecords: validRecords,
    });

    // Close modal only after successful submission
    updatePlayerAttendance(
      {
        sessionId: trainingSession?.id,
        playerRecords: validRecords,
      },
      {
        onSuccess: () => {
          setIsSubmitting(false);
          onClose();
        },
        onError: () => {
          setIsSubmitting(false);
        }
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] w-full p-0 overflow-hidden">
        <DialogTitle className="px-6 pt-6">Training Attendance</DialogTitle>
        {isLoading ? (
          <div className="py-4 text-center">Loading player records...</div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="overflow-hidden">
            <div className="px-6">
              <ScrollArea className="max-h-[60vh] overflow-auto">
                <div className="w-full overflow-x-hidden">              <Controller
                control={control}
                name="playerRecords"
                render={({ field }) => {
                  // Use a memoized version of the attendance columns to prevent re-renders
                  const memoizedColumns = React.useMemo(
                    () => getAttendanceColumns(handleStatusChange, handleNotesChange),
                    [handleStatusChange, handleNotesChange]
                  );
                  
                  return (
                    <DataTable
                      columns={memoizedColumns}
                      data={field.value || []}
                      className="text-xs md:text-sm"
                      showPagination={false}
                      tableClassName="min-w-full border-separate border-spacing-0 table-fixed"
                      headerClassName="bg-gray-50 sticky top-0 z-10"
                      rowClassName="hover:bg-gray-100"
                    />
                  );
                }}
                  />
                </div>
              </ScrollArea>
            </div>
            <div className="flex flex-row gap-3 mt-6 justify-end p-6 pt-4 border-t">
              <Button type="button" onClick={onClose} variant="outline">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TrainingAttendanceModal;
