import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeletePosition } from "@/hooks/useSports";
import { Loader2 } from "lucide-react";

const DeletePositionModal = ({ isOpen, onClose, position }) => {
  const deletePosition = useDeletePosition();

  const handleDelete = () => {
    if (!position) return;

    deletePosition.mutate(position.id, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Position</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the "{position?.name}" position?
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deletePosition.isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deletePosition.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deletePosition.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeletePositionModal;
