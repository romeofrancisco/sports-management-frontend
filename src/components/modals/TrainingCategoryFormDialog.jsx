import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import TrainingCategoryForm from "../forms/TrainingCategoryForm";

/**
 * Dialog component for creating or editing a training category
 * This is now a thin wrapper around the TrainingCategoryForm component
 */
const TrainingCategoryFormDialog = ({ open, onOpenChange, category }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
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
