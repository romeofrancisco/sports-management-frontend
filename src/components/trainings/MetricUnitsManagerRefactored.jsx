import React, { useState } from "react";
import {
  useMetricUnits,
  useCreateMetricUnit,
  useUpdateMetricUnit,
  useDeleteMetricUnit,
} from "../../hooks/useMetricUnits";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { AlertCircle, Edit, Trash, Plus } from "lucide-react";
import { toast } from "sonner";
import MetricUnitForm from "./MetricUnitForm";

// Explanation component for normalization weights
const WeightExplanation = () => (
  <div className="mb-6 p-4 bg-muted/50 rounded-lg border">
    <h4 className="text-sm font-medium flex items-center gap-2">
      <AlertCircle className="h-4 w-4" /> About Normalization Weights
    </h4>
    <p className="text-xs text-muted-foreground mt-2">
      Normalization weights are multipliers applied to percentage improvements to prevent metrics with naturally large changes 
      (like repetitions) from dominating improvement calculations. Use lower values (0.1-0.5) for metrics that typically show 
      large percentage changes, and values closer to 1.0 for metrics with smaller percentage changes.
    </p>
  </div>
);

// Confirmation dialog for deletion
const DeleteConfirmDialog = ({ open, onOpenChange, unit, onConfirm, isLoading }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete Metric Unit</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete "{unit?.name}"? This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={onConfirm} disabled={isLoading}>
          {isLoading ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);

// Form dialog component
const MetricUnitFormDialog = ({ open, onOpenChange, unit, onSubmit, isLoading }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>
          {unit ? "Edit Metric Unit" : "Add Metric Unit"}
        </DialogTitle>
        <DialogDescription>
          {unit
            ? "Update details for this unit of measurement."
            : "Add a new unit of measurement for training metrics."}
        </DialogDescription>
      </DialogHeader>
      
      <MetricUnitForm
        unit={unit}
        onSubmit={onSubmit}
        onCancel={() => onOpenChange(false)}
        isLoading={isLoading}
        showActions={true}
      />
    </DialogContent>
  </Dialog>
);

// Table component for displaying units
const MetricUnitsTable = ({ units, isLoading, onEdit, onDelete }) => {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Weight</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {units.length > 0 ? (
            units.map((unit) => (
              <TableRow key={unit.id}>
                <TableCell className="font-medium">{unit.code}</TableCell>
                <TableCell>{unit.name}</TableCell>
                <TableCell>×{unit.normalization_weight.toFixed(2)}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {unit.description || "-"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={() => onEdit(unit)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      className="h-8 w-8 p-0"
                      onClick={() => onDelete(unit)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-32 text-center">
                No metric units found. Click "Add Unit" to create your first unit.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

// Main component
export const MetricUnitsManager = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [unitToDelete, setUnitToDelete] = useState(null);

  const { data: units = [], isLoading } = useMetricUnits();
  const createMutation = useCreateMetricUnit();
  const updateMutation = useUpdateMetricUnit();
  const deleteMutation = useDeleteMetricUnit();

  const handleSubmit = (data) => {
    if (selectedUnit) {
      // Update existing unit
      updateMutation.mutate({ id: selectedUnit.id, ...data }, {
        onSuccess: () => {
          setIsDialogOpen(false);
          setSelectedUnit(null);
          toast.success("Unit updated successfully");
        },
        onError: (error) => {
          toast.error("Failed to update unit: " + (error.response?.data?.detail || error.message));
        }
      });
    } else {
      // Create new unit
      createMutation.mutate(data, {
        onSuccess: () => {
          setIsDialogOpen(false);
          toast.success("Unit created successfully");
        },
        onError: (error) => {
          toast.error("Failed to create unit: " + (error.response?.data?.detail || error.message));
        }
      });
    }
  };

  const handleEdit = (unit) => {
    setSelectedUnit(unit);
    setIsDialogOpen(true);
  };

  const handleDelete = (unit) => {
    setUnitToDelete(unit);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!unitToDelete) return;
    
    deleteMutation.mutate(unitToDelete.id, {
      onSuccess: () => {
        setDeleteConfirmOpen(false);
        setUnitToDelete(null);
        toast.success("Unit deleted successfully");
      },
      onError: (error) => {
        toast.error("Failed to delete unit: " + (error.response?.data?.detail || error.message));
      }
    });
  };

  const handleAddNew = () => {
    setSelectedUnit(null);
    setIsDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Metric Units</CardTitle>
            <CardDescription>
              Manage units of measurement for training metrics
            </CardDescription>
          </div>
          <Button onClick={handleAddNew} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Unit
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <WeightExplanation />
        
        <MetricUnitsTable
          units={units}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        
        <MetricUnitFormDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          unit={selectedUnit}
          onSubmit={handleSubmit}
          isLoading={createMutation.isLoading || updateMutation.isLoading}
        />
        
        <DeleteConfirmDialog
          open={deleteConfirmOpen}
          onOpenChange={setDeleteConfirmOpen}
          unit={unitToDelete}
          onConfirm={handleDeleteConfirm}
          isLoading={deleteMutation.isLoading}
        />
      </CardContent>
    </Card>
  );
};
