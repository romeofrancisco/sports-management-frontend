import React, { useState } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  useTrainingMetrics,
  useTrainingCategories,
} from "@/hooks/useTrainings";
import MetricCard from "./MetricCard";
import TrainingMetricFormDialog from "@/components/modals/TrainingMetricFormDialog";

/**
 * Component for displaying and managing training metrics
 */
const TrainingMetricsList = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const { data: metrics, isLoading, isError } = useTrainingMetrics(selectedCategoryId);
  const { data: categories } = useTrainingCategories();
  const [openDialog, setOpenDialog] = useState(false);
  const [editMetric, setEditMetric] = useState(null);

  if (isLoading)
    return <div className="flex justify-center p-4">Loading metrics...</div>;
  if (isError)
    return (
      <div className="text-red-500 p-4">
        Error loading metrics
      </div>
    );

  const openCreateDialog = () => {
    setEditMetric(null);
    setOpenDialog(true);
  };

  const openEditDialog = (metric) => {
    setEditMetric(metric);
    setOpenDialog(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Training Metrics</h2>
        <Button onClick={openCreateDialog}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Metric
        </Button>
      </div>

      <div className="my-4">
        <div className="mb-2 font-medium">Filter by Category:</div>
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={selectedCategoryId === null ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedCategoryId(null)}
          >
            All
          </Badge>
          {categories.map((category) => (
            <Badge
              key={category.id}
              variant={
                selectedCategoryId === category.id ? "default" : "outline"
              }
              className="cursor-pointer"
              style={{
                backgroundColor:
                  selectedCategoryId === category.id
                    ? "#007bff"
                    : "transparent",
                borderColor: "#007bff",
                color: selectedCategoryId === category.id ? "white" : undefined,
              }}
              onClick={() => setSelectedCategoryId(category.id)}
            >
              {category.name}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <MetricCard
            key={metric.id}
            metric={metric}
            categoryColor={"#007bff"}
            onEdit={openEditDialog}
          />
        ))}

        {metrics.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500">
            No metrics found.{" "}
            {selectedCategoryId ? "Try selecting a different category or " : ""}
            <Button variant="link" onClick={openCreateDialog} className="p-0">
              create a new metric
            </Button>
            .
          </div>
        )}
      </div>

      <TrainingMetricFormDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        metric={editMetric}
        categories={categories}
      />
    </div>
  );
};

export default TrainingMetricsList;
