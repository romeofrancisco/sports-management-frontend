import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  useRecordPlayerMetrics,
  usePreviousPlayerMetrics,
} from "@/hooks/useTrainings";
import { useMetricUnits } from "@/hooks/useMetricUnits";
import { cn } from "@/lib/utils";
import { ArrowUpIcon, ArrowDownIcon, CheckCircle2Icon } from "lucide-react";
import { toast } from "sonner";
import { formatMetricValue } from "@/utils/formatters";

// Component to show improvement indicators
const ImprovementIndicator = ({ current, previous, isLowerBetter = true }) => {
  if (!current || !previous) return null;

  const diff = current - previous;
  const percentChange = ((current - previous) / Math.abs(previous)) * 100;

  // No significant change
  if (Math.abs(percentChange) < 0.5)
    return <span className="text-muted-foreground text-xs">No change</span>;

  // For metrics where lower is better (like time), we want diff to be negative
  // For metrics where higher is better (like reps), we want diff to be positive
  const isImprovement = isLowerBetter ? diff < 0 : diff > 0;
  return (
    <span
      className={cn(
        "text-xs font-medium flex items-center",
        isImprovement ? "text-green-900" : "text-red-500"
      )}
    >
      {isImprovement ? (
        <>
          <ArrowUpIcon className="h-3 w-3 mr-1" />
          Improved by {Math.abs(percentChange).toFixed(2)}%
        </>
      ) : (
        <>
          <ArrowDownIcon className="h-3 w-3 mr-1" />
          Decreased by {Math.abs(percentChange).toFixed(2)}%
        </>
      )}
    </span>
  );
};

// Utility functions to determine metric input behavior based on unit data
const getMetricInputConfig = (metricUnit, allUnits = []) => {
  if (!metricUnit) {
    return {
      useSlider: false,
      range: { min: 0, max: 100, step: 1 }
    };
  }

  const unitCode = metricUnit.code?.toLowerCase() || "";
  const unitName = metricUnit.name?.toLowerCase() || "";
  
  // Enhanced mapping with more comprehensive patterns
  // This mapping is now backed by the database default units
  const unitConfigs = {
    // Distance units
    cm: { useSlider: true, min: 0, max: 300, step: 1 },
    centimeter: { useSlider: true, min: 0, max: 300, step: 1 },
    centimeters: { useSlider: true, min: 0, max: 300, step: 1 },
    m: { useSlider: true, min: 0, max: 30, step: 0.1 },
    meter: { useSlider: true, min: 0, max: 30, step: 0.1 },
    meters: { useSlider: true, min: 0, max: 30, step: 0.1 },
    km: { useSlider: true, min: 0, max: 10, step: 0.1 },
    kilometer: { useSlider: true, min: 0, max: 10, step: 0.1 },
    kilometers: { useSlider: true, min: 0, max: 10, step: 0.1 },
    in: { useSlider: true, min: 0, max: 100, step: 0.5 },
    inch: { useSlider: true, min: 0, max: 100, step: 0.5 },
    inches: { useSlider: true, min: 0, max: 100, step: 0.5 },
    ft: { useSlider: true, min: 0, max: 20, step: 0.1 },
    feet: { useSlider: true, min: 0, max: 20, step: 0.1 },
    foot: { useSlider: true, min: 0, max: 20, step: 0.1 },
    
    // Weight units
    kg: { useSlider: true, min: 0, max: 200, step: 0.5 },
    kilogram: { useSlider: true, min: 0, max: 200, step: 0.5 },
    kilograms: { useSlider: true, min: 0, max: 200, step: 0.5 },
    lbs: { useSlider: true, min: 0, max: 400, step: 1 },
    pounds: { useSlider: true, min: 0, max: 400, step: 1 },
    pound: { useSlider: true, min: 0, max: 400, step: 1 },
    
    // Time units (better with input for precision)
    sec: { useSlider: false, min: 0, max: 300, step: 0.1 },
    second: { useSlider: false, min: 0, max: 300, step: 0.1 },
    seconds: { useSlider: false, min: 0, max: 300, step: 0.1 },
    min: { useSlider: false, min: 0, max: 60, step: 0.1 },
    minute: { useSlider: false, min: 0, max: 60, step: 0.1 },
    minutes: { useSlider: false, min: 0, max: 60, step: 0.1 },
    hr: { useSlider: false, min: 0, max: 24, step: 0.1 },
    hour: { useSlider: false, min: 0, max: 24, step: 0.1 },
    hours: { useSlider: false, min: 0, max: 24, step: 0.1 },
    
    // Percentage and ratings
    "%": { useSlider: true, min: 0, max: 100, step: 1 },
    percent: { useSlider: true, min: 0, max: 100, step: 1 },
    percentage: { useSlider: true, min: 0, max: 100, step: 1 },
    rating: { useSlider: true, min: 1, max: 10, step: 0.5 },
    
    // Counts and scores
    reps: { useSlider: true, min: 0, max: 50, step: 1 },
    repetitions: { useSlider: true, min: 0, max: 50, step: 1 },
    rep: { useSlider: true, min: 0, max: 50, step: 1 },
    sets: { useSlider: true, min: 0, max: 10, step: 1 },
    set: { useSlider: true, min: 0, max: 10, step: 1 },
    points: { useSlider: true, min: 0, max: 100, step: 1 },
    point: { useSlider: true, min: 0, max: 100, step: 1 },
    score: { useSlider: true, min: 0, max: 100, step: 1 },
    
    // Physiological measures
    bpm: { useSlider: true, min: 30, max: 220, step: 1 },
    "beats/min": { useSlider: true, min: 30, max: 220, step: 1 },
    "beats per minute": { useSlider: true, min: 30, max: 220, step: 1 },
    "heartrate": { useSlider: true, min: 30, max: 220, step: 1 },
    "heart rate": { useSlider: true, min: 30, max: 220, step: 1 },
  };

  // Check both code and name for matches
  let config = null;
  
  // First try exact matches with code
  if (unitConfigs[unitCode]) {
    config = unitConfigs[unitCode];
  }
  // Then try exact matches with name
  else if (unitConfigs[unitName]) {
    config = unitConfigs[unitName];
  }
  // Then try partial matches with code
  else {
    for (const [pattern, cfg] of Object.entries(unitConfigs)) {
      if (unitCode.includes(pattern) || unitName.includes(pattern)) {
        config = cfg;
        break;
      }
    }
  }

  // Default configuration if no match found
  if (!config) {
    // For unrecognized units, use sensible defaults
    config = {
      useSlider: false, // Default to input for unknown units
      min: 0,
      max: 100,
      step: 1
    };
  }

  return {
    useSlider: config.useSlider,
    range: {
      min: config.min,
      max: config.max,
      step: config.step
    }
  };
};

