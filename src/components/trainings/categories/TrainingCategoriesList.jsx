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
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Training Categories</h2>
        <Button onClick={openCreateDialog}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            onEdit={openEditDialog}
          />
        ))}
      </div>

      <TrainingCategoryFormDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        category={editCategory}
      />
    </div>
  );
};

export default TrainingCategoriesList;
