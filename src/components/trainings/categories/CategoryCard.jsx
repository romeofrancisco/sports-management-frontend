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
  };  return (
    <Card className="overflow-hidden border-l-4 border-l-primary hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg sm:text-xl truncate pr-2">
              {category.name}
            </CardTitle>
            <CardDescription className="text-sm leading-relaxed line-clamp-3 mt-2">
              {category.description || "No description provided"}
            </CardDescription>
          </div>
          <div className="flex space-x-2 sm:space-x-1 justify-end sm:justify-start">
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => onEdit(category)}
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
