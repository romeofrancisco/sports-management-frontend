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
import { useDeleteFormula } from "@/hooks/useFormula";

const DeleteFormulaModal = ({ isOpen, onClose, formula }) => {
  const { mutate: deleteFormula, isPending } = useDeleteFormula();

  const handleDeleteFormula = () => {
    deleteFormula({ id: formula.id });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete formula
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
              <AlertDialogAction onClick={handleDeleteFormula}>
                Confirm
              </AlertDialogAction>
            </>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteFormulaModal;
