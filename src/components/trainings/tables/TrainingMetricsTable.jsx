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
import {
  Edit,
  Trash,
  Shield,
  User,
  Target,
  TrendingDown,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import { useRolePermissions } from "../../../hooks/useRolePermissions";
import { useReactivateTrainingMetric } from "../../../hooks/useTrainings";

/**
 * Table component for displaying training metrics with role-based permissions
 * Responsive design with mobile-optimized layout
 */
export const TrainingMetricsTable = ({
  metrics,
  isLoading,
  onEdit,
  onDelete,
}) => {
  const { canModifyTrainingMetric, getTrainingMetricTooltip, isAdmin, user } =
    useRolePermissions();
  const reactivateMutation = useReactivateTrainingMetric();

  const handleReactivate = (metric) => {
    reactivateMutation.mutate(metric.id);
  };

  const canSeeInactive = (metric) => {
    if (!metric.is_active) {
      // Admin sees all inactive
      if (isAdmin()) return true;
      // Creator sees their own inactive
      if (metric.created_by === user?.id) return true;
      return false;
    }
    return true;
  };

  // Filter metrics based on role permissions
  const visibleMetrics = metrics?.filter(canSeeInactive) || [];

  if (isLoading) {
    return (
      <div className="space-y-3">
        {/* Desktop skeleton */}
        <div className="hidden sm:block">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>

        {/* Mobile skeleton */}
        <div className="sm:hidden space-y-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="border-2 border-primary/20 rounded-lg px-4 py-3"
            >
              <div className="flex items-center justify-between mb-2">
                <Skeleton className="h-4 w-32" />
                <div className="flex gap-1">
                  <Skeleton className="h-6 w-6 rounded" />
                  <Skeleton className="h-6 w-6 rounded" />
                </div>
              </div>
              <Skeleton className="h-3 w-full mb-1" />
              <Skeleton className="h-3 w-2/3 mb-3" />
              <div className="grid grid-cols-2 gap-2 mb-3">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-16" />
              </div>
              <div className="border-t border-border/50 pt-2">
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto hidden sm:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[120px]">Name</TableHead>
              <TableHead className="min-w-[100px]">Category</TableHead>
              <TableHead className="min-w-[80px]">Unit</TableHead>
              <TableHead className="min-w-[80px]">Weight</TableHead>
              <TableHead className="min-w-[100px]">Direction</TableHead>
              <TableHead className="hidden sm:table-cell">Creator</TableHead>
              <TableHead className="hidden md:table-cell">
                Description
              </TableHead>
              <TableHead className="text-right min-w-[100px]">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleMetrics.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <div className="flex flex-col items-center gap-2">
                    <Target className="h-8 w-8 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      No training metrics found
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Create your first metric to start tracking performance
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              visibleMetrics.map((metric) => {
                const canModify = canModifyTrainingMetric(metric);
                const tooltip = getTrainingMetricTooltip?.(metric);

                return (
                  <TableRow
                    key={metric.id}
                    className={`hover:bg-muted/50 ${
                      !metric.is_active ? "opacity-60" : ""
                    }`}
                  >
                    {/* Name */}
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <span
                          className={`truncate ${
                            !metric.is_active ? "line-through" : ""
                          }`}
                        >
                          {metric.name}
                        </span>
                        {!metric.is_active && (
                          <Badge variant="secondary" className="text-xs">
                            Inactive
                          </Badge>
                        )}
                      </div>
                    </TableCell>

                    {/* Category */}
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="text-xs border-primary/30 text-primary"
                      >
                        {metric.category_name || "No Category"}
                      </Badge>
                    </TableCell>

                    {/* Unit */}
                    <TableCell>
                      <Badge variant="outline">
                        {metric.metric_unit_data?.name ||
                          metric.metric_unit_data?.code ||
                          "N/A"}
                      </Badge>
                    </TableCell>

                    {/* Weight */}
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {metric.metric_unit_data?.normalization_weight
                          ? `× ${parseFloat(
                              metric.metric_unit_data.normalization_weight
                            ).toFixed(2)}`
                          : "1.00"}
                      </Badge>
                    </TableCell>

                    {/* Direction (Lower/Higher is better) */}
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {metric.is_lower_better ? (
                          <>
                            <TrendingDown className="h-3 w-3 text-secondary" />
                            <span className="text-xs text-secondary">
                              Lower Better
                            </span>
                          </>
                        ) : (
                          <>
                            <TrendingUp className="h-3 w-3 text-primary" />
                            <span className="text-xs text-primary">
                              Higher Better
                            </span>
                          </>
                        )}
                      </div>
                    </TableCell>

                    {/* Creator */}
                    <TableCell className="hidden sm:table-cell">
                      {metric.created_by ? (
                        <div className="flex items-center gap-1">
                          {metric.is_default ? (
                            <Badge
                              variant="outline"
                              className="bg-secondary/50 border-secondary text-secondary-foreground"
                            >
                              <Shield className="h-3 w-3 text-secondary-foreground" />
                              System
                            </Badge>
                          ) : (
                            <Badge variant="outline">
                              <User className="h-3 w-3" />
                              {metric.created_by_name}
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          <Shield /> Admin
                        </Badge>
                      )}
                    </TableCell>

                    {/* Description */}
                    <TableCell className="hidden md:table-cell max-w-[200px]">
                      <p className="text-xs text-muted-foreground truncate">
                        {metric.description || "No description"}
                      </p>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {!metric.is_active ? (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleReactivate(metric)}
                            disabled={reactivateMutation.isPending}
                            title="Reactivate this metric"
                          >
                            <RefreshCw />
                          </Button>
                        ) : (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onEdit(metric)}
                              disabled={!canModify}
                              title={tooltip}
                            >
                              <Edit />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onDelete(metric)}
                              disabled={!canModify}
                              title={tooltip}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile-friendly view for small screens */}
      <div className="sm:hidden space-y-3">
        {visibleMetrics.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <Target className="mx-auto h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium mb-2">No metrics found</h3>
            <p className="text-muted-foreground mb-4">
              No training metrics have been created yet. Add your first metric
              to get started.
            </p>
          </div>
        ) : (
          visibleMetrics.map((metric) => {
            const canModify = canModifyTrainingMetric(metric);

            return (
              <div
                key={metric.id}
                className={`border-2 border-primary/20 rounded-lg px-4 py-3 space-y-3 bg-card ${
                  !metric.is_active ? "opacity-60" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3
                        className={`font-medium truncate ${
                          !metric.is_active ? "line-through" : ""
                        }`}
                      >
                        {metric.name}
                      </h3>
                      {!metric.is_active && (
                        <Badge
                          variant="secondary"
                          className="text-xs px-1.5 py-0.5 h-5"
                        >
                          Inactive
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-3">
                      {metric.description || "No description"}
                    </p>
                  </div>
                </div>

                {/* Metric details in a compact grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">Category:</span>
                    <Badge
                      variant="outline"
                      className="text-xs border-primary/30 text-primary"
                    >
                      {metric.category_name || "N/A"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">Unit:</span>
                    <Badge variant="outline" className="text-xs">
                      {metric.metric_unit_data?.code || "N/A"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">Weight:</span>
                    <Badge variant="outline" className="text-xs">
                      {metric.metric_unit_data?.normalization_weight
                        ? `× ${parseFloat(
                            metric.metric_unit_data.normalization_weight
                          ).toFixed(1)}`
                        : "1.0"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">Direction:</span>
                    {metric.is_lower_better ? (
                      <div className="flex items-center gap-1">
                        <TrendingDown className="h-3 w-3 text-secondary" />
                        <span className="text-xs text-secondary">Lower</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-primary" />
                        <span className="text-xs text-primary">Higher</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-1">
                    {metric.is_default ? (
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
                        {metric.created_by_name || "User"}
                      </Badge>
                    )}
                  </div>

                  <div>
                    {!metric.is_active ? (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleReactivate(metric)}
                        disabled={reactivateMutation.isPending}
                        title="Reactivate this metric"
                      >
                        <RefreshCw />
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(metric)}
                          disabled={!canModify}
                          title={getTrainingMetricTooltip?.(metric, "edit")}
                        >
                          <Edit />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(metric)}
                          disabled={!canModify}
                          title={getTrainingMetricTooltip?.(metric, "delete")}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
