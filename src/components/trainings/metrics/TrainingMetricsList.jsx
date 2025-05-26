import React, { useState } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  useTrainingMetrics,
  useTrainingCategories,
} from "@/hooks/useTrainings";
import MetricCard from "./MetricCard";
import TrainingMetricFormDialog from "@/components/modals/trainings/TrainingMetricFormDialog";
import {
  TabLayout,
  TabHeader,
  TabContent,
  TabCard,
  TabLoading,
  TabError,
} from "@/components/common/TabLayout";

/**
 * Component for displaying and managing training metrics
 */
const TrainingMetricsList = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const {
    data: metrics,
    isLoading,
    isError,
  } = useTrainingMetrics(selectedCategoryId);
  const { data: categories } = useTrainingCategories();
  const [openDialog, setOpenDialog] = useState(false);
  const [editMetric, setEditMetric] = useState(null);
  if (isLoading) return <TabLoading />;
  if (isError) return <TabError message="Error loading metrics" />;

  const openCreateDialog = () => {
    setEditMetric(null);
    setOpenDialog(true);
  };

  const openEditDialog = (metric) => {
    setEditMetric(metric);
    setOpenDialog(true);
  };
  return (
    <TabLayout>
      <TabHeader
        title="Training Metrics"
        description="Configure and manage training performance metrics"
        actions={
          <Button onClick={openCreateDialog}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Metric
          </Button>
        }
      />

      <TabContent>
        {/* Category Filter */}
        <TabCard className="mb-6">
          <div className="space-y-3">
            <div className="text-sm font-medium">Filter by Category:</div>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={selectedCategoryId === null ? "default" : "outline"}
                className="cursor-pointer px-3 py-1 text-xs sm:text-sm border-primary"
                style={{
                  backgroundColor:
                    selectedCategoryId === null
                      ? "var(--primary)"
                      : "transparent",
                  borderColor: "var(--primary)",
                  color:
                    selectedCategoryId === null ? "white" : "var(--primary)",
                }}
                onClick={() => setSelectedCategoryId(null)}
              >
                All Categories
              </Badge>
              {categories?.map((category) => (
                <Badge
                  key={category.id}
                  variant={
                    selectedCategoryId === category.id ? "default" : "outline"
                  }
                  className="cursor-pointer text-foreground px-3 py-1 text-xs sm:text-sm"
                  style={{
                    backgroundColor:
                      selectedCategoryId === category.id
                        ? "var(--primary)"
                        : "transparent",
                    borderColor: "var(--primary)",
                    color:
                      selectedCategoryId === category.id
                        ? "white"
                        : "var(--primary)",
                  }}
                  onClick={() => setSelectedCategoryId(category.id)}
                >
                  {category.name}
                </Badge>
              ))}
            </div>
          </div>
        </TabCard>
        {/* Metrics Grid */}
        {metrics.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
            {metrics.map((metric) => (
              <MetricCard
                key={metric.id}
                metric={metric}
                categoryColor={"var(--primary)"}
                onEdit={openEditDialog}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">No metrics found</h3>
            <p className="text-muted-foreground mb-4 px-4">
              {selectedCategoryId
                ? "No metrics in this category. Try selecting a different category or create a new metric."
                : "Get started by creating your first training metric to track player performance."}
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              {selectedCategoryId && (
                <Button
                  variant="outline"
                  onClick={() => setSelectedCategoryId(null)}
                >
                  View All Categories
                </Button>
              )}
              <Button onClick={openCreateDialog}>
                <PlusIcon className="mr-2 h-4 w-4" />
                Create Metric
              </Button>
            </div>
          </div>
        )}
      </TabContent>

      <TrainingMetricFormDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        metric={editMetric}
        categories={categories}
      />
    </TabLayout>
  );
};

export default TrainingMetricsList;
