import React, { useState, useEffect } from "react";
import { Button } from "../../../ui/button";
import { Input } from "../../../ui/input";
import { Textarea } from "../../../ui/textarea";
import { Label } from "../../../ui/label";
import { Slider } from "../../../ui/slider";
import { Badge } from "../../../ui/badge";
import { Progress } from "../../../ui/progress";
import {
  useRecordPlayerMetrics,
  usePreviousPlayerMetrics,
} from "@/hooks/useTrainings";
import { useMetricUnits } from "@/hooks/useMetricUnits";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  CheckCircle2Icon,
  UserIcon,
  ClipboardPenLine,
  Settings,
  BarChart3,
  AlertCircle,
  CheckCircle2,
  Check,
  ChevronLeft,
  ChevronRight,
  User,
  Users,
} from "lucide-react";
import { formatMetricValue } from "@/utils/formatters";
import {
  ATTENDANCE_STATUS,
  ATTENDANCE_STATUS_LABELS,
} from "@/constants/trainings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Component to show improvement indicators
const ImprovementIndicator = ({ current, previous, isLowerBetter = true }) => {
  if (!current || !previous) return null;

  const diff = current - previous;
  const percentChange = ((current - previous) / Math.abs(previous)) * 100;

  // No significant change
  if (Math.abs(percentChange) < 0.5)
    return <span className="text-muted-foreground text-xs">No change</span>;

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
      range: { min: 0, max: 100, step: 1 },
    };
  }

  const unitCode = metricUnit.code?.toLowerCase() || "";
  const unitName = metricUnit.name?.toLowerCase() || "";

  const unitConfigs = {
    // Distance units
    cm: { useSlider: true, min: 0, max: 300, step: 1 },
    centimeter: { useSlider: true, min: 0, max: 300, step: 1 },
    centimeters: { useSlider: true, min: 0, max: 300, step: 1 },
    m: { useSlider: true, min: 0, max: 30, step: 0.1 },
    meter: { useSlider: true, min: 0, max: 30, step: 0.1 },
    meters: { useSlider: true, min: 0, max: 30, step: 0.1 },
    km: { useSlider: true, min: 0, max: 10, step: 0.1 },

    // Weight units
    kg: { useSlider: true, min: 0, max: 200, step: 0.5 },
    kilogram: { useSlider: true, min: 0, max: 200, step: 0.5 },
    kilograms: { useSlider: true, min: 0, max: 200, step: 0.5 },
    lbs: { useSlider: true, min: 0, max: 400, step: 1 },
    pounds: { useSlider: true, min: 0, max: 400, step: 1 },

    // Time units
    sec: { useSlider: false, min: 0, max: 300, step: 0.1 },
    second: { useSlider: false, min: 0, max: 300, step: 0.1 },
    seconds: { useSlider: false, min: 0, max: 300, step: 0.1 },
    min: { useSlider: false, min: 0, max: 60, step: 0.1 },
    minute: { useSlider: false, min: 0, max: 60, step: 0.1 },
    minutes: { useSlider: false, min: 0, max: 60, step: 0.1 },

    // Percentage and ratings
    "%": { useSlider: true, min: 0, max: 100, step: 1 },
    percent: { useSlider: true, min: 0, max: 100, step: 1 },
    rating: { useSlider: true, min: 1, max: 10, step: 0.5 },

    // Counts and scores
    reps: { useSlider: true, min: 0, max: 50, step: 1 },
    repetitions: { useSlider: true, min: 0, max: 50, step: 1 },
    sets: { useSlider: true, min: 0, max: 10, step: 1 },
    points: { useSlider: true, min: 0, max: 100, step: 1 },
    score: { useSlider: true, min: 0, max: 100, step: 1 },

    // Physiological measures
    bpm: { useSlider: true, min: 30, max: 220, step: 1 },
    "beats/min": { useSlider: true, min: 30, max: 220, step: 1 },
    heartrate: { useSlider: true, min: 30, max: 220, step: 1 },
  };

  let config = null;

  if (unitConfigs[unitCode]) {
    config = unitConfigs[unitCode];
  } else if (unitConfigs[unitName]) {
    config = unitConfigs[unitName];
  } else {
    for (const [pattern, cfg] of Object.entries(unitConfigs)) {
      if (unitCode.includes(pattern) || unitName.includes(pattern)) {
        config = cfg;
        break;
      }
    }
  }

  if (!config) {
    config = {
      useSlider: false,
      min: 0,
      max: 100,
      step: 1,
    };
  }

  return {
    useSlider: config.useSlider,
    range: {
      min: config.min,
      max: config.max,
      step: config.step,
    },
  };
};

