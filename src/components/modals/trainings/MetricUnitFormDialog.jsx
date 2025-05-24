import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateMetricUnit, useUpdateMetricUnit } from "@/hooks/useMetricUnits";
import MetricUnitForm from "@/components/trainings/MetricUnitForm";

const MetricUnitFormDialog = ({ open, onOpenChange, unit = null }) => {
  const { mutate: createUnit, isLoading: isCreating } = useCreateMetricUnit();
  const { mutate: updateUnit, isLoading: isUpdating } = useUpdateMetricUnit();
  
  const isLoading = isCreating || isUpdating;

  const handleSubmit = (data) => {
    const mutation = unit 
      ? () => updateUnit({ id: unit.id, ...data }, {
          onSuccess: () => onOpenChange(false)
        })
      : () => createUnit(data, {
          onSuccess: () => onOpenChange(false)
        });
    
    mutation();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {unit ? "Edit Metric Unit" : "Add Metric Unit"}
          </DialogTitle>
          <DialogDescription>
            {unit
              ? "Update details for this unit of measurement."
              : "Add a new unit of measurement for training metrics."}
          </DialogDescription>
        </DialogHeader>
        
        <MetricUnitForm
          unit={unit}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isLoading={isLoading}
          showActions={true}
        />
      </DialogContent>
    </Dialog>
  );
};

export default MetricUnitFormDialog;
