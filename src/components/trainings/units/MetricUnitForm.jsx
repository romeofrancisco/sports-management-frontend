import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import ControlledInput from "@/components/common/ControlledInput";
import ControlledTextarea from "@/components/common/ControlledTextarea";

/**
 * Reusable form component for creating and editing metric units
 * Can be used standalone or within dialogs/modals
 */
const MetricUnitForm = ({ 
  unit = null, 
  onSubmit, 
  onCancel, 
  isLoading = false,
  showActions = true,
  className = ""
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm({
    defaultValues: {
      code: "",
      name: "",
      normalization_weight: 1.0,
      description: "",
    },
  });

  // Update form values when unit prop changes
  useEffect(() => {
    const formData = {
      code: unit?.code || "",
      name: unit?.name || "",
      normalization_weight: unit?.normalization_weight || 1.0,
      description: unit?.description || "",
    };
    reset(formData);
  }, [unit, reset]);

  const handleFormSubmit = (data) => {
    // Validate required fields
    if (!data.code.trim() || !data.name.trim()) {
      if (!data.code.trim()) {
        setError("code", { type: "required", message: "Code is required" });
      }
      if (!data.name.trim()) {
        setError("name", { type: "required", message: "Name is required" });
      }
      return;
    }

    // Validate normalization weight
    const weight = parseFloat(data.normalization_weight);
    if (isNaN(weight) || weight < 0.01 || weight > 2) {
      setError("normalization_weight", {
        type: "range",
        message: "Weight must be between 0.01 and 2",
      });
      return;
    }

    // Call the parent's onSubmit with processed data
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={className}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="code" className="text-right text-sm font-medium">
            Code
          </label>
          <div className="col-span-3">
            <ControlledInput
              name="code"
              control={control}
              placeholder="e.g. kg, cm, seconds, reps"
              maxLength={30}
              rules={{
                required: "Code is required",
                validate: (value) => value.trim() !== "" || "Code cannot be empty"
              }}
            />
            {errors.code && (
              <p className="text-sm text-destructive mt-1">{errors.code.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="name" className="text-right text-sm font-medium">
            Name
          </label>
          <div className="col-span-3">
            <ControlledInput
              name="name"
              control={control}
              placeholder="e.g. Kilograms, Centimeters"
              maxLength={100}
              rules={{
                required: "Name is required",
                validate: (value) => value.trim() !== "" || "Name cannot be empty"
              }}
            />
            {errors.name && (
              <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="normalization_weight" className="text-right text-sm font-medium">
            Weight
          </label>
          <div className="col-span-3">
            <ControlledInput
              name="normalization_weight"
              control={control}
              type="number"
              step="0.01"
              min="0.01"
              max="2"
              placeholder="1.0"
              rules={{
                required: "Weight is required",
                min: { value: 0.01, message: "Weight must be at least 0.01" },
                max: { value: 2, message: "Weight must be at most 2" }
              }}
            />
            {errors.normalization_weight && (
              <p className="text-sm text-destructive mt-1">{errors.normalization_weight.message}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Lower values (0.1-0.5) for metrics with large percentage changes
            </p>
          </div>
        </div>

        <div className="grid grid-cols-4 items-start gap-4">
          <label htmlFor="description" className="text-right text-sm font-medium mt-2">
            Description
          </label>
          <div className="col-span-3">
            <ControlledTextarea
              name="description"
              control={control}
              placeholder="Description of this unit"
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
            )}
          </div>
        </div>
      </div>

      {showActions && (
        <div className="flex justify-end gap-2 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      )}
    </form>
  );
};

export default MetricUnitForm;
