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
import { Loader2 } from "lucide-react";
import { useDeleteSeason } from "@/hooks/useSeasons";

const DeleteSeasonModal = ({ isOpen, onClose, season }) => {
  const { mutate: deleteSeason, isPending } = useDeleteSeason();

  const handleDeleteSeason = () => {
    deleteSeason(
      { seasonId: season.id, leagueId: season.league },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete season
            and its data
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {isPending ? (
            <>
              <AlertDialogCancel disabled>Cancel</AlertDialogCancel>
              <AlertDialogAction disabled>
                <Loader2 className="animate-spin" />
                Please Wait
              </AlertDialogAction>
            </>
          ) : (
            <>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteSeason}>
                Confirm
              </AlertDialogAction>
            </>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteSeasonModal;
