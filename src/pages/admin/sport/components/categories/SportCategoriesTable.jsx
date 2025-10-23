import React, { useState } from "react";
import DataTable from "@/components/common/DataTable";
import { ChartBarStacked, Plus, Edit, Trash2, Settings, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/useModal";
import { useDeleteCategory } from "@/hooks/useStats";
import Modal from "@/components/common/Modal";
import DeleteModal from "@/components/common/DeleteModal";
import SportCategoriesForm from "@/components/forms/SportCategoriesForm";

const SportCategoriesTable = ({ categories, isLoading, onEdit: onEditFromParent }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  const editModal = useModal();
  const deleteModal = useModal();
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory();

  const handleEdit = (category) => {
    setSelectedCategory(category);
    editModal.openModal();
  };

  const handleDelete = (category) => {
    setSelectedCategory(category);
    deleteModal.openModal();
  };

  const handleCreateNew = () => {
    setSelectedCategory(null);
    editModal.openModal();
  };

  const confirmDelete = () => {
    if (selectedCategory) {
      deleteCategory(selectedCategory.id, {
        onSuccess: () => {
          deleteModal.closeModal();
          setSelectedCategory(null);
        }
      });
    }
  };

  const CategoryActions = ({ category }) => (
    <div className="flex items-center justify-end space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleEdit(category)}
        className="h-8 px-3"
      >
        <Edit className="h-3 w-3 mr-1" />
        Edit
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => handleDelete(category)}
        className="h-8 px-3"
      >
        <Trash2 className="h-3 w-3 mr-1" />
        Delete
      </Button>
    </div>
  );

  const columns = [
    {
      accessorKey: "name",
      header: "Category Name",
      cell: ({ getValue }) => <div className="font-medium">{getValue()}</div>,
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ getValue }) => (
        <div className="text-muted-foreground">{getValue() || "No description"}</div>
      ),
    },
    {
      accessorKey: "stats_count",
      header: "Stat Count",
      cell: ({ getValue }) => <div className="">{getValue() ?? 0}</div>,
    },
    {
      id: "actions",
      cell: ({ row }) => <CategoryActions category={row.original} />,
    },
  ];

  return (
    <div className="border rounded-md overflow-hidden shadow-sm">
      <DataTable
        columns={columns}
        data={categories || []}
        loading={isLoading}
        className="text-sm"
        pagination={false}
        unlimited={true}
        emptyMessage={
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <ChartBarStacked className="h-8 w-8 text-muted-foreground mb-2" />
            <h3 className="text-lg font-medium mb-1">No categories found</h3>
            {/* <p className="text-sm text-muted-foreground mb-4">
              {filter?.search
                ? "Try adjusting your search to find categories"
                : "Create your first category to define player roles"}
            </p> */}
            <Button size="sm" className="bg-primary" onClick={handleCreateNew}>
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              New Category
            </Button>
          </div>
        }
      />

      {/* Edit Category Modal */}
      <Modal
        open={editModal.isOpen}
        onOpenChange={editModal.closeModal}
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
          onClose={editModal.closeModal}
        />
      </Modal>

      {/* Delete Category Modal */}
      <DeleteModal
        open={deleteModal.isOpen}
        onOpenChange={deleteModal.closeModal}
        onConfirm={confirmDelete}
        itemName={selectedCategory?.name}
        itemType="category"
        isLoading={isDeleting}
        title="Delete Category"
        description={`Are you sure you want to delete "${selectedCategory?.name}"? ${
          selectedCategory?.stats_count > 0 
            ? `This category is currently used by ${selectedCategory.stats_count} stat${selectedCategory.stats_count !== 1 ? 's' : ''}.`
            : 'This action cannot be undone.'
        }`}
      >
        {selectedCategory?.stats_count > 0 && (
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="p-1 bg-amber-100 dark:bg-amber-900/50 rounded-full">
                <ChartBarStacked className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                  Warning: Category in use
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                  Deleting this category will remove it from {selectedCategory.stats_count} stat{selectedCategory.stats_count !== 1 ? 's' : ''}. 
                  Those stats will become uncategorized.
                </p>
              </div>
            </div>
          </div>
        )}
      </DeleteModal>
    </div>
  );
};

export default SportCategoriesTable;
