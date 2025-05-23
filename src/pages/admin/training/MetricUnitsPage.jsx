import React, { useState } from "react";
import { useMetricUnits, useDeleteMetricUnit } from "@/hooks/useMetricUnits";
import { Button } from "@/components/ui/button";
import { PlusCircle, Pencil, Trash2, Loader2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import MetricUnitFormDialog from "@/components/modals/trainings/MetricUnitFormDialog";
import { Input } from "@/components/ui/input";
import { 
  AlertDialog, AlertDialogAction, AlertDialogCancel, 
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter, 
  AlertDialogHeader, AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";

const MetricUnitsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [unitToDelete, setUnitToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: units = [], isLoading } = useMetricUnits();
  const { mutate: deleteUnit, isLoading: isDeleting } = useDeleteMetricUnit();

  const filteredUnits = React.useMemo(() => {
    if (!searchQuery.trim()) return units;
    const lowerQuery = searchQuery.toLowerCase();
    return units.filter(
      unit =>
        unit.code.toLowerCase().includes(lowerQuery) ||
        unit.name.toLowerCase().includes(lowerQuery) ||
        unit.description.toLowerCase().includes(lowerQuery)
    );
  }, [units, searchQuery]);

  const handleOpenModal = (unit = null) => {
    setSelectedUnit(unit);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUnit(null);
  };

  const handleDeleteClick = (unit) => {
    setUnitToDelete(unit);
  };

  const handleConfirmDelete = () => {
    if (!unitToDelete) return;
    
    deleteUnit(unitToDelete.id, {
      onSuccess: () => {
        toast({
          title: "Unit Deleted",
          description: `${unitToDelete.name} has been removed.`,
        });
        setUnitToDelete(null);
      },
      onError: (error) => {
        toast({
          title: "Delete Failed",
          description: error.response?.data?.detail || "Failed to delete unit",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Metric Units</h2>
        <Button onClick={() => handleOpenModal()} className="flex items-center gap-1">
          <PlusCircle className="h-4 w-4" />
          <span>Add Unit</span>
        </Button>
      </div>

      <div className="mb-4">
        <Input
          placeholder="Search units..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

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
                <TableHead>Weight</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUnits.length > 0 ? (
                filteredUnits.map((unit) => (
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
                          onClick={() => handleOpenModal(unit)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          className="h-8 w-8 p-0"
                          onClick={() => handleDeleteClick(unit)}
                          disabled={unit.metrics?.length > 0}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center">
                    No units found.
                    {searchQuery ? " Try adjusting your search." : ""}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <MetricUnitFormDialog
        open={isModalOpen}
        onOpenChange={handleCloseModal}
        unit={selectedUnit}
      />

      <AlertDialog open={!!unitToDelete} onOpenChange={() => setUnitToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {unitToDelete?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the unit of measurement.
              This action cannot be undone if the unit is not in use.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-destructive hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default MetricUnitsPage;
