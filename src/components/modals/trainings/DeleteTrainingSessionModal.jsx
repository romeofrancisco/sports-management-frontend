import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteTrainingSession } from "@/hooks/useTrainings";
import DeleteModal from "@/components/common/DeleteModal";
import { formatShortDate } from "@/utils/formatDate";

const DeleteTrainingSessionModal = ({
  isOpen,
  onClose,
  session,
  onSuccess,
}) => {
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
    <DeleteModal
      open={isOpen}
      onOpenChange={onClose}
      onConfirm={handleDelete}
      loading={isLoading}
      title="Delete Training Session"
      description={`Are you sure you want to delete the training session "${
        session?.title
      }" scheduled on ${formatShortDate(
        session?.date
      )}? This action cannot be undone.`}
    />
  );
};

export default DeleteTrainingSessionModal;
