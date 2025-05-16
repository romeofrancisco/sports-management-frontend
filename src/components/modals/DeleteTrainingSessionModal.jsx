import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteTrainingSession } from "@/hooks/useTrainings";

const DeleteTrainingSessionModal = ({ isOpen, onClose, session, onSuccess }) => {
  const { mutate: deleteSession, isLoading } = useDeleteTrainingSession();

  const handleDelete = () => {
    if (!session) return;
    deleteSession(session.id, {
      onSuccess: () => {
        onClose();
        if (onSuccess) onSuccess();
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <h3 className="text-lg font-semibold">Delete Training Session</h3>
        </DialogHeader>
        <div className="py-4">
          Are you sure you want to delete this training session?
          <div className="mt-2 text-muted-foreground text-sm">
            {session?.date} {session?.start_time} - {session?.end_time}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} loading={isLoading}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteTrainingSessionModal;
