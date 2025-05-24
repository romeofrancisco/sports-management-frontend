import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  useTrainingMetrics,
  useTrainingCategories,
} from "@/hooks/useTrainings";
import { Loader2, Filter, Check } from "lucide-react";
import { toast } from "sonner";
import { useAssignSessionMetrics } from "@/hooks/useTrainings";

const SessionMetricsConfigModal = ({
  isOpen,
  onClose,
  session,
  sessionMetrics = [],
}) => {
  const { mutate: assignMetrics } = useAssignSessionMetrics();
  const [selectedMetrics, setSelectedMetrics] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  // Fetch all metrics and categories
  const { data: allMetrics, isLoading: metricsLoading } = useTrainingMetrics();
  const { data: categories } = useTrainingCategories();

  // Initialize selected metrics when modal opens or session changes
  useEffect(() => {
    if (isOpen && sessionMetrics.length > 0) {
      setSelectedMetrics(sessionMetrics.map((metric) => metric.id));
    } else if (isOpen) {
      setSelectedMetrics([]);
    }
  }, [isOpen, sessionMetrics]);

  // Filter metrics based on selected category
  const filteredMetrics = React.useMemo(() => {
    if (!allMetrics) return [];

    // Filter by category if one is selected
    let filtered = allMetrics;
    if (selectedCategoryId) {
      filtered = allMetrics.filter((metric) => {
        if (typeof metric.category === "object") {
          return metric.category.id === selectedCategoryId;
        }
        return metric.category === selectedCategoryId;
      });
    } // Filter based on active tab
    if (activeTab === "selected") {
      // Only show metrics that have been selected
      filtered = filtered.filter((metric) =>
        selectedMetrics.includes(metric.id)
      );
    } else if (activeTab === "unselected") {
      // Only show metrics that haven't been selected and aren't in session metrics
      filtered = filtered.filter(
        (metric) => !selectedMetrics.includes(metric.id)
      );
    } else {
      // In "all" tab, prioritize showing session metrics first
      filtered = [
        ...filtered.filter((metric) => selectedMetrics.includes(metric.id)),
        ...filtered.filter((metric) => !selectedMetrics.includes(metric.id)),
      ];
    }

    return filtered;
  }, [allMetrics, selectedCategoryId, activeTab, selectedMetrics]);

  // Handle toggling a metric selection
  const handleToggleMetric = (metricId) => {
    setSelectedMetrics((prev) => {
      if (prev.includes(metricId)) {
        return prev.filter((id) => id !== metricId);
      } else {
        return [...prev, metricId];
      }
    });
  };

  // Handle selecting or deselecting all visible metrics
  const handleToggleAll = (select) => {
    setSelectedMetrics((prev) => {
      if (select) {
        // Add all currently filtered metrics to selection
        const newMetricIds = filteredMetrics
          .filter((metric) => !prev.includes(metric.id))
          .map((metric) => metric.id);
        return [...prev, ...newMetricIds];
      } else {
        // Remove all currently filtered metrics from selection
        return prev.filter(
          (id) => !filteredMetrics.some((metric) => metric.id === id)
        );
      }
    });
  };
  // Handle saving the configuration
  const handleSave = () => {
    assignMetrics({
      sessionId: session.id,
      metricIds: selectedMetrics,
    });
    onClose();
  };

  if (!session) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle>Configure Metrics for {session.title}</DialogTitle>
          <DialogDescription>
            Select which metrics should be recorded for this training session.
            {session.date && (
              <span className="block mt-1 text-sm">
                Session Date: {session.date}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[70vh]">
          <div className="flex flex-col space-y-4 flex-1">
            {/* Filter controls */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex flex-wrap gap-2 items-center flex-1">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filter by category:</span>
                <div className="flex flex-wrap gap-1">
                  <Badge
                    variant={
                      selectedCategoryId === null ? "default" : "outline"
                    }
                    className="cursor-pointer"
                    onClick={() => setSelectedCategoryId(null)}
                  >
                    All
                  </Badge>
                  {categories?.map((category) => (
                    <Badge
                      key={category.id}
                      variant={
                        selectedCategoryId === category.id
                          ? "default"
                          : "outline"
                      }
                      className="cursor-pointer"
                      onClick={() => setSelectedCategoryId(category.id)}
                    >
                      {category.name}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleToggleAll(true)}
                >
                  Select All
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleToggleAll(false)}
                >
                  Deselect All
                </Button>
              </div>
            </div>

            {/* Tabs for filtering */}
            <Tabs
              defaultValue="all"
              value={activeTab}
              onValueChange={setActiveTab}
              className="flex-1 flex flex-col"
            >
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="all">All Metrics</TabsTrigger>
                <TabsTrigger value="selected">
                  Selected ({selectedMetrics.length})
                </TabsTrigger>
                <TabsTrigger value="unselected">
                  Unselected (
                  {allMetrics ? allMetrics.length - selectedMetrics.length : 0})
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value={activeTab}
                className="flex-1 data-[state=active]:flex data-[state=active]:flex-col"
              >
                {metricsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : filteredMetrics.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No metrics found for the selected filters.
                  </div>
                ) : (
                  <ScrollArea className="flex-1 pr-4">
                    <div className="space-y-2">
                      {filteredMetrics.map((metric) => (
                        <div
                          key={metric.id}
                          className="flex items-center space-x-3 rounded-md border p-3 transition-colors hover:bg-muted/50"
                        >
                          <Checkbox
                            id={`metric-${metric.id}`}
                            checked={selectedMetrics.includes(metric.id)}
                            onCheckedChange={() =>
                              handleToggleMetric(metric.id)
                            }
                          />
                          <div className="flex-1">
                            <Label
                              htmlFor={`metric-${metric.id}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              {metric.name}
                            </Label>
                            <p className="text-xs text-muted-foreground mt-1">
                              {metric.description} (
                              {metric.metric_unit?.code || "-"})
                            </p>
                          </div>
                          {metric.category_name && (
                            <Badge variant="outline" className="text-xs">
                              {metric.category_name ||
                                (typeof metric.category === "object"
                                  ? metric.category.name
                                  : "")}
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
        <DialogFooter className="pt-4">
          <div className="flex items-center text-xs text-muted-foreground mr-auto">
            {selectedMetrics.length} metrics selected
          </div>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Configuration</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SessionMetricsConfigModal;
