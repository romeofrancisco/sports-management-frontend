import React, { useState } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTrainingCategories } from "@/hooks/useTrainings";
import CategoryCard from "./CategoryCard";
import TrainingCategoryFormDialog from "@/components/modals/trainings/TrainingCategoryFormDialog";

/**
 * Component for displaying and managing training categories
 */
const TrainingCategoriesList = () => {
  const { data: categories, isLoading, isError } = useTrainingCategories();
  const [openDialog, setOpenDialog] = useState(false);
  const [editCategory, setEditCategory] = useState(null);

  if (isLoading)
    return <div className="flex justify-center p-4">Loading categories...</div>;
  if (isError)
    return <div className="text-red-500 p-4">Error loading categories</div>;

  const openCreateDialog = () => {
    setEditCategory(null);
    setOpenDialog(true);
  };

  const openEditDialog = (category) => {
    setEditCategory(category);
    setOpenDialog(true);
  };  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header Section - Mobile Responsive */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">Training Categories</h2>
          <p className="text-sm text-muted-foreground">
            Manage and organize training categories
          </p>
        </div>
        <Button onClick={openCreateDialog} className="w-full sm:w-auto">
          <PlusIcon className="mr-2 h-4 w-4" />
          <span className="sm:inline">Add Category</span>
        </Button>
      </div>

      {/* Categories Grid - Enhanced Mobile Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            onEdit={openEditDialog}
          />
        ))}
      </div>

      {/* Empty State */}
      {categories.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No categories yet
          </h3>
          <p className="text-gray-500 mb-4">
            Get started by creating your first training category.
          </p>          <Button onClick={openCreateDialog}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Create Category
          </Button>
        </div>
      )}

      <TrainingCategoryFormDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        category={editCategory}
      />
    </div>
  );
};

export default TrainingCategoriesList;
