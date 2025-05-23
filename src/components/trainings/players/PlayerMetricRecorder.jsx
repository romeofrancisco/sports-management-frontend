import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  useTrainingMetrics,
  usePlayerTraining,
  useRecordPlayerMetrics,
  useTrainingSession,
} from "@/hooks/useTrainings";
import { toast } from "sonner";
import PlayerMetricRecorderForm from "./PlayerMetricRecorderForm";

const PlayerMetricRecorder = ({ player, onClose }) => {
  const [selectedMetrics, setSelectedMetrics] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Get player training data
  const { data: playerTraining, isLoading: playerTrainingLoading } =
    usePlayerTraining(player, !!player);

  // Get training session data to show categories
  const { data: session, isLoading: sessionLoading } = useTrainingSession(
    playerTraining?.session,
    !!playerTraining?.session
  );
  // Get available metrics filtered by session categories
  const { data: metrics, isLoading: metricsLoading } = useTrainingMetrics();

  // Filter metrics by session categories
  const filteredMetrics = React.useMemo(() => {
    if (!metrics || !session?.categories) return [];
    const sessionCategoryIds = session.categories.map((cat) => cat.id);
    return metrics.filter((metric) => {
      // Now metric.category is a single value (id or object)
      if (metric.category && typeof metric.category === "object") {
        return sessionCategoryIds.includes(metric.category.id);
      }
      return sessionCategoryIds.includes(metric.category);
    });
  }, [metrics, session]);

  const { mutate: recordMetrics } = useRecordPlayerMetrics();

  const form = useForm({
    defaultValues: {
      metrics: [],
    },
  });

  // When dialog opens, reset form with existing metrics if available
  useEffect(() => {
    if (playerTraining?.metric_records) {
      // Set initial metrics based on existing records
      const initialMetrics = playerTraining.metric_records.map((record) => ({
        metric_id: record.metric.id,
        value: record.value,
        notes: record.notes,
      }));

      form.reset({ metrics: initialMetrics });
      setSelectedMetrics(initialMetrics.map((m) => m.metric_id));
    } else {
      // Reset form for new records
      form.reset({ metrics: [] });
      setSelectedMetrics([]);
    }
  }, [playerTraining, form]);

  const isLoading = playerTrainingLoading || sessionLoading || metricsLoading;

  if (isLoading)
    return <div className="flex justify-center p-4">Loading...</div>;
  if (!playerTraining)
    return (
      <div className="text-red-500 p-4">Player training record not found</div>
    );

  const handleAddMetric = (metricId) => {
    if (selectedMetrics.includes(metricId)) return;

    const metric = metrics.find((m) => m.id === metricId);
    const currentMetrics = form.getValues("metrics") || [];

    const updatedMetrics = [
      ...currentMetrics,
      { metric_id: metricId, value: "", notes: "" },
    ];

    form.setValue("metrics", updatedMetrics);
    setSelectedMetrics([...selectedMetrics, metricId]);
  };

  const handleRemoveMetric = (index) => {
    const currentMetrics = form.getValues("metrics");
    const metricId = currentMetrics[index].metric_id;

    const updatedMetrics = currentMetrics.filter((_, i) => i !== index);
    form.setValue("metrics", updatedMetrics);

    setSelectedMetrics(selectedMetrics.filter((id) => id !== metricId));
  };

  const onFormSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await recordMetrics({
        id: player,
        metrics: data.metrics,
      }).unwrap();
      toast({
        title: "Metrics recorded",
        description: `Recorded ${response.records.length} metrics for ${playerTraining.player_name}`,
      });
      if (onClose) onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to record metrics: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Card className="mb-4">
        <CardContent className="pt-6">
          {playerTraining.metric_records.length > 0 ? (
            <>
              <div className="font-medium mb-2">Previously Recorded:</div>
              <ul className="space-y-2">
                {playerTraining.metric_records.map((record) => (
                  <li key={record.id} className="flex justify-between">
                    <span className="text-muted-foreground">
                      {record.metric.name}:
                    </span>
                    <span>
                      {record.value} {record.metric.metric_unit?.code || ''}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="text-center text-muted-foreground">
              No metrics recorded yet
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mb-4">
        <div className="font-medium mb-2">Training Categories:</div>
        <div className="flex flex-wrap gap-2">
          {" "}
          {session?.categories?.map((category) => (
            <Badge key={category.id} style={{ backgroundColor: "#007bff" }}>
              {category.name}
            </Badge>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <div className="font-medium mb-2">Add Metrics:</div>
        <div className="flex flex-wrap gap-2">
          <Select onValueChange={handleAddMetric}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a metric to add" />
            </SelectTrigger>
            <SelectContent>
              {filteredMetrics.map((metric) => {
                const isSelected = selectedMetrics.includes(metric.id);
                return (
                  <SelectItem
                    key={metric.id}
                    value={metric.id}
                    disabled={isSelected}
                  >
                    {metric.name} ({metric.metric_unit?.code || '-'}){isSelected && " - Added"}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>

      <PlayerMetricRecorderForm
        form={{
          ...form,
          onCancel: onClose || (() => {}),
        }}
        metrics={metrics}
        selectedMetrics={selectedMetrics}
        handleRemoveMetric={handleRemoveMetric}
        onSubmit={onFormSubmit}
        isSubmitting={isSubmitting}
      />
    </>
  );
};

export default PlayerMetricRecorder;
