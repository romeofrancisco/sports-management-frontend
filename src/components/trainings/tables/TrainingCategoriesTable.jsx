import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Button } from "../../ui/button";
import { Skeleton } from "../../ui/skeleton";
import { Badge } from "../../ui/badge";
import { Edit, Trash, Shield, User, RefreshCw } from "lucide-react";
import { useRolePermissions } from "../../../hooks/useRolePermissions";
import { useReactivateTrainingCategory } from "../../../hooks/useTrainings";

/**
 * Table component for displaying training categories with role-based permissions
 * Responsive design with mobile-optimized layout
 */
export const TrainingCategoriesTable = ({
  categories,
  isLoading,
  onEdit,
  onDelete,
}) => {
  const {
    canModifyTrainingCategory,
    getTrainingCategoryTooltip,
    isAdmin,
    user,
  } = useRolePermissions();
  const reactivateMutation = useReactivateTrainingCategory();

  const handleReactivate = (category) => {
    reactivateMutation.mutate(category.id);
  };

  const canSeeInactive = (category) => {
    if (!category.is_active) {
      // Admin sees all inactive
      if (isAdmin()) return true;
      // Creator sees their own inactive
      if (category.created_by === user?.id) return true;
      return false;
    }
    return true;
  };

  // Filter categories based on role permissions
  const visibleCategories = categories?.filter(canSeeInactive) || [];

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-4">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[300px]" />
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-8 w-[80px]" />
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (!visibleCategories || visibleCategories.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground mb-4">
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
        <h3 className="text-lg font-medium mb-2">No categories found</h3>
        <p className="text-muted-foreground mb-4">
          No training categories have been created yet. Add your first category
          to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table */}
      <div className="hidden sm:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-center">Creator</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleCategories.map((category) => {
              const canModify = canModifyTrainingCategory(category);

              return (
                <TableRow
                  key={category.id}
                  className={!category.is_active ? "opacity-60" : ""}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <span
                        className={!category.is_active ? "line-through" : ""}
                      >
                        {category.name}
                      </span>
                      {!category.is_active && (
                        <Badge variant="secondary" className="text-xs">
                          Inactive
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[900px] truncate text-muted-foreground">
                      {category.description || "No description"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {category.is_default ? (
                        <Badge
                          variant="outline"
                          className="bg-secondary/50 border-secondary text-secondary-foreground"
                        >
                          <Shield />
                          Admin
                        </Badge>
                      ) : (
                        <Badge variant="outline">
                          <User />
                          {category.created_by_name || "User"}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {!category.is_active ? (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleReactivate(category)}
                          disabled={reactivateMutation.isPending}
                          title="Reactivate this category"
                        >
                          <RefreshCw />
                        </Button>
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(category)}
                            disabled={!canModify}
                            title={getTrainingCategoryTooltip(category, "edit")}
                          >
                            <Edit />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDelete(category)}
                            disabled={!canModify}
                            title={getTrainingCategoryTooltip(
                              category,
                              "delete"
                            )}
                          >
                            <Trash />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card Layout */}
      <div className="sm:hidden space-y-3">
        {visibleCategories.map((category) => {
          const canModify = canModifyTrainingCategory(category);

          return (
            <div
              key={category.id}
              className={`border-2 border-primary/20 rounded-lg px-4 py-3 space-y-3 bg-card ${
                !category.is_active ? "opacity-60" : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3
                      className={`font-medium truncate ${
                        !category.is_active ? "line-through" : ""
                      }`}
                    >
                      {category.name}
                    </h3>
                    {!category.is_active && (
                      <Badge
                        variant="secondary"
                        className="text-xs px-1.5 py-0.5 h-5"
                      >
                        Inactive
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-3">
                    {category.description || "No description"}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-1">
                  {category.is_default ? (
                    <Badge
                      variant="outline"
                      className="bg-secondary/50 border-secondary text-secondary-foreground"
                    >
                      <Shield />
                      Admin
                    </Badge>
                  ) : (
                    <Badge variant="outline">
                      <User />
                      {category.created_by_name || "User"}
                    </Badge>
                  )}
                </div>

                <div>
                  {!category.is_active ? (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleReactivate(category)}
                      disabled={reactivateMutation.isPending}
                      title="Reactivate this category"
                    >
                      <RefreshCw />
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(category)}
                        disabled={!canModify}
                        title={getTrainingCategoryTooltip(category, "edit")}
                      >
                        <Edit />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(category)}
                        disabled={!canModify}
                        title={getTrainingCategoryTooltip(category, "delete")}
                      >
                        <Trash />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
