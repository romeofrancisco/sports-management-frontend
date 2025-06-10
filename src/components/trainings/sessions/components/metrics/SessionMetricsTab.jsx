import React from "react";
import { ScrollArea } from "../../../../ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../ui/card";
import { Button } from "../../../../ui/button";
import { Badge } from "../../../../ui/badge";
import { Label } from "../../../../ui/label";
import SimpleCheckbox from "../../../../ui/simple-checkbox";
import { Settings2, CheckCircle2, Filter, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSessionMetrics } from "./useSessionMetrics";
import { useTrainingMetrics, useTrainingCategories } from "@/hooks/useTrainings";

const SessionMetricsTab = ({ 
  session, 
  onSaveSuccess 
}) => {
  const {
    sessionMetrics,
    sessionMetricIds,
    selectedMetrics,
    selectedCategoryId,
    setSelectedCategoryId,
    handleToggleSessionMetric,
    handleSaveSessionMetrics,
  } = useSessionMetrics(session, onSaveSuccess);

  // Fetch all metrics and categories
  const { data: allMetrics, isLoading: metricsLoading } = useTrainingMetrics();
  const { data: categories } = useTrainingCategories();

  // Calculate changes being made
  const changesInfo = React.useMemo(() => {
    const currentMetricIds = sessionMetricIds || [];
    const newMetricIds = selectedMetrics || [];
    
    const toAdd = newMetricIds.filter(id => !currentMetricIds.includes(id));
    const toRemove = currentMetricIds.filter(id => !newMetricIds.includes(id));
    
    return {
      adding: toAdd.length,
      removing: toRemove.length,
      hasChanges: toAdd.length > 0 || toRemove.length > 0,
      totalSelected: newMetricIds.length
    };
  }, [sessionMetricIds, selectedMetrics]);

  // Generate button text and description based on changes
  const getButtonInfo = () => {
    const { adding, removing, hasChanges, totalSelected } = changesInfo;
    
    if (!hasChanges) {
      return {
        text: "No Changes to Save",
        description: `${totalSelected} metrics currently assigned`,
        disabled: true
      };
    }
    
    if (adding > 0 && removing > 0) {
      return {
        text: `Update Metrics (${adding} Add, ${removing} Remove)`,
        description: `Will result in ${totalSelected} total metrics`,
        disabled: false
      };
    }
    
    if (adding > 0) {
      return {
        text: `Add ${adding} Metric${adding > 1 ? 's' : ''}`,
        description: `${totalSelected} metrics will be assigned`,
        disabled: false
      };
    }
    
    if (removing > 0) {
      return {
        text: `Remove ${removing} Metric${removing > 1 ? 's' : ''}`,
        description: totalSelected > 0 
          ? `${totalSelected} metrics will remain assigned`
          : "All metrics will be removed",
        disabled: false
      };
    }
    
    return {
      text: "Save Changes",
      description: `${totalSelected} metrics selected`,
      disabled: false
    };
  };

  // Filter metrics based on selected category
  const filteredMetrics = React.useMemo(() => {
    if (!allMetrics) return [];

    let filtered = allMetrics;
    if (selectedCategoryId) {
      filtered = allMetrics.filter((metric) => {
        if (typeof metric.category === "object") {
          return metric.category.id === selectedCategoryId;
        }
        return metric.category === selectedCategoryId;
      });
    }

    return filtered;
  }, [allMetrics, selectedCategoryId]);

  return (
    <Card>      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings2 className="h-5 w-5" />
          Session-Level Metrics
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Configure metrics that all present/late players in this session will have assigned. These metrics are shared across all active participants.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Currently assigned session metrics */}
        {sessionMetrics.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Metrics Currently Assigned to All Present/Late Players:</h4>
            <div className="flex flex-wrap gap-2">
              {sessionMetrics.map((metric) => (
                <Badge key={metric.id} variant="default" className="text-xs">
                  {metric.name} ({metric.metric_unit?.code || "-"})
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 items-center">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filter by category:</span>
          <Badge
            variant={selectedCategoryId === null ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedCategoryId(null)}
          >
            All
          </Badge>
          {categories?.map((category) => (
            <Badge
              key={category.id}
              variant={selectedCategoryId === category.id ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedCategoryId(category.id)}
            >
              {category.name}
            </Badge>
          ))}
        </div>

        {/* Metrics selection */}
        {metricsLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <ScrollArea className="h-[400px] border rounded-lg p-4">
            <div className="space-y-3">              {filteredMetrics.map((metric) => {
                const isMetricSelected = selectedMetrics.includes(metric.id);
                const isAssignedToAllPlayers = sessionMetricIds.includes(metric.id);

                return (
                  <div
                    key={metric.id}
                    className={cn(
                      "flex items-center space-x-3 rounded-md border p-3 transition-colors hover:bg-muted/50",
                      isAssignedToAllPlayers && "bg-green-50 border-green-200"
                    )}
                  >
                    <SimpleCheckbox
                      id={`metric-${metric.id}`}
                      checked={isMetricSelected}
                      onChange={() => handleToggleSessionMetric(metric.id)}
                    />
                    <div className="flex-1" onClick={() => handleToggleSessionMetric(metric.id)}>
                      <Label
                        htmlFor={`metric-${metric.id}`}
                        className="text-sm font-medium leading-none cursor-pointer flex items-center gap-2"
                      >
                        {metric.name}
                        {isAssignedToAllPlayers && (
                          <Badge variant="outline" className="text-xs text-green-600">
                            Assigned to All
                          </Badge>
                        )}
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        {metric.description} ({metric.metric_unit?.code || "-"})
                      </p>
                    </div>
                    {metric.category_name && (
                      <Badge variant="outline" className="text-xs">
                        {metric.category_name || (typeof metric.category === "object" ? metric.category.name : "")}
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}        {/* Save button */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {getButtonInfo().description}
          </div>
          <Button
            onClick={handleSaveSessionMetrics}
            disabled={getButtonInfo().disabled}
            variant={changesInfo.removing > 0 && changesInfo.adding === 0 ? "destructive" : "default"}
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            {getButtonInfo().text}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionMetricsTab;
