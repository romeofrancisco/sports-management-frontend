import React, { useState } from "react";
import { PencilIcon, TrashIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useDeleteTrainingMetric } from "@/hooks/useTrainings";

/**
 * Component for displaying a training metric card
 *
 * @param {Object} props
 * @param {Object} props.metric - The metric data
 * @param {string} props.categoryColor - Legacy parameter, no longer used
 * @param {Function} props.onEdit - Function to call when edit button is clicked
 * @param {Function} props.onDeleted - Optional callback after successful deletion
 */
const MetricCard = ({ metric, categoryColor = '#007bff', onEdit, onDeleted }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { mutateAsync: deleteMetric, isPending: isDeleting } = useDeleteTrainingMetric();
  const handleDelete = async () => {
    try {
      await deleteMetric(metric.id);
      // Toast notification is handled by the mutation
      if (onDeleted) onDeleted();
    } catch (error) {
      // Error toast notification is handled by the mutation
      console.error("Error deleting metric:", error);
    }
  };

  return (
    <Card
      className="overflow-hidden"
      style={{ borderLeft: `4px solid ${categoryColor}` }}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{metric.name}</CardTitle>
            <div className="text-sm text-muted-foreground mt-1">
              Unit: {metric.unit} |{" "}
              {metric.is_lower_better ? "Lower is better" : "Higher is better"}
            </div>
          </div>
          <div className="flex space-x-1">
            <Button size="sm" variant="ghost" onClick={() => onEdit(metric)}>
              <PencilIcon className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setConfirmDelete(true)}
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm">{metric.description}</p>
        {metric.category && (
          <div className="flex flex-wrap gap-1 mt-2">
            <Badge style={{ backgroundColor: "#007bff" }}>
              {typeof metric.category === 'object' ? metric.category.name : metric.category_name || metric.category}
            </Badge>
          </div>
        )}
      </CardContent>

      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete "{metric.name}"? This action cannot
            be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default MetricCard;
