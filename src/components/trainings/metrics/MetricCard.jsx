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
const MetricCard = ({
  metric,
  categoryColor = "#007bff",
  onEdit,
  onDeleted,
}) => {
  console.log("MetricCard rendered with metric:", metric);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { mutateAsync: deleteMetric, isPending: isDeleting } =
    useDeleteTrainingMetric();
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
      className="overflow-hidden hover:shadow-md transition-shadow"
      style={{ borderLeft: `4px solid ${categoryColor}` }}
    >
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg sm:text-xl truncate pr-2">
              {metric.name}
            </CardTitle>
            <div className="text-xs sm:text-sm text-muted-foreground mt-2 space-y-1">
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="bg-muted px-2 py-1 rounded text-muted-foreground">
                  Unit: {metric.metric_unit_data?.name || "-"}
                </span>
                <span
                  className={`px-2 py-1 rounded ${
                    metric.is_lower_better
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                      : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                  }`}
                >
                  {metric.is_lower_better
                    ? "Lower is better"
                    : "Higher is better"}
                </span>
              </div>
            </div>
          </div>
          <div className="flex space-x-2 sm:space-x-1 justify-end sm:justify-start">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(metric)}
              className="flex-1 sm:flex-none"
            >
              <PencilIcon className="h-4 w-4 sm:mr-0 mr-2" />
              <span className="sm:hidden">Edit</span>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setConfirmDelete(true)}
              className="flex-1 sm:flex-none text-destructive hover:text-destructive"
            >
              <TrashIcon className="h-4 w-4 sm:mr-0 mr-2" />
              <span className="sm:hidden">Delete</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-sm leading-relaxed line-clamp-3 mb-3">
          {metric.description || "No description provided"}
        </p>
        {metric.category && (
          <div className="flex flex-wrap gap-2">
            <Badge className="text-xs px-2 py-1 bg-primary text-white">
              {typeof metric.category === "object"
                ? metric.category.name
                : metric.category_name || metric.category}
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
