import React, { useState } from "react";
import { useTrainingCategories } from "@/hooks/useTrainings";
import { Button } from "@/components/ui/button";
import { PlusCircle, Pencil, Trash2, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import TrainingCategoryFormDialog from "@/components/modals/trainings/TrainingCategoryFormDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteTrainingCategory } from "@/hooks/useTrainings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TrainingMetricsPage from "./TrainingMetricsPage";
import TrainingSessionsPage from "./TrainingSessionsPage";

const TrainingCategoriesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const { categories, isLoading, error } = useTrainingCategories();
  const { deleteCategory, isLoading: isDeleting } = useDeleteTrainingCategory();

  const handleOpenModal = (category = null) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
  };

  const handleConfirmDelete = () => {
    if (!categoryToDelete) return;

    deleteCategory(categoryToDelete.slug, {
      onSuccess: () => {
        toast({
          title: "Category Deleted",
          description: `${categoryToDelete.name} has been removed.`,
        });
        setCategoryToDelete(null);
      },
      onError: (error) => {
        toast({
          title: "Delete Failed",
          description: `Failed to delete ${categoryToDelete.name}: ${error.message}`,
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="container mx-auto py-6">
      <h1>Training Categories</h1>
      <p className="text-muted-foreground">
        Manage your training categories, metrics, and sessions.
      </p>

      <Tabs defaultValue="categories" className="w-full mt-6">
        <TabsList className="mb-4">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Training Categories</h2>
            <Button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-1"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Add Category</span>
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 p-12">
              Error loading categories: {error.message}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (                <Card key={category.id} className="overflow-hidden">
                  <div
                    className="h-2"
                    style={{ backgroundColor: "#007bff" }}
                  />
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {category.name}
                    </CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">                      <Badge
                        variant="outline"
                        style={{
                          borderColor: "#007bff",
                          color: "#007bff",
                        }}
                      >
                        {category.metrics?.length || 0} Metrics
                      </Badge>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          onClick={() => handleOpenModal(category)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="h-8 w-8 p-0"
                          onClick={() => handleDeleteClick(category)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {categories.length === 0 && (
                <div className="col-span-full text-center py-12 bg-muted/50 rounded-lg">
                  <p className="text-muted-foreground">
                    No training categories found. Create your first category!
                  </p>
                </div>
              )}
            </div>
          )}          <TrainingCategoryFormDialog
            open={isModalOpen}
            onOpenChange={handleCloseModal}
            category={selectedCategory}
          />

          <AlertDialog
            open={!!categoryToDelete}
            onOpenChange={() => setCategoryToDelete(null)}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Delete {categoryToDelete?.name}?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the training category and all
                  associated metrics. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleConfirmDelete}
                  className="bg-destructive hover:bg-destructive/90"
                  disabled={isDeleting}
                >
                  {isDeleting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </TabsContent>

        <TabsContent value="metrics">
          <TrainingMetricsPage />
        </TabsContent>

        <TabsContent value="sessions">
          <TrainingSessionsPage />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrainingCategoriesPage;
