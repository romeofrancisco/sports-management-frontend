import React, { useState } from "react";
import {
  useTrainingMetrics,
  useTrainingCategories,
  useDeleteTrainingMetric,
} from "../../../hooks/useTrainings";
import { useRolePermissions } from "../../../hooks/useRolePermissions";
import { Button } from "../../ui/button";
import { AlertCircle, Dumbbell, Plus } from "lucide-react";
import { useModal } from "@/hooks/useModal";
import TrainingMetricFormDialog from "../../modals/trainings/TrainingMetricFormDialog";
import { DeleteConfirmDialog } from "../dialogs/DeleteConfirmDialog";
import { TrainingMetricsTable } from "../tables/TrainingMetricsTable";
import {
  TabLayout,
  TabHeader,
  TabContent,
  TabCard,
} from "@/components/common/TabLayout";
import { toast } from "sonner";

// Explanation component for training metrics
const TrainingMetricsExplanation = () => (
  <TabCard>
    <h4 className="text-sm sm:text-base font-medium flex items-center gap-2 mb-3">
      <AlertCircle className="h-4 w-4 text-muted-foreground" />
      About Training Metrics
    </h4>
    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
      Training metrics define the specific performance indicators used to track
      player progress during training sessions. Each metric has a direction
      (higher/lower is better) and weight that determines its importance in
      overall evaluations. Metrics are organized by categories to help structure
      training assessments effectively.
    </p>
  </TabCard>
);

// Main component
export const TrainingMetricsManager = () => {
  const { canCreateTrainingMetrics, canModifyTrainingMetric } =
    useRolePermissions();

  const modals = {
    metric: useModal(),
    delete: useModal(),
  };

  const [selectedMetric, setSelectedMetric] = useState(null);
  const [metricToDelete, setMetricToDelete] = useState(null);

  const { data: metrics = [], isLoading, refetch } = useTrainingMetrics();
  const { data: categories = [] } = useTrainingCategories();
  const deleteMetricMutation = useDeleteTrainingMetric();

  const handleEdit = (metric) => {
    if (!canModifyTrainingMetric(metric)) {
      toast.error("You don't have permission to edit this metric");
      return;
    }
    setSelectedMetric(metric);
    modals.metric.openModal();
  };

  const handleDelete = (metric) => {
    if (!canModifyTrainingMetric(metric)) {
      toast.error("You don't have permission to delete this metric");
      return;
    }
    setMetricToDelete(metric);
    modals.delete.openModal();
  };

  const handleCreate = () => {
    if (!canCreateTrainingMetrics()) {
      toast.error("You don't have permission to create metrics");
      return;
    }
    setSelectedMetric(null);
    modals.metric.openModal();
  };

  const handleMetricSaved = () => {
    refetch();
    modals.metric.closeModal();
    setSelectedMetric(null);
  };

  const handleMetricDeleted = () => {
    refetch();
    modals.delete.closeModal();
    setMetricToDelete(null);
  };

  return (
    <TabLayout>
      <TabHeader
        title="Training Metrics"
        icon={Dumbbell}
        description="Configure and manage training performance metrics for tracking player progress"
        actions={
          canCreateTrainingMetrics() && (
            <Button onClick={handleCreate}>
              <Plus />
              Add Metric
            </Button>
          )
        }
      />

      <TabContent>
        <TrainingMetricsExplanation />

        <TabCard className="border-0 shadow-none p-0 sm:p-0">
          <TrainingMetricsTable
            metrics={metrics}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabCard>
      </TabContent>

      {/* Dialogs */}
      <TrainingMetricFormDialog
        open={modals.metric.isOpen}
        onOpenChange={modals.metric.closeModal}
        metric={selectedMetric}
        categories={categories}
        onSuccess={handleMetricSaved}
      />

      <DeleteConfirmDialog
        open={modals.delete.isOpen}
        onOpenChange={modals.delete.closeModal}
        item={metricToDelete}
        onSuccess={handleMetricDeleted}
        deleteMutation={deleteMetricMutation}
        title="Delete Training Metric"
        description={`Are you sure you want to delete "${metricToDelete?.name}"? This action cannot be undone and may affect existing training records.`}
      />
    </TabLayout>
  );
};
