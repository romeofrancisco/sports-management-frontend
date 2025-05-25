import React from "react";
import { useDeleteMetricUnit } from "../../../hooks/useMetricUnits";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Loader2 } from "lucide-react";

/**
 * Confirmation dialog for deleting metric units
 * Handles its own delete mutation internally
 */
export const DeleteConfirmDialog = ({ open, onOpenChange, unit, onSuccess }) => {
  const deleteMutation = useDeleteMetricUnit();  const handleDeleteConfirm = () => {
    if (!unit) return;
    
    deleteMutation.mutate(unit.id, {
      onSuccess: () => {
        onOpenChange(false);
        onSuccess?.();
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[400px]">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-lg sm:text-xl">Delete Metric Unit</DialogTitle>
          <DialogDescription className="text-sm">
            Are you sure you want to delete "{unit?.name}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-2 pt-4">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            disabled={deleteMutation.isLoading}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDeleteConfirm} 
            disabled={deleteMutation.isLoading}
            className="w-full sm:w-auto"
          >
            {deleteMutation.isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>  );
};
