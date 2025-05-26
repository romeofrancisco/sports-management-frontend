import React from "react";
import {
  useCreateMetricUnit,
  useUpdateMetricUnit,
} from "../../../hooks/useMetricUnits";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../ui/dialog";
import MetricUnitForm from "../units/MetricUnitForm";
/**
 * Form dialog component for creating and editing metric units
 * Handles its own create/update mutations internally
 */
export const MetricUnitFormDialog = ({ open, onOpenChange, unit, onSuccess }) => {
  const createMutation = useCreateMetricUnit();
  const updateMutation = useUpdateMetricUnit();
  const handleSubmit = (data) => {
    if (unit) {
      // Update existing unit
      updateMutation.mutate({ id: unit.id, ...data }, {
        onSuccess: () => {
          onOpenChange(false);
          onSuccess?.();
        }
      });
    } else {
      // Create new unit
      createMutation.mutate(data, {
        onSuccess: () => {
          onOpenChange(false);
          onSuccess?.();
        }
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-lg sm:text-xl">
            {unit ? "Edit Metric Unit" : "Add Metric Unit"}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {unit
              ? "Update details for this unit of measurement."
              : "Add a new unit of measurement for training metrics."}
          </DialogDescription>
        </DialogHeader>

        <MetricUnitForm
          unit={unit}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isLoading={createMutation.isLoading || updateMutation.isLoading}
          showActions={true}
        />
      </DialogContent>
    </Dialog>
  );
};
