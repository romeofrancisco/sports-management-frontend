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
import { useDeleteSport } from "@/hooks/useSports";
import { Loader2, AlertTriangle } from "lucide-react";
import { Button } from "../ui/button";

const DeleteSportModal = ({ isOpen, onClose, sport }) => {
  const { mutate: deleteSport, isPending } = useDeleteSport();

  const handleDeleteSport = () => {
    deleteSport(sport.slug);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Delete Sport?
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Are you sure you want to delete <strong>{sport?.name}</strong>?
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-sm">
              <p className="text-amber-800">
                <strong>Note:</strong> If this sport has associated games or teams, it will be deactivated instead of deleted to preserve data integrity.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {isPending ? (
            <>
              <AlertDialogCancel disabled>Cancel</AlertDialogCancel>
              <AlertDialogAction disabled>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Please Wait
              </AlertDialogAction>
            </>
          ) : (
            <>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteSport}
                className="bg-destructive hover:bg-destructive/90"
              >
                Delete Sport
              </AlertDialogAction>
            </>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteSportModal;
