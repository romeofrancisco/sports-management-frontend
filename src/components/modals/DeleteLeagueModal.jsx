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
import { useDeleteLeague } from "@/hooks/useLeagues";

const DeleteLeagueModal = ({ isOpen, onClose, league }) => {
  const { mutate: deleteLeague, isPending } = useDeleteLeague();

  const handleDeleteLeague = () => {
    deleteLeague({id: league.id});
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete League
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
              <AlertDialogAction onClick={handleDeleteLeague}>
                Confirm
              </AlertDialogAction>
            </>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteLeagueModal;
