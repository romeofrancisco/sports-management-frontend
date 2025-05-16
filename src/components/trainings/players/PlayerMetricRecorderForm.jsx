import React from "react";
import ControlledInput from "@/components/common/ControlledInput";
import { Button } from "@/components/ui/button";

const PlayerMetricRecorderForm = ({
  form,
  metrics,
  selectedMetrics,
  handleRemoveMetric,
  onSubmit,
  isSubmitting,
}) => (
  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
    {form.watch("metrics")?.map((metric, index) => {
      const metricDetails = metrics.find((m) => m.id === metric.metric_id);
      return (
        <div key={index} className="rounded-lg border p-4 space-y-2">
          <div className="flex justify-between items-start">
            <div className="font-medium">
              {metricDetails?.name}
              <span className="ml-1 text-muted-foreground">
                ({metricDetails?.unit})
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveMetric(index)}
            >
              Remove
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ControlledInput
              control={form.control}
              name={`metrics.${index}.value`}
              label={`Value (${metricDetails?.unit})`}
              type="number"
              step="0.01"
              placeholder={`Enter ${metricDetails?.name} value`}
              rules={{
                required: "Value is required",
                validate: (value) =>
                  !isNaN(parseFloat(value)) || "Please enter a valid number",
              }}
            />
            <ControlledInput
              control={form.control}
              name={`metrics.${index}.notes`}
              label="Notes (optional)"
              placeholder="Any additional notes"
            />
          </div>
        </div>
      );
    })}
    {form.watch("metrics")?.length === 0 && (
      <div className="text-center py-4 text-muted-foreground">
        Select metrics to record from the dropdown above
      </div>
    )}
    <div className="flex justify-end gap-2">
      <Button
        type="button"
        variant="outline"
        onClick={form.onCancel || (() => {})}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        disabled={form.watch("metrics")?.length === 0 || isSubmitting}
      >
        Save Metrics
      </Button>
    </div>
  </form>
);

export default PlayerMetricRecorderForm;
