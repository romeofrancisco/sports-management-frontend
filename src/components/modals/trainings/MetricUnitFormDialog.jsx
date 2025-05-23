import React from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useCreateMetricUnit, useUpdateMetricUnit } from "@/hooks/useMetricUnits";
import ControlledInput from "@/components/common/ControlledInput";
import ControlledTextarea from "@/components/common/ControlledTextarea";

const MetricUnitFormDialog = ({ open, onOpenChange, unit = null }) => {
  const { mutate: createUnit, isLoading: isCreating } = useCreateMetricUnit();
  const { mutate: updateUnit, isLoading: isUpdating } = useUpdateMetricUnit();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm({
    defaultValues: {
      code: unit?.code || "",
      name: unit?.name || "",
      normalization_weight: unit?.normalization_weight || 1.0,
      description: unit?.description || "",
    },
  });

  const onSubmit = (data) => {
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

    if (unit) {
      updateUnit({ id: unit.id, ...data });
    } else {
      createUnit(data);
    }
    onOpenChange(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{unit ? "Edit Metric Unit" : "Add Metric Unit"}</DialogTitle>
          <DialogDescription>
            {unit
              ? "Update details for this unit of measurement."
              : "Add a new unit of measurement for training metrics."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <ControlledInput
            name="code"
            control={control}
            label="Code"
            placeholder="e.g. kg, cm, seconds, reps"
            maxLength={30}
            errors={errors}
          />

          <ControlledInput
            name="name"
            control={control}
            label="Name"
            placeholder="e.g. Kilograms, Centimeters"
            maxLength={100}
            errors={errors}
          />

          <ControlledInput
            name="normalization_weight"
            control={control}
            label="Normalization Weight"
            type="number"
            step="0.01"
            min="0.01"
            max="2"
            placeholder="1.0"
            help_text="Weight to normalize improvements. Use lower values (0.1-0.5) for metrics like reps that have large changes."
            errors={errors}
          />

          <ControlledTextarea
            name="description"
            control={control}
            label="Description"
            placeholder="Optional description of this unit"
            errors={errors}
          />

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isCreating || isUpdating}
            >
              {(isCreating || isUpdating) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {unit ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MetricUnitFormDialog;