const MetricInputField = ({ metric, value, onChange, previousValue, allUnits }) => {
  // Get the input configuration based on the metric unit
  const inputConfig = getMetricInputConfig(metric.metric_unit, allUnits);
  const { useSlider, range } = inputConfig;

  // For slider metrics, ensure value is within range
  const sliderValue = useSlider
    ? Math.max(
        range.min,
        Math.min(range.max, parseFloat(value) || 0)
      )
    : 0;

  const hasValue = value !== "" && !isNaN(parseFloat(value));

  return (
    <div
      className={cn(
        "space-y-3 py-2 border-b pb-4",
        hasValue ? "bg-muted/30 rounded-md p-2" : ""
      )}
    >
      <div className="flex justify-between items-start">
        <div>
          <Label htmlFor={`metric-${metric.id}`} className="font-medium">
            {metric.name}
          </Label>
          <p className="text-sm text-muted-foreground">{metric.description}</p>
        </div>
        {previousValue !== undefined && (
          <div className="text-sm flex flex-col items-end">
            <span className="text-muted-foreground">
              Previous: {formatMetricValue(previousValue)}
              {metric.metric_unit?.code || "-"}
            </span>
            {value && !isNaN(parseFloat(value)) && (
              <ImprovementIndicator
                current={parseFloat(value)}
                previous={previousValue}
                isLowerBetter={metric.is_lower_better}
              />
            )}
          </div>
        )}
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1">
          {useSlider && (
            <>
              <Slider
                value={[sliderValue]}
                min={range.min}
                max={range.max}
                step={range.step}
                onValueChange={(vals) => onChange(vals[0])}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{range.min}</span>
                <span>{range.max}</span>
              </div>
            </>
          )}
        </div>

        <div className={cn("flex items-center", useSlider ? "w-32" : "w-full")}>
          <Input
            id={`metric-${metric.id}`}
            type="number"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            step={range.step}
            min={metric.is_lower_better ? undefined : 0} // For metrics where higher is better, use 0 as min
            placeholder="Value"
            className={cn(
              "rounded-r-none",
              hasValue ? "border-red-800/50" : ""
            )}
          />
          <div
            className={cn(
              "bg-muted h-10 px-3 inline-flex items-center rounded-r-md border border-l-0 border-input text-sm text-muted-foreground",
              hasValue ? "border-red-800/50" : ""
            )}
          >
            {metric.metric_unit?.code || "-"}
          </div>
        </div>
      </div>
    </div>
  );
};

