import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TrainingCategoryForm from "@/components/forms/TrainingCategoryForm";

/**
 * Dialog component for creating or editing a training category
 * This is now a thin wrapper around the TrainingCategoryForm component
 */
const TrainingCategoryFormDialog = ({ open, onOpenChange, category }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            {category ? "Edit" : "Create"} Training Category
          </DialogTitle>
        </DialogHeader>
        <TrainingCategoryForm 
          category={category} 
          onClose={() => onOpenChange(false)} 
          useDialogFooter={true} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default TrainingCategoryFormDialog;
