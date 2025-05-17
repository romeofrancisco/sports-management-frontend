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

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      unit: "",
      category: categories.length > 0 ? categories[0].id : "",
      is_lower_better: false,
    },
  });

  React.useEffect(() => {
    if (open) {
      if (metric) {
        form.reset({
          name: metric.name || "",
          description: metric.description || "",
          unit: metric.unit || "",
          category: metric.category || "",
          is_lower_better: metric.is_lower_better ?? false,
        });
      } else {
        form.reset({
          name: "",
          description: "",
          unit: "",
          category: categories.length > 0 ? categories[0].id : "",
          is_lower_better: false,
        });
      }
    }
  }, [metric, categories, form, open]);
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
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

          <div className="flex space-x-4">
            <ControlledInput
              name="unit"
              control={form.control}
              label="Unit"
              placeholder="E.g., seconds, cm"
              rules={{ required: "Unit is required" }}
              errors={form.formState.errors}
              className="flex-1"
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

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">{metric ? "Update" : "Create"} Metric</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TrainingMetricFormDialog;
