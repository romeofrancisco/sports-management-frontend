import React, { useState } from "react";
import { useMetricUnits } from "../../../hooks/useMetricUnits";
import { Button } from "../../ui/button";
import { AlertCircle, Plus } from "lucide-react";
import { useModal } from "@/hooks/useModal";
import { MetricUnitFormDialog } from "../dialogs/MetricUnitFormDialog";
import { DeleteConfirmDialog } from "../dialogs/DeleteConfirmDialog";
import { MetricUnitsTable } from "../tables/MetricUnitsTable";
import { TabLayout, TabHeader, TabContent, TabCard } from "@/components/common/TabLayout";

// Explanation component for normalization weights
const WeightExplanation = () => (
  <TabCard>
    <h4 className="text-sm sm:text-base font-medium flex items-center gap-2 mb-3">
      <AlertCircle className="h-4 w-4 text-muted-foreground" />
      About Normalization Weights
    </h4>
    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
      Normalization weights are multipliers applied to percentage improvements
      to prevent metrics with naturally large changes (like repetitions) from
      dominating improvement calculations. Use lower values (0.1-0.5) for
      metrics that typically show large percentage changes, and values closer to
      1.0 for metrics with smaller percentage changes.
    </p>
  </TabCard>
);

// Main component
export const MetricUnitsManager = () => {
  const modals = {
    unit: useModal(),
    delete: useModal(),
  };

  const [selectedUnit, setSelectedUnit] = useState(null);
  const [unitToDelete, setUnitToDelete] = useState(null);

  const { data: units = [], isLoading, refetch } = useMetricUnits();

  const handleEdit = (unit) => {
    setSelectedUnit(unit);
    modals.unit.openModal();
  };

  const handleDelete = (unit) => {
    setUnitToDelete(unit);
    modals.delete.openModal();
  };

  const handleAddNew = () => {
    setSelectedUnit(null);
    modals.unit.openModal();
  };

  const handleFormSuccess = () => {
    // Refresh the data after successful operations
    refetch();
  };

  const handleDeleteSuccess = () => {
    // Reset delete state and refresh data
    setUnitToDelete(null);
    refetch();  };  return (
    <TabLayout>
      <TabHeader
        title="Metric Units"
        description="Manage units of measurement for training metrics"
        actions={
          <Button onClick={handleAddNew} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Unit
          </Button>
        }
      />

      <TabContent>
        <WeightExplanation />

        <MetricUnitsTable
          units={units}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </TabContent>

      <MetricUnitFormDialog
        open={modals.unit.isOpen}
        onOpenChange={modals.unit.closeModal}
        unit={selectedUnit}
        onSuccess={handleFormSuccess}
      />

      <DeleteConfirmDialog
        open={modals.delete.isOpen}
        onOpenChange={modals.delete.closeModal}
        unit={unitToDelete}
        onSuccess={handleDeleteSuccess}
      />
    </TabLayout>
  );
};
