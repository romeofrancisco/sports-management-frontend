import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useRecordPlayerMetrics, usePreviousPlayerMetrics } from "@/hooks/useTrainings";
import { cn } from "@/lib/utils";
import { ArrowUpIcon, ArrowDownIcon, CheckCircle2Icon } from "lucide-react";
import { toast } from "sonner";

// Component to show improvement indicators
const ImprovementIndicator = ({ current, previous, isLowerBetter = true }) => {
  if (!current || !previous) return null;
  
  const diff = current - previous;
  const percentChange = ((current - previous) / Math.abs(previous)) * 100;
  
  // No significant change
  if (Math.abs(percentChange) < 0.5) return (
    <span className="text-muted-foreground text-xs">No change</span>
  );
  
  // For metrics where lower is better (like time), we want diff to be negative
  // For metrics where higher is better (like reps), we want diff to be positive
  const isImprovement = isLowerBetter ? diff < 0 : diff > 0;
  
  return (
    <span className={cn(
      "text-xs font-medium flex items-center",
      isImprovement ? "text-green-500" : "text-red-500"
    )}>
      {isImprovement ? (
        <>
          <ArrowUpIcon className="h-3 w-3 mr-1" />
          Improved by {Math.abs(percentChange).toFixed(1)}%
        </>
      ) : (
        <>
          <ArrowDownIcon className="h-3 w-3 mr-1" />
          Decreased by {Math.abs(percentChange).toFixed(1)}%
        </>
      )}
    </span>
  );
};

const MetricInputField = ({ metric, value, onChange, previousValue }) => {  
  // Determine if we should use a slider based on the unit type
  const shouldUseSlider = (unit) => {
    // Units that typically have bounded ranges and benefit from sliders
    const sliderUnits = [
      'cm', 'm', 'kg', 'lbs', '%', 'percent', 'percentage', 
      'rating', 'points', 'score', 'reps', 'sets'
    ];
    return sliderUnits.some(u => unit.toLowerCase().includes(u.toLowerCase()));
  };

  // Set appropriate min/max values based on the metric
  const getSliderRange = (metricName, unit) => {
    const unitLower = unit.toLowerCase();
    
    // Distance units
    if (unitLower.includes('cm')) return { min: 0, max: 300, step: 1 };
    if (unitLower === 'm' || unitLower === 'meters') return { min: 0, max: 30, step: 0.1 };
    if (unitLower.includes('km')) return { min: 0, max: 10, step: 0.1 };
    if (unitLower.includes('in') || unitLower.includes('inch')) return { min: 0, max: 100, step: 0.5 };
    if (unitLower.includes('ft') || unitLower.includes('feet')) return { min: 0, max: 20, step: 0.1 };
    
    // Weight units
    if (unitLower.includes('kg')) return { min: 0, max: 200, step: 0.5 };
    if (unitLower.includes('lbs') || unitLower.includes('pound')) return { min: 0, max: 400, step: 1 };
    
    // Time units (not ideal for slider, but supported)
    if (unitLower.includes('second')) return { min: 0, max: 60, step: 0.1 };
    if (unitLower.includes('minute')) return { min: 0, max: 30, step: 0.1 };
    
    // Other units
    if (unitLower.includes('%') || unitLower.includes('percent')) return { min: 0, max: 100, step: 1 };
    if (unitLower.includes('rating')) return { min: 1, max: 10, step: 0.5 };
    if (unitLower.includes('points') || unitLower.includes('score')) return { min: 0, max: 100, step: 1 };
    if (unitLower.includes('reps')) return { min: 0, max: 50, step: 1 };
    if (unitLower.includes('sets')) return { min: 0, max: 10, step: 1 };
    if (unitLower.includes('bpm')) return { min: 30, max: 220, step: 1 };
    
    // Default range
    return { min: 0, max: 100, step: 1 };
  };

  const useSlider = shouldUseSlider(metric.unit);
  const sliderRange = getSliderRange(metric.name, metric.unit);
  
  // For slider metrics, ensure value is within range
  const sliderValue = useSlider 
    ? Math.max(sliderRange.min, Math.min(sliderRange.max, parseFloat(value) || 0)) 
    : 0;
    
  const hasValue = value !== '' && !isNaN(parseFloat(value));

  return (
    <div className={cn(
      "space-y-3 py-2 border-b pb-4",
      hasValue ? "bg-muted/30 rounded-md p-2" : ""
    )}>
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
              Previous: {previousValue} {metric.unit}
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
                min={sliderRange.min}
                max={sliderRange.max}
                step={sliderRange.step}
                onValueChange={(vals) => onChange(vals[0])}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{sliderRange.min}</span>
                <span>{sliderRange.max}</span>
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
            step={sliderRange.step}
            min={metric.is_lower_better ? undefined : 0} // For metrics where higher is better, use 0 as min
            placeholder="Value"
            className={cn("rounded-r-none", hasValue ? "border-green-500/50" : "")}
          />
          <div className={cn(
            "bg-muted h-10 px-3 inline-flex items-center rounded-r-md border border-l-0 border-input text-sm text-muted-foreground",
            hasValue ? "border-green-500/50" : ""
          )}>
            {metric.unit}
          </div>
        </div>
      </div>
    </div>
  );
};

