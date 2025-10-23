import { ChartBarStacked, Plus, FolderPlus, Settings } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router";
import { useStatCategories } from "@/hooks/useStats";
import { useModal } from "@/hooks/useModal";
import Modal from "@/components/common/Modal";
import SportCategoriesForm from "@/components/forms/SportCategoriesForm";
import SportCategoriesTable from "./SportCategoriesTable";

const SportCategoriesView = () => {
  const { sport } = useParams();
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  const { data: categories, isLoading } = useStatCategories({ sport: sport });
  const modal = useModal();

  const handleCreateCategory = () => {
    setSelectedCategory(null);
    modal.openModal();
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    modal.openModal();
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex lg:flex-row flex-col space-y-4 lg:space-y-0">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg border border-primary/30 transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <ChartBarStacked className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xl font-bold">Categories</span>

              <span className="text-muted-foreground line-clamp-1 text-sm">
                Manage stat categories for {sport || "this sport"}.
              </span>
            </div>
          </div>
        </div>
        <Button 
          onClick={handleCreateCategory}
          className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="h-4 w-4" />
          New Category
        </Button>
      </div>

      <SportCategoriesTable 
        categories={categories} 
        isLoading={isLoading}
        onEdit={handleEditCategory}
      />

      {/* Category Modal */}
      <Modal
        open={modal.isOpen}
        onOpenChange={modal.closeModal}
        title={selectedCategory ? "Edit Category" : "Create New Category"}
        description={selectedCategory 
          ? "Update the category details below" 
          : "Create a new stat category for organizing your statistics"
        }
        icon={selectedCategory ? Settings : FolderPlus}
        size="md"
      >
        <SportCategoriesForm 
          category={selectedCategory}
          onClose={modal.closeModal}
        />
      </Modal>
    </div>
  );
};

export default SportCategoriesView;
