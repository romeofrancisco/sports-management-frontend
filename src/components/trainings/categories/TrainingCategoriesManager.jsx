import React, { useState } from "react";
import {
  useTrainingCategories,
  useDeleteTrainingCategory,
} from "../../../hooks/useTrainings";
import { useRolePermissions } from "../../../hooks/useRolePermissions";
import { Button } from "../../ui/button";
import { AlertCircle, Plus, Loader2, Trash, FolderOpen } from "lucide-react";
import { useModal } from "@/hooks/useModal";
import TrainingCategoryFormDialog from "../../modals/trainings/TrainingCategoryFormDialog";
import { TrainingCategoriesTable } from "../tables/TrainingCategoriesTable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../ui/dialog";
import {
  TabLayout,
  TabHeader,
  TabContent,
  TabCard,
} from "@/components/common/TabLayout";
import { toast } from "sonner";

// Explanation component for training categories
const TrainingCategoriesExplanation = () => (
  <TabCard>
    <h4 className="text-sm sm:text-base font-medium flex items-center gap-2 mb-3">
      <AlertCircle className="h-4 w-4 text-muted-foreground" />
      About Training Categories
    </h4>
    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
      Normalization weights are multipliers applied to percentage-based
      improvements to prevent metrics with naturally large changes (such as
      repetitions) from disproportionately influencing overall improvement
      calculations. Lower values (e.g., 0.1–0.5) should be used for metrics that
      typically show large percentage changes, while values closer to 1.0 are
      appropriate for metrics with smaller or more stable percentage changes.
    </p>
  </TabCard>
);

// Main component
export const TrainingCategoriesManager = () => {
  const { canCreateTrainingCategories, canModifyTrainingCategory } =
    useRolePermissions();

  const modals = {
    category: useModal(),
    delete: useModal(),
  };

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const { data: categories = [], isLoading, refetch } = useTrainingCategories();
  const deleteCategoryMutation = useDeleteTrainingCategory();

  const handleEdit = (category) => {
    if (!canModifyTrainingCategory(category)) {
      toast.error("You don't have permission to edit this category");
      return;
    }
    setSelectedCategory(category);
    modals.category.openModal();
  };

  const handleDelete = (category) => {
    if (!canModifyTrainingCategory(category)) {
      toast.error("You don't have permission to delete this category");
      return;
    }
    setCategoryToDelete(category);
    modals.delete.openModal();
  };

  const handleCreate = () => {
    if (!canCreateTrainingCategories()) {
      toast.error("You don't have permission to create categories");
      return;
    }
    setSelectedCategory(null);
    modals.category.openModal();
  };

  const handleCategorySaved = () => {
    refetch();
    modals.category.closeModal();
    setSelectedCategory(null);
    toast.success(
      selectedCategory
        ? "Category updated successfully"
        : "Category created successfully"
    );
  };

  const handleCategoryDeleted = () => {
    if (!categoryToDelete) return;

    deleteCategoryMutation.mutate(categoryToDelete.id, {
      onSuccess: () => {
        modals.delete.closeModal();
        setCategoryToDelete(null);
      },
    });
  };

  return (
    <TabLayout>
      <TabHeader
        title="Training Categories"
        icon={FolderOpen}
        description="Configure and manage training categories to organize your training programs"
        actions={
          canCreateTrainingCategories() && (
            <Button onClick={handleCreate}>
              <Plus />
              Add Category
            </Button>
          )
        }
      />

      <TabContent>
        <TrainingCategoriesExplanation />

        <TabCard className="border-0 shadow-none p-0 sm:p-0">
          <TrainingCategoriesTable
            categories={categories}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabCard>
      </TabContent>

      {/* Dialogs */}
      <TrainingCategoryFormDialog
        open={modals.category.isOpen}
        onOpenChange={modals.category.closeModal}
        category={selectedCategory}
        onSuccess={handleCategorySaved}
      />

      <Dialog
        open={modals.delete.isOpen}
        onOpenChange={modals.delete.closeModal}
      >
        <DialogContent className="w-[95vw] max-w-[400px]">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-lg sm:text-xl flex gap-1">
              Delete Training Category
            </DialogTitle>
            <DialogDescription className="text-sm">
              Are you sure you want to delete <b>{categoryToDelete?.name}</b>?
              This action cannot be undone and may affect existing training
              metrics and records.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={modals.delete.closeModal}
              disabled={deleteCategoryMutation.isLoading}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleCategoryDeleted}
              disabled={deleteCategoryMutation.isLoading}
              className="w-full sm:w-auto"
            >
              {deleteCategoryMutation.isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TabLayout>
  );
};
