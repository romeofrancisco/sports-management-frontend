import React from "react";
import { ScrollArea } from "../../../../ui/scroll-area";
import { Button } from "../../../../ui/button";
import { Badge } from "../../../../ui/badge";
import { Label } from "../../../../ui/label";
import SimpleCheckbox from "../../../../ui/simple-checkbox";
import { Settings2, CheckCircle2, Filter, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSessionMetrics } from "./useSessionMetrics";
import {
  useTrainingMetrics,
  useTrainingCategories,
} from "@/hooks/useTrainings";
import ContentEmpty from "@/components/common/ContentEmpty";

const SessionMetricsTab = ({
  session,
  onSaveSuccess,
  isFormDisabled = false,
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

    const toAdd = newMetricIds.filter((id) => !currentMetricIds.includes(id));
    const toRemove = currentMetricIds.filter(
      (id) => !newMetricIds.includes(id)
    );

    return {
      adding: toAdd.length,
      removing: toRemove.length,
      hasChanges: toAdd.length > 0 || toRemove.length > 0,
      totalSelected: newMetricIds.length,
    };
  }, [sessionMetricIds, selectedMetrics]);

  // Generate button text and description based on changes
  const getButtonInfo = () => {
    const { adding, removing, hasChanges, totalSelected } = changesInfo;

    if (!hasChanges) {
      return {
        text: "No Changes to Save",
        description: `${totalSelected} Training excercises currently assigned`,
        disabled: true,
      };
    }

    if (adding > 0 && removing > 0) {
      return {
        text: `Update Training Excercises (${adding} Add, ${removing} Remove)`,
        description: `Will result in ${totalSelected} total training excercises assigned`,
        disabled: false,
      };
    }

    if (adding > 0) {
      return {
        text: `Add ${adding} Training Excercise${adding > 1 ? "s" : ""}`,
        description: `${totalSelected} training excercises will be assigned`,
        disabled: false,
      };
    }

    if (removing > 0) {
      return {
        text: `Remove ${removing} Training Excercise${removing > 1 ? "s" : ""}`,
        description:
          totalSelected > 0
            ? `${totalSelected} training excercises will remain assigned`
            : "All training excercises will be removed",
        disabled: false,
      };
    }

    return {
      text: "Save Changes",
      description: `${totalSelected} training excercises selected`,
      disabled: false,
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

    return filtered.filter((metric) => metric.is_active);
  }, [allMetrics, selectedCategoryId]);
  return (
    <div className="space-y-6 flex-1 relative z-10 h-full">
      {/* Currently assigned session metrics */}
      {sessionMetrics.length > 0 && (
        <div className="rounded-xl p-4 border-2 border-primary/30 shadow-sm">
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            Training Excercises Currently Assigned to All Players
          </h4>
          <div className="flex flex-wrap gap-2">
            {sessionMetrics.map((metric) => (
              <Badge
                key={metric.id}
                className="text-sm px-3 py-1.5 font-medium bg-primary/10 text-primary border-primary/30 hover:bg-primary/20 transition-all duration-200"
              >
                {metric.name} ({metric.metric_unit?.code || "-"})
              </Badge>
            ))}
          </div>
        </div>
      )}
      {/* Enhanced Category Filter */}
      <div className="rounded-xl border-2 border-primary/30 shadow-sm p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Filter className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm font-semibold text-foreground">
              Filter by category:
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={selectedCategoryId === null ? "default" : "outline"}
              className={cn(
                "cursor-pointer transition-all duration-200 hover:shadow-md",
                selectedCategoryId === null
                  ? "bg-primary text-primary-foreground shadow-lg hover:bg-primary/90"
                  : "hover:bg-primary/10 hover:border-primary/30"
              )}
              onClick={() => setSelectedCategoryId(null)}
            >
              All Categories
            </Badge>
            {categories
              ?.filter((category) => category.is_active)
              .map((category) => (
                <Badge
                  key={category.id}
                  variant={
                    selectedCategoryId === category.id ? "default" : "outline"
                  }
                  className={cn(
                    "cursor-pointer transition-all duration-200 hover:shadow-md",
                    selectedCategoryId === category.id
                      ? "bg-primary text-primary-foreground shadow-lg hover:bg-primary/90"
                      : "hover:bg-primary/10 hover:border-primary/30"
                  )}
                  onClick={() => setSelectedCategoryId(category.id)}
                >
                  {category.name}
                </Badge>
              ))}
          </div>
        </div>
      </div>
      {/* Enhanced Metrics Selection */}
      {metricsLoading ? (
        <div className="flex items-center justify-center py-12 bg-gradient-to-r from-card/30 to-card/50 rounded-xl border border-border/20">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Loading training excercises...</p>
          </div>
        </div>
      ) : filteredMetrics.length > 0 ? (
        <div className="space-y-4 flex-1">
          <div className="flex items-center justify-end">
            <Badge variant="outline" className="text-xs">
              {filteredMetrics.length} training excercises found
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto pr-2">
            {filteredMetrics.map((metric) => {
              const isMetricSelected = selectedMetrics.includes(metric.id);
              const isAssignedToAllPlayers = sessionMetricIds.includes(
                metric.id
              );

              return (
                <div
                  key={metric.id}
                  className={cn(
                    "relative overflow-hidden group flex items-center space-x-3 p-4 rounded-xl border-2 transition-all duration-200",
                    !isFormDisabled && "cursor-pointer hover:shadow-md",
                    isFormDisabled && "cursor-not-allowed opacity-60",
                    isAssignedToAllPlayers &&
                      "bg-primary/10 border-primary/30 shadow-sm",
                    !isAssignedToAllPlayers &&
                      isMetricSelected &&
                      "bg-secondary/10 border-secondary/20 shadow-sm",
                    !isAssignedToAllPlayers &&
                      !isMetricSelected &&
                      "bg-gradient-to-r from-card to-card/80 border-border hover:border-primary/30 hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/10"
                  )}
                  {...(!isFormDisabled && {
                    onClick: () => handleToggleSessionMetric(metric.id),
                  })}
                >
                  {/* Background hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>{" "}
                  <SimpleCheckbox
                    id={`metric-${metric.id}`}
                    checked={isMetricSelected}
                    onChange={
                      !isFormDisabled
                        ? () => handleToggleSessionMetric(metric.id)
                        : undefined
                    }
                    disabled={isFormDisabled}
                    className="relative z-10"
                  />
                  <div className="flex-1 relative z-10">
                    {" "}
                    <Label
                      htmlFor={`metric-${metric.id}`}
                      className={cn(
                        "text-sm font-semibold leading-none flex items-center gap-2",
                        !isFormDisabled && "cursor-pointer",
                        isFormDisabled && "cursor-not-allowed",
                        isAssignedToAllPlayers && "text-primary",
                        !isAssignedToAllPlayers &&
                          isMetricSelected &&
                          "text-secondary",
                        !isAssignedToAllPlayers &&
                          !isMetricSelected &&
                          "text-foreground"
                      )}
                    >
                      {metric.name}
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      {metric.description} ({metric.metric_unit_data?.code || "-"})
                    </p>
                  </div>
                  <div className="relative z-10">
                    {metric.category_name && (
                      <Badge
                        variant="outline"
                        className="text-xs bg-muted/50 border-muted-foreground/20"
                      >
                        {metric.category_name ||
                          (typeof metric.category === "object"
                            ? metric.category.name
                            : "")}
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <ContentEmpty
          title="No training metrics found"
          description="No training metrics are currently available for this session. Please add training metrics to assign them to this session."
        />
      )}
      {/* Enhanced Save Section */}
      <div className="rounded-xl border-2 border-primary/30 shadow-sm p-4">
        <div className="flex flex-col md:flex-row items-center gap-2 justify-between">
          <div className="flex gap-2">
            <p className="text-sm font-medium text-foreground mb-1">
              {getButtonInfo().description}
            </p>
          </div>{" "}
          <Button
            onClick={handleSaveSessionMetrics}
            disabled={getButtonInfo().disabled || isFormDisabled}
            variant={
              changesInfo.removing > 0 && changesInfo.adding === 0
                ? "destructive"
                : "default"
            }
            className={cn(
              "transition-all duration-200 shadow-lg hover:shadow-xl w-full md:w-auto",
              !getButtonInfo().disabled &&
                !isFormDisabled &&
                changesInfo.adding > 0 &&
                "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
            )}
          >
            <CheckCircle2 className="h-4 w-4" />
            {getButtonInfo().text}
          </Button>
        </div>{" "}
      </div>
    </div>
  );
};

export default SessionMetricsTab;
