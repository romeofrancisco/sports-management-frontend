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
import { useLeaderCategories } from "@/hooks/useLeaderCategories";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const DeleteLeaderModal = ({ isOpen, onClose, leaderCategory }) => {
  const { deleteLeaderCategory } = useLeaderCategories();

  const handleDelete = async () => {
    if (!leaderCategory) return;

    try {
      // Use mutateAsync to properly handle async operation
      await deleteLeaderCategory.mutateAsync(leaderCategory.id);
      toast.success(`${leaderCategory.name} category deleted successfully`);
      onClose();
    } catch (error) {
      console.error("Error deleting leader category:", error);
      toast.error("Failed to delete leader category");
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Leader Category</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the "{leaderCategory?.name}" leader category?
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteLeaderCategory.isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteLeaderCategory.isPending}
            variant="destructive"
          >
            {deleteLeaderCategory.isPending ? (
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

export default DeleteLeaderModal;