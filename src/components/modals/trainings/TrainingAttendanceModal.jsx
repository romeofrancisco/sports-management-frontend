import React, { useState, useEffect, useMemo } from "react";
import { Dialog, DialogContent, DialogTitle } from "../../ui/dialog";
import {
  useTrainingSession,
  useUpdatePlayerAttendance,
} from "@/hooks/useTrainings";
import DataTable from "../../common/DataTable";
import { useForm, Controller } from "react-hook-form";

import getAttendanceColumns from "../../table_columns/AttendanceTableColumns";
import { ScrollArea } from "../../ui/scroll-area";
import { Button } from "../../ui/button";

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
      <DialogContent className="w-[95vw] max-w-[800px] p-0 overflow-hidden flex flex-col">
        <DialogTitle className="px-4 sm:px-6 pt-4 sm:pt-6 text-lg sm:text-xl">
          Training Attendance
        </DialogTitle>
        {isLoading ? (
          <div className="py-8 text-center">Loading player records...</div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
            <div className="flex-1 px-4 sm:px-6 overflow-hidden">
              <ScrollArea className="h-[70vh]">
                <div className="w-full">
                  <Controller
                    control={control}
                    name="playerRecords"
                    render={({ field }) => {
                      // Use a memoized version of the attendance columns to prevent re-renders
                      const memoizedColumns = React.useMemo(
                        () => getAttendanceColumns(handleStatusChange, handleNotesChange),
                        [handleStatusChange, handleNotesChange]
                      );
                      
                      return (
                        <div className="overflow-x-auto">
                          <DataTable
                            columns={memoizedColumns}
                            data={field.value || []}
                            className="text-xs sm:text-sm"
                            showPagination={false}
                            tableClassName="min-w-full"
                            headerClassName="bg-gray-50 sticky top-0 z-10"
                            rowClassName="hover:bg-gray-100"
                          />
                        </div>
                      );
                    }}
                  />
                </div>
              </ScrollArea>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 p-4 sm:p-6 border-t mt-5 justify-end">
              <Button 
                type="button" 
                onClick={onClose} 
                variant="outline"
                className="w-full sm:w-auto order-2 sm:order-1"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full sm:w-auto order-1 sm:order-2"
              >
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
