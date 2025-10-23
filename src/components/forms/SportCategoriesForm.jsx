import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router";
import { useCreateCategory, useUpdateCategory } from "@/hooks/useStats";
import { Loader2 } from "lucide-react";
import ControlledInput from "../common/ControlledInput";
import ControlledTextarea from "../common/ControlledTextarea";
import { useSports } from "@/hooks/useSports";

const SportCategoriesForm = ({ category = null, onClose }) => {
  const { sport } = useParams();
  const isEdit = !!category;

  const { mutate: createCategory, isPending: isCreating } = useCreateCategory();
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();

  const isPending = isCreating || isUpdating;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: category?.name || "",
      description: category?.description || "",
      sport_slug: sport,
    },
  });

  const onSubmit = (data) => {
    const categoryData = {
      id: category?.id,
      ...data,
    };

    if (isEdit) {
      updateCategory(
        { id: category.id, data: categoryData },
        {
          onSuccess: () => {
            reset();
            onClose();
          },
        }
      );
    } else {
      createCategory(categoryData, {
        onSuccess: () => {
          reset();
          onClose();
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 px-1">
      {/* Category Name */}
      <ControlledInput
        name="name"
        control={control}
        label="Category Name"
        placeholder="e.g., Offensive, Defensive, Performance"
        rules={{
          required: "Category name is required",
          minLength: {
            value: 2,
            message: "Category name must be at least 2 characters",
          },
        }}
        errors={errors}
        required
      />

      {/* Description */}
      <ControlledTextarea
        name="description"
        control={control}
        label="Description"
        placeholder="Brief description of this category (optional)"
        rows={3}
        className=""
        errors={errors}
      />

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending} className="min-w-[100px]">
          {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {isEdit ? "Update" : "Create"} Category
        </Button>
      </div>
    </form>
  );
};

export default SportCategoriesForm;