const PlayerMetricRecordModal = ({
  isOpen,
  onClose,
  playerTraining,
  metrics = [],
}) => {
  const [metricValues, setMetricValues] = useState({});
  const [notes, setNotes] = useState({});
  const { mutate: recordMetrics, isLoading } = useRecordPlayerMetrics();
  const { data: previousRecords = [] } = usePreviousPlayerMetrics(
    playerTraining?.id
  );
  
  // Fetch available metric units for flexible configuration
  const { data: metricUnits = [] } = useMetricUnits();
  // Get metrics to show based only on player's assigned metrics  // Get metrics from the metric_records directly
  const metricsToShow = React.useMemo(() => {
    if (!playerTraining?.metric_records) return [];

    // Convert metric records to the format needed for the UI
    return playerTraining.metric_records.map((record) => ({
      id: record.metric,
      name: record.metric_name,
      description: "",
      metric_unit: {
        code: record.metric_unit_code,
        name: record.metric_unit_name,
      },
      is_lower_better: record.metric_name.toLowerCase().includes("time"), // Assume time-based metrics are lower-better
      existing_record_id: record.id,
      current_value: record.value,
    }));
  }, [playerTraining]);

  // Initialize form values once when the modal opens or player changes
  useEffect(() => {
    if (!playerTraining) return;

    const initialValues = {};
    const initialNotes = {}; // Initialize with values from metricsToShow
    metricsToShow.forEach((metric) => {
      initialValues[metric.id] = metric.current_value
        ? metric.current_value.toString()
        : "0";
      initialNotes[metric.id] = metric.notes || "";
    });

    setMetricValues(initialValues);
    setNotes(initialNotes);
  }, [playerTraining, metricsToShow]);

  if (!playerTraining) return null;
  const handleSubmit = () => {
    const metricsData = metricsToShow
      .map((metric) => ({
        metric_id: metric.id,
        value: parseFloat(metricValues[metric.id] || "0"),
        notes: notes[metric.id] || "",
        record_id: metric.existing_record_id, // Include the existing record ID if available
      }))
      .filter((data) => !isNaN(data.value));

    if (metricsData.length === 0) {
      toast.error("No valid metrics to save", {
        description: "Please enter at least one valid metric value.",
        richColors: true,
      });
      return;
    }

    toast.promise(
      new Promise((resolve, reject) => {
        recordMetrics(
          {
            id: playerTraining.id,
            metrics: metricsData,
          },
          {
            onSuccess: (data) => {
              resolve(data);
              onClose();
            },
            onError: (error) => {
              reject(error);
            },
          }
        );
      }),
      {
        loading: "Saving metrics...",
        success: (data) => ({
          title: "Metrics saved!",
          description: `Successfully recorded ${
            data.records?.length || metricsData.length
          } metrics for ${playerTraining.player_name}`,
          icon: <CheckCircle2Icon className="h-4 w-4" />,
          richColors: true,
        }),
        error: (error) => ({
          title: "Failed to save metrics",
          description:
            error.response?.data?.detail ||
            error.message ||
            "An unexpected error occurred",
          richColors: true,
        }),
      }
    );
  };
  const getPreviousValue = (metric) => {
    // Look for previous records for this player and metric
    if (!metric || !metric.id) return undefined;

    // Check in previousRecords from the API
    if (previousRecords && Array.isArray(previousRecords)) {
      const previousRecord = previousRecords.find(
        (record) => record.metric_id === metric.id
      );
      if (previousRecord) {
        return previousRecord.value;
      }
    }

    return undefined;
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Record Metrics for {playerTraining.player_name}
            {playerTraining.jersey_number && (
              <span className="text-muted-foreground ml-1">
                #{playerTraining.jersey_number}
              </span>
            )}
          </DialogTitle>
          {playerTraining.session_title && (
            <p className="text-sm text-muted-foreground mt-1">
              Session: {playerTraining.session_title} (
              {playerTraining.session_date})
            </p>
          )}
        </DialogHeader>
        <div className="space-y-2 py-2">
          {metricsToShow.length === 0 ? (
            <div className="text-center py-6 bg-muted rounded-md space-y-4">
              <div>
                <span className="block text-amber-600 font-medium mb-1">
                  No metrics available for recording
                </span>
                <span className="text-sm text-amber-500">
                  No metrics have been configured for this training session.
                </span>
              </div>

              <div className="flex flex-col gap-2 items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onClose();
                    toast.info("Configure session metrics", {
                      description:
                        "You can set up which metrics to track for this training session from the training sessions list.",
                      richColors: true,
                    });
                  }}
                >
                  Configure Session Metrics
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onClose();
                    toast.info("Configure player metrics", {
                      description: `Set up metrics specifically for ${playerTraining.player_name} from the player selection modal.`,
                      richColors: true,
                    });
                  }}
                >
                  Configure Player Metrics
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground pb-2">
                Enter values for the training metrics below. At least one metric
                is required.
              </p>              {metricsToShow.map((metric) => (
                <MetricInputField
                  key={metric.id}
                  metric={metric}
                  value={metricValues[metric.id] || ""}
                  onChange={(value) =>
                    setMetricValues({ ...metricValues, [metric.id]: value })
                  }
                  previousValue={getPreviousValue(metric)}
                  allUnits={metricUnits}
                />
              ))}
            </div>
          )}

          <div className="pt-2">
            <Label htmlFor="general-notes">General Notes</Label>
            <Textarea
              id="general-notes"
              placeholder="Add notes about this training session..."
              className="mt-1"
              value={notes.general || ""}
              onChange={(e) => setNotes({ ...notes, general: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading || metricsToShow.length === 0}
          >
            {isLoading ? "Saving..." : "Save Metrics"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerMetricRecordModal;