const MetricInputField = ({
  metric,
  value,
  onChange,
  previousValue,
  allUnits,
}) => {
  const inputConfig = getMetricInputConfig(metric.metric_unit, allUnits);
  const { useSlider, range } = inputConfig;

  const sliderValue = useSlider
    ? Math.max(range.min, Math.min(range.max, parseFloat(value) || 0))
    : 0;

  const hasValue = value !== "" && !isNaN(parseFloat(value));
  return (
    <div
      className={cn(
        "space-y-3 py-3 border-b border-border last:border-b-0 pb-4 last:pb-0",
        hasValue ? "bg-muted/30 rounded-md p-3" : ""
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
            min={metric.is_lower_better ? undefined : 0}
            placeholder="Value"
            className={cn(
              "rounded-r-none",
              hasValue ? "border-primary/50" : ""
            )}
          />
          <div
            className={cn(
              "bg-muted h-10 px-3 inline-flex items-center rounded-r-md border border-l-0 border-input text-sm text-muted-foreground",
              hasValue ? "border-primary/50" : ""
            )}
          >
            {metric.metric_unit?.code || "-"}
          </div>
        </div>
      </div>
    </div>
  );
};

// Status styles matching the design system
const statusStyles = {
  present: {
    bg: "rgba(139,21,56,0.08)",
    color: "#8B1538",
    hoverBg: "rgba(139,21,56,0.25)",
    border: "border-red-900",
  },
  absent: {
    bg: "rgba(220,20,60,0.08)",
    color: "#DC143C",
    hoverBg: "rgba(220,20,60,0.25)",
    border: "border-red-600",
  },
  pending: {
    bg: "rgba(184,134,11,0.08)",
    color: "#B8860B",
    hoverBg: "rgba(184,134,11,0.25)",
    border: "border-yellow-600",
  },
  late: {
    bg: "rgba(218,165,32,0.08)",
    color: "#DAA520",
    hoverBg: "rgba(218,165,32,0.25)",
    border: "border-yellow-500",
  },
};

const PlayerMetricsRecording = ({ session, onSaveSuccess }) => {  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [metricValues, setMetricValues] = useState({});
  const [notes, setNotes] = useState({});
  const { mutate: recordMetrics, isLoading } = useRecordPlayerMetrics();
  const { data: metricUnits = [] } = useMetricUnits();

  // Get players from session with metrics configured
  const playersWithMetrics = React.useMemo(() => {
    const players = session?.player_records || [];
    return players.filter(
      (player) =>
        (player.attendance_status === ATTENDANCE_STATUS.PRESENT ||
         player.attendance_status === ATTENDANCE_STATUS.LATE) &&
        player.metric_records && 
        player.metric_records.length > 0
    );  }, [session?.player_records]);

  const currentPlayer = playersWithMetrics[currentPlayerIndex];
  const { data: previousRecords = [] } = usePreviousPlayerMetrics(
    currentPlayer?.id
  );
  // Navigation handlers
  const handlePreviousPlayer = async () => {
    // Save current player's metrics before navigating (no validation required for going back)
    if (currentPlayer && hasChanges()) {
      await savePlayerMetrics(false);
    }
    setCurrentPlayerIndex((prev) => Math.max(0, prev - 1));
  };  const handleNextPlayer = async () => {
    const isLastPlayer = currentPlayerIndex === playersWithMetrics.length - 1;
    
    // Don't allow navigation on the last player - disable the button instead
    if (isLastPlayer) {
      return;
    }
    
    // Validate metrics before proceeding
    if (currentPlayer && hasChanges() && !hasValidMetrics()) {
      toast.error("Invalid Metrics", {
        description: "Please enter valid metric values (greater than 0) before proceeding.",
        richColors: true,
      });
      return; // Prevent navigation
    }
    
    // Save current player's metrics before navigating
    if (currentPlayer && hasChanges()) {
      await savePlayerMetrics(false);
    }
    
    // Navigate to next player
    setCurrentPlayerIndex((prev) =>
      Math.min(playersWithMetrics.length - 1, prev + 1)
    );
  };  // Calculate progress
  const progressPercentage =
    playersWithMetrics.length > 0
      ? ((currentPlayerIndex + 1) / playersWithMetrics.length) * 100
      : 0;
  // Get metrics for current player
  const metricsToShow = React.useMemo(() => {
    if (!currentPlayer?.metric_records) return [];

    return currentPlayer.metric_records.map((record) => ({
      id: record.metric,
      name: record.metric_name,
      description: "",
      metric_unit: {
        code: record.metric_unit_code,
        name: record.metric_unit_name,
      },
      is_lower_better: record.metric_name.toLowerCase().includes("time"),
      existing_record_id: record.id,
      current_value: record.value,
    }));
  }, [currentPlayer]);
  // Check if there are any changes to save
  const hasChanges = () => {
    return metricsToShow.some(metric => {
      const currentValue = metricValues[metric.id] || "";
      const hasValue = currentValue !== "" && !isNaN(parseFloat(currentValue));
      return hasValue;
    });
  };
  // Check if ALL metrics have valid entries (non-zero values)
  const hasValidMetrics = () => {
    if (metricsToShow.length === 0) return false;
    
    return metricsToShow.every(metric => {
      const currentValue = metricValues[metric.id] || "";
      const numericValue = parseFloat(currentValue);
      return currentValue !== "" && !isNaN(numericValue) && numericValue > 0;
    });
  };
  // Helper function to save metrics with control over navigation
  const savePlayerMetrics = async (shouldNavigate = false) => {
    const metricsData = metricsToShow
      .map((metric) => ({
        metric_id: metric.id,
        value: parseFloat(metricValues[metric.id] || "0"),
        notes: notes[metric.id] || "",
        record_id: metric.existing_record_id,
      }))
      .filter((data) => !isNaN(data.value) && data.value > 0);

    if (metricsData.length === 0) {
      return; // Nothing to save
    }

    return new Promise((resolve, reject) => {
      recordMetrics(
        {
          id: currentPlayer.id,
          metrics: metricsData,
        },
        {
          onSuccess: (data) => {
            // Clear form for this player
            const clearedValues = {};
            const clearedNotes = {};
            metricsToShow.forEach((metric) => {
              clearedValues[metric.id] = "";
              clearedNotes[metric.id] = "";
            });
            setMetricValues(clearedValues);
            setNotes(clearedNotes);
            resolve(data);
          },
          onError: (error) => {
            toast.error("Failed to save metrics");
            reject(error);
          }
        }
      );
    });
  };
  // Initialize form values when player changes
  useEffect(() => {
    if (!currentPlayer) return;

    const initialValues = {};
    const initialNotes = {};

    metricsToShow.forEach((metric) => {
      initialValues[metric.id] = metric.current_value
        ? metric.current_value.toString()
        : "";
      initialNotes[metric.id] = metric.notes || "";
    });

    setMetricValues(initialValues);
    setNotes(initialNotes);
  }, [currentPlayer, metricsToShow]);

  const getPreviousValue = (metric) => {
    if (!metric || !metric.id) return undefined;

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
  // Check if there are players with metrics configured
  if (playersWithMetrics.length === 0) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Step 4: Record Player Metrics
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Record individual player performance metrics for this training session.
          </p>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p>No players have metrics configured for recording.</p>
            <p className="text-sm">Complete Step 3 (Configure Player Metrics) first.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Step 4: Record Player Metrics
        </CardTitle>        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            Record performance metrics for each player. Navigate through each player 
            to enter their training data.
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 flex flex-col h-full">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              Player {currentPlayerIndex + 1} of {playersWithMetrics.length}
            </span>
            <span className="text-muted-foreground">
              {Math.round(progressPercentage)}% Complete
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Player Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPlayer}
            disabled={currentPlayerIndex === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>          <div className="flex items-center gap-2">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center",
              hasValidMetrics() 
                ? "bg-green-100 text-green-600 border border-green-300" 
                : "bg-primary/10 text-primary"
            )}>
              {hasValidMetrics() ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <User className="h-5 w-5" />
              )}
            </div>
            <div className="text-center">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">
                  {currentPlayer?.player_name}
                </h3>
                {hasValidMetrics() && (
                  <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-300">
                    <Check className="h-3 w-3 mr-1" />
                    Recorded
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {metricsToShow.length} metrics to record
                {currentPlayer?.jersey_number && (
                  <span className="ml-1">• #{currentPlayer.jersey_number}</span>
                )}
              </p>
            </div>          </div>
            <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPlayer}
              disabled={currentPlayerIndex === playersWithMetrics.length - 1}
              className={cn(
                "flex items-center gap-2",
                // Show warning style if there are changes but no valid metrics
                hasChanges() && !hasValidMetrics() && "border-orange-400 text-orange-600 hover:bg-orange-50"
              )}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Metrics Recording Form */}
        <div className="space-y-4 flex-1 flex flex-col">
          <h4 className="text-sm font-medium">Record Training Metrics:</h4>
          <div className="space-y-4 flex-1">
            {metricsToShow.map((metric) => (
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
        </div>

        {/* General Notes */}
        <div className="space-y-2">
          <Label htmlFor="general-notes">Additional Notes</Label>
          <Textarea
            id="general-notes"
            placeholder="Add notes about this player's performance..."
            className="resize-none"
            rows={3}
            value={notes.general || ""}
            onChange={(e) =>
              setNotes({ ...notes, general: e.target.value })
            }
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerMetricsRecording;
