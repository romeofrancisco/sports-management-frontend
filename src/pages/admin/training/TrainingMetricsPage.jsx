import React, { useState } from "react";
import { useTrainingMetrics, useDeleteTrainingMetric } from "@/hooks/useTrainings";
import { Button } from "@/components/ui/button";
import { PlusCircle, Pencil, Trash2, Loader2, ArrowUpDown, ArrowDown, ArrowUp } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import TrainingMetricFormDialog from "@/components/modals/TrainingMetricFormDialog";
import { 
  AlertDialog, AlertDialogAction, AlertDialogCancel, 
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter, 
  AlertDialogHeader, AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";

const TrainingMetricsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [metricToDelete, setMetricToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { metrics, isLoading } = useTrainingMetrics();
  const { deleteMetric, isLoading: isDeleting } = useDeleteTrainingMetric();

  const filteredMetrics = React.useMemo(() => {
    if (!metrics) return [];
    if (!searchQuery.trim()) return metrics;

    const lowerQuery = searchQuery.toLowerCase();
    return metrics.filter(
      metric => 
        metric.name.toLowerCase().includes(lowerQuery) ||
        metric.description.toLowerCase().includes(lowerQuery) ||
        metric.categories_names?.some(catName => catName.toLowerCase().includes(lowerQuery)) ||
        metric.unit.toLowerCase().includes(lowerQuery)
    );
  }, [metrics, searchQuery]);

  const handleOpenModal = (metric = null) => {
    setSelectedMetric(metric);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMetric(null);
  };

  const handleDeleteClick = (metric) => {
    setMetricToDelete(metric);
  };

  const handleConfirmDelete = () => {
    if (!metricToDelete) return;
    
    deleteMetric(metricToDelete.id, {
      onSuccess: () => {
        toast({
          title: "Metric Deleted",
          description: `${metricToDelete.name} has been removed.`,
        });
        setMetricToDelete(null);
      },
      onError: (error) => {
        toast({
          title: "Delete Failed",
          description: `Failed to delete ${metricToDelete.name}: ${error.message}`,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Training Metrics</h2>
        <Button onClick={() => handleOpenModal()} className="flex items-center gap-1">
          <PlusCircle className="h-4 w-4" />
          <span>Add Metric</span>
        </Button>
      </div>

      <div className="mb-4">
        <Input
          placeholder="Search metrics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Better Value</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMetrics.length > 0 ? (
                filteredMetrics.map((metric) => (
                  <TableRow key={metric.id}>
                    <TableCell className="font-medium">{metric.name}</TableCell>                    <TableCell>
                      {metric.category_name || (typeof metric.category === 'object' ? metric.category.name : '')}
                    </TableCell>
                    <TableCell>{metric.unit}</TableCell>
                    <TableCell>
                      {metric.is_lower_better ? (
                        <div className="flex items-center">
                          <ArrowDown className="h-4 w-4 mr-1 text-green-500" />
                          <span>Lower</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                          <span>Higher</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {metric.description || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="h-8 w-8 p-0"
                          onClick={() => handleOpenModal(metric)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          className="h-8 w-8 p-0"
                          onClick={() => handleDeleteClick(metric)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    No metrics found.
                    {searchQuery ? " Try adjusting your search." : ""}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <TrainingMetricFormDialog
        open={isModalOpen}
        onOpenChange={handleCloseModal}
        metric={selectedMetric}
        onSuccess={handleCloseModal}
      />

      <AlertDialog open={!!metricToDelete} onOpenChange={() => setMetricToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {metricToDelete?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the metric and all associated player records.
              This action cannot be undone.
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

export default TrainingMetricsPage;
