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
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Textarea } from "../ui/textarea";
import { Skeleton } from "../ui/skeleton";
import { AlertCircle, Edit, Trash, Plus } from "lucide-react";
import { toast } from "sonner";

const MetricUnitForm = ({
  isOpen,
  onClose,
  unit = null,
  onSubmit,
  isLoading,
}) => {
  const [formData, setFormData] = useState({
    code: unit?.code || "",
    name: unit?.name || "",
    normalization_weight: unit?.normalization_weight || 1.0,
    description: unit?.description || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "normalization_weight" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.code.trim() || !formData.name.trim()) {
      toast.error("Code and name are required.");
      return;
    }

    if (unit) {
      // Update existing unit
      onSubmit({ id: unit.id, ...formData });
    } else {
      // Create new unit
      onSubmit(formData);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{unit ? "Edit Metric Unit" : "Add Metric Unit"}</DialogTitle>
          <DialogDescription>
            {unit
              ? "Update details for this unit of measurement."
              : "Add a new unit of measurement for training metrics."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="code" className="text-right">
                Code
              </Label>
              <Input
                id="code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className="col-span-3"
                placeholder="e.g. kg, cm, seconds, reps"
                required
                maxLength={30}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="col-span-3"
                placeholder="e.g. Kilograms, Centimeters"
                required
                maxLength={100}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="normalization_weight" className="text-right">
                Weight
              </Label>
              <Input
                id="normalization_weight"
                name="normalization_weight"
                type="number"
                step="0.01"
                min="0.01"
                max="2"
                value={formData.normalization_weight}
                onChange={handleChange}
                className="col-span-3"
                placeholder="1.0"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right mt-2">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="col-span-3"
                placeholder="Description of this unit"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

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

export const MetricUnitsManager = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [unitToDelete, setUnitToDelete] = useState(null);

  const { data: units = [], isLoading } = useMetricUnits();
  const createMutation = useCreateMetricUnit();
  const updateMutation = useUpdateMetricUnit();
  const deleteMutation = useDeleteMetricUnit();

  const handleCreateUnit = (data) => {
    createMutation.mutate(data, {
      onSuccess: () => setIsDialogOpen(false),
    });
  };

  const handleUpdateUnit = (data) => {
    updateMutation.mutate(data, {
      onSuccess: () => {
        setIsDialogOpen(false);
        setSelectedUnit(null);
      },
    });
  };

  const handleDeleteUnit = () => {
    if (!unitToDelete) return;
    
    deleteMutation.mutate(unitToDelete.id, {
      onSuccess: () => {
        setDeleteConfirmOpen(false);
        setUnitToDelete(null);
      },
    });
  };

  const openEditDialog = (unit) => {
    setSelectedUnit(unit);
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (unit) => {
    setUnitToDelete(unit);
    setDeleteConfirmOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Metric Units</CardTitle>
            <CardDescription>
              Manage units of measurement and their normalization weights
            </CardDescription>
          </div>
          <Button
            onClick={() => {
              setSelectedUnit(null);
              setIsDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Unit
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <WeightExplanation />
        
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Norm. Weight</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {units.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No metric units defined yet. Add your first one!
                    </TableCell>
                  </TableRow>
                ) : (
                  units.map((unit) => (
                    <TableRow key={unit.id}>
                      <TableCell className="font-medium">{unit.code}</TableCell>
                      <TableCell>{unit.name}</TableCell>
                      <TableCell>{unit.normalization_weight}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {unit.description || "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(unit)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openDeleteDialog(unit)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {/* Create/Edit Modal */}
      <MetricUnitForm
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedUnit(null);
        }}
        unit={selectedUnit}
        onSubmit={selectedUnit ? handleUpdateUnit : handleCreateUnit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Unit</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the "{unitToDelete?.name}" unit? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteUnit}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
