import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import ControlledInput from "../common/ControlledInput";
import ControlledTextarea from "../common/ControlledTextarea";
import {
  useCreateTrainingCategory,
  useUpdateTrainingCategory,
} from "@/hooks/useTrainings";
import { DialogFooter } from "../ui/dialog";
import { toast } from "sonner";

/**
 * Unified form component for creating or editing a training category
 * Can be used standalone or inside a dialog
 * 
 * @param {Object} category - Existing category object for edit mode (null for create)
 * @param {Function} onClose - Callback function when form is closed or completed
 * @param {Boolean} useDialogFooter - Whether to use DialogFooter component (for use in dialogs)
 */
const TrainingCategoryForm = ({ category = null, onClose, useDialogFooter = false }) => {
  const isEdit = Boolean(category);

  const { mutate: createCategory, isPending: isCreating } =
    useCreateTrainingCategory();
  const { mutate: updateCategory, isPending: isUpdating } =
    useUpdateTrainingCategory();
    
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      name: category?.name || "",
      description: category?.description || "",
    },
  });

  // Reset form when category changes (e.g. when switching between edit/create)
  useEffect(() => {
    reset({
      name: category?.name || "",
      description: category?.description || "",
    });
  }, [category, reset]);

  const isPending = isCreating || isUpdating;
  
  const onSubmit = (data) => {
    try {
      if (isEdit) {
        updateCategory(
          { id: category.id, ...data },
          {
            onSuccess: () => {
              onClose();
            },
            onError: (error) => {
              toast({
                title: "Error",
                description: `Failed to update category: ${error.message}`,
                variant: "destructive",
              });
            }
          }
        );
      } else {
        createCategory(data, {
          onSuccess: () => {
            onClose();
          },
          onError: (error) => {
            toast({
              title: "Error",
              description: `Failed to create category: ${error.message}`,
              variant: "destructive",
            });
          }
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isEdit ? "update" : "create"} category: ${error.message}`,
        variant: "destructive",
      });
    }
  };
  // Prepare form fields
  const formFields = (
    <>
      <ControlledInput
        control={control}
        name="name"
        label="Category Name"
        placeholder="Enter category name"
        rules={{ required: "Category name is required" }}
      />

      <ControlledTextarea
        control={control}
        name="description"
        label="Description"
        placeholder="Describe this training category"
      />
    </>
  );
  
  // Prepare buttons
  const actionButtons = (
    <>
      <Button type="button" variant="outline" onClick={onClose}>
        Cancel
      </Button>
      <Button type="submit" disabled={isPending}>
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isEdit ? "Update" : "Create"} Category
      </Button>
    </>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-1">
      {formFields}
      
      {useDialogFooter ? (
        <DialogFooter>
          {actionButtons}
        </DialogFooter>
      ) : (
        <div className="flex justify-end gap-2 pt-4">
          {actionButtons}
        </div>
      )}
    </form>
  );
};

export default TrainingCategoryForm;