const PlayerMetricRecordModal = ({ isOpen, onClose, playerTraining, metrics = [] }) => {
  const [metricValues, setMetricValues] = useState({});
  const [notes, setNotes] = useState({});
  const { mutate: recordMetrics, isLoading } = useRecordPlayerMetrics();
  const { data: previousRecords = [] } = usePreviousPlayerMetrics(
    playerTraining?.id
  );

  // Get metrics to show based on player's assigned metrics or session metrics
  const metricsToShow = React.useMemo(() => {
    if (!playerTraining) return metrics;
    
    // If player has specific assigned metrics, use those
    if (playerTraining.assigned_metrics && playerTraining.assigned_metrics.length > 0) {
      // Filter metrics to only show the ones assigned to this player
      const playerMetricIds = playerTraining.assigned_metrics.map(m => typeof m === 'object' ? m.id : m);
      return metrics.filter(metric => playerMetricIds.includes(metric.id));
    }
    
    // Otherwise fall back to all metrics passed to the component
    return metrics;
  }, [playerTraining, metrics]);

  // Reset form when player training changes
  useEffect(() => {
    if (playerTraining) {
      // Initialize with existing values from metric_records if available
      const initialValues = {};
      const initialNotes = {};
      
      const existingRecords = playerTraining.metric_records || [];
      
      metricsToShow.forEach(metric => {
        const record = existingRecords.find(r => r.metric === metric.id);
        initialValues[metric.id] = record ? record.value.toString() : '';
        initialNotes[metric.id] = record ? record.notes : '';
      });
      
      setMetricValues(initialValues);
      setNotes(initialNotes);
    }
  }, [playerTraining, metricsToShow]);

  if (!playerTraining) return null;  const handleSubmit = () => {
    const metricsData = metricsToShow.map(metric => ({
      metric_id: metric.id,
      value: parseFloat(metricValues[metric.id]),
      notes: notes[metric.id] || ""
    })).filter(data => !isNaN(data.value));

    if (metricsData.length === 0) {
      toast.error("No valid metrics to save", {
        description: "Please enter at least one valid metric value.",
        richColors: true,
      });
      return;
    }

    toast.promise(
      new Promise((resolve, reject) => {
        recordMetrics({
          id: playerTraining.id,
          metrics: metricsData
        }, {
          onSuccess: (data) => {
            resolve(data);
            onClose();
          },
          onError: (error) => {
            reject(error);
          }
        });
      }),
      {
        loading: 'Saving metrics...',
        success: (data) => ({
          title: 'Metrics saved!',
          description: `Successfully recorded ${data.records?.length || metricsData.length} metrics for ${playerTraining.player_name}`,
          icon: <CheckCircle2Icon className="h-4 w-4" />,
          richColors: true,
        }),
        error: (error) => ({
          title: 'Failed to save metrics',
          description: error.response?.data?.detail || error.message || 'An unexpected error occurred',
          richColors: true,
        }),
      }
    );
  };const getPreviousValue = (metric) => {
    // Look for previous records for this player and metric
    if (!metric || !metric.id) return undefined;
    
    // Check in previousRecords from the API
    if (previousRecords && Array.isArray(previousRecords)) {
      const previousRecord = previousRecords.find(
        record => record.metric_id === metric.id
      );
      if (previousRecord) {
        return previousRecord.value;
      }
    }
    
    return undefined;
  };  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Record Metrics for {playerTraining.player_name}
            {playerTraining.jersey_number && 
              <span className="text-muted-foreground ml-1">#{playerTraining.jersey_number}</span>
            }
          </DialogTitle>
          {playerTraining.session_title && (
            <p className="text-sm text-muted-foreground mt-1">
              Session: {playerTraining.session_title} ({playerTraining.session_date})
            </p>
          )}
        </DialogHeader>
          <div className="space-y-2 py-2">
          {metricsToShow.length === 0 ? (
            <div className="text-center py-6 bg-amber-50 border border-amber-200 rounded-md space-y-4">
              <div>
                <span className="block text-amber-600 font-medium mb-1">No metrics available for recording</span>
                <span className="text-sm text-amber-500">
                  No metrics have been configured for this training session.
                </span>
              </div>
              
              <div className="flex flex-col gap-2 items-center">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-white text-amber-600 border-amber-300 hover:bg-amber-100 hover:text-amber-700"
                  onClick={() => {
                    onClose();
                    
                    // Use the event system to trigger the metrics configuration
                    const event = new CustomEvent('configureSessionMetrics', {
                      detail: { sessionId: playerTraining.session }
                    });
                    window.dispatchEvent(event);
                    
                    toast.info("Configure session metrics", {
                      description: "You can set up which metrics to track for this training session.",
                      richColors: true
                    });
                  }}
                >
                  Configure Session Metrics
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-white text-blue-600 border-blue-300 hover:bg-blue-100 hover:text-blue-700"
                  onClick={() => {
                    onClose();
                    
                    // Use the event system to trigger player-specific metrics configuration
                    const event = new CustomEvent('configurePlayerMetrics', {
                      detail: { playerTrainingId: playerTraining.id, playerName: playerTraining.player_name }
                    });
                    window.dispatchEvent(event);
                    
                    toast.info("Configure player metrics", {
                      description: `Set up metrics specifically for ${playerTraining.player_name}.`,
                      richColors: true
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
                Enter values for the training metrics below. At least one metric is required.
              </p>
              {metricsToShow.map(metric => (
                <MetricInputField
                  key={metric.id}
                  metric={metric}
                  value={metricValues[metric.id] || ''}
                  onChange={(value) => setMetricValues({...metricValues, [metric.id]: value})}
                  previousValue={getPreviousValue(metric)}
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
              value={notes.general || ''}
              onChange={(e) => setNotes({...notes, general: e.target.value})}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit} disabled={isLoading || metrics.length === 0}>
            {isLoading ? "Saving..." : "Save Metrics"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerMetricRecordModal;
