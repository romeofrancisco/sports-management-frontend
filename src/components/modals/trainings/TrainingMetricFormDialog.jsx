import React from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  useCreateTrainingMetric,
  useUpdateTrainingMetric,
} from "@/hooks/useTrainings";
import { useMetricUnits } from "@/hooks/useMetricUnits";
import ControlledInput from "@/components/common/ControlledInput";
import ControlledTextarea from "@/components/common/ControlledTextarea";
import ControlledCombobox from "@/components/common/ControlledCombobox";
import ControlledSwitch from "@/components/common/ControlledSwitch";

/**
 * Dialog component for creating or editing a training metric
 */
const TrainingMetricFormDialog = ({
  open,
  onOpenChange,
  metric,
  categories = [],
}) => {
  const { mutateAsync: createMetric, isPending: isCreating } =
    useCreateTrainingMetric();
  const { mutateAsync: updateMetric, isPending: isUpdating } =
    useUpdateTrainingMetric();
  const { data: availableUnits = [] } = useMetricUnits();

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      metric_unit: "",
      category: categories.length > 0 ? categories[0].id : "",
      is_lower_better: false,
      weight: 1.0,
    },
  });

  React.useEffect(() => {
    if (open) {
      if (metric) {
        form.reset({
          name: metric.name || "",
          description: metric.description || "",
          metric_unit: metric.metric_unit?.id || "",
          category: metric.category || "",
          is_lower_better: metric.is_lower_better ?? false,
          weight: metric.weight || 1.0,
        });
      } else {
        form.reset({
          name: "",
          description: "",
          metric_unit: availableUnits.length > 0 ? availableUnits[0].id : "",
          category: categories.length > 0 ? categories[0].id : "",
          is_lower_better: false,
          weight: 1.0,
        });
      }
    }
  }, [metric, categories, availableUnits, form, open]);

  const onSubmit = async (data) => {
    try {
      if (metric) {
        await updateMetric({
          id: metric.id,
          ...data,
        });
        // Toast notification is handled by the mutation
      } else {
        await createMetric(data);
        // Toast notification is handled by the mutation
      }
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${metric ? "update" : "create"} metric: ${
          error.message
        }`,
        variant: "destructive",
      });
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            {metric ? "Edit" : "Create"} Training Metric
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <ControlledInput
            name="name"
            control={form.control}
            label="Name"
            placeholder="E.g., Sprint time"
            rules={{ required: "Metric name is required" }}
            errors={form.formState.errors}
          />

          <ControlledTextarea
            name="description"
            control={form.control}
            label="Description"
            placeholder="A brief description of this metric"
            errors={form.formState.errors}
          />

          <div className="flex flex-col sm:flex-row gap-4">
            <ControlledCombobox
              name="metric_unit"
              control={form.control}
              label="Unit"
              placeholder="Select unit"
              options={availableUnits}
              rules={{ required: "Unit is required" }}
              errors={form.formState.errors}
              className="flex-1"
              valueKey="id"
              labelKey="name"
              description={(unit) => `${unit.code} (weight: ${unit.normalization_weight})`}
            />
            <ControlledCombobox
              name="category"
              control={form.control}
              label="Category"
              placeholder="Select category"
              options={categories}
              rules={{ required: "Category is required" }}
              errors={form.formState.errors}
              className="flex-1"
              valueKey="id"
              labelKey="name"
            />
          </div>

          <ControlledSwitch
            name="is_lower_better"
            control={form.control}
            label="Lower Value is Better"
            help_text="E.g., for time metrics, lower is better"
            errors={form.formState.errors}
          />

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isCreating || isUpdating}
              className="w-full sm:w-auto order-1 sm:order-2"
            >
              {metric ? "Update" : "Create"} Metric
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TrainingMetricFormDialog;
