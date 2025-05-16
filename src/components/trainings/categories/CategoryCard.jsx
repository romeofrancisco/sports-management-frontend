import React, { useState } from "react";
import { PencilIcon, TrashIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useDeleteTrainingCategory } from "@/hooks/useTrainings";

/**
 * Component for displaying a training category card
 *
 * @param {Object} props
 * @param {Object} props.category - The category data
 * @param {Function} props.onEdit - Function to call when edit button is clicked
 * @param {Function} props.onDeleted - Optional callback after successful deletion
 */
const CategoryCard = ({ category, onEdit, onDeleted }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { mutateAsync: deleteCategory, isPending: isDeleting } =
    useDeleteTrainingCategory();
  const handleDelete = async () => {
    try {
      await deleteCategory(category.id);
      // Toast notification is handled by the mutation
      if (onDeleted) onDeleted();
    } catch (error) {
      // Error toast notification is handled by the mutation
      console.error("Error deleting category:", error);
    }
  };
  return (
    <Card className="overflow-hidden border-l-8 border-l-primary">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>{category.name}</CardTitle>
          <div className="flex space-x-1">
            <Button size="sm" variant="ghost" onClick={() => onEdit(category)}>
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
        <CardDescription>{category.description}</CardDescription>
      </CardHeader>

      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete "{category.name}"? This action
            cannot be undone.
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

export default CategoryCard;
