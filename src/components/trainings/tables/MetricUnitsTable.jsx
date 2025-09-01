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
import { Edit, Trash, Shield, User } from "lucide-react";
import { useRolePermissions } from "../../../hooks/useRolePermissions";

/**
 * Table component for displaying metric units with role-based permissions
 * Responsive design with mobile-optimized layout
 */
export const MetricUnitsTable = ({ units, isLoading, onEdit, onDelete }) => {
  const { canModifyMetricUnit, getMetricUnitTooltip } = useRolePermissions();
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
            <div key={i} className="border-2 border-primary/20 rounded-lg px-4 py-3">
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
    <div className="space-y-4">
      {/* Desktop Table */}
      <div className="hidden sm:block">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[80px]">Code</TableHead>
                <TableHead className="min-w-[120px]">Name</TableHead>
                <TableHead className="min-w-[80px]">Weight</TableHead>
                <TableHead className="hidden sm:table-cell">Creator</TableHead>
                <TableHead className="hidden sm:table-cell">
                  Description
                </TableHead>
                <TableHead className="text-right min-w-[100px]">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {units.length > 0 ? (
                units.map((unit) => (
                  <TableRow key={unit.id}>
                    <TableCell className="font-medium text-sm">
                      {unit.code}
                    </TableCell>
                    <TableCell className="text-sm">{unit.name}</TableCell>
                    <TableCell className="text-sm">
                      ×{(parseFloat(unit.normalization_weight) || 1.0).toFixed(2)}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm">
                      <div className="flex items-center gap-1">
                        {unit.is_default ? (
                          <Badge
                            variant="secondary"
                            className="text-xs flex items-center gap-1"
                          >
                            <Shield className="h-3 w-3" />
                            Admin
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-xs flex items-center gap-1"
                          >
                            <User className="h-3 w-3" />
                            {unit.created_by_name || "Unknown"}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm max-w-xs truncate">
                      {unit.description || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          onClick={() => onEdit(unit)}
                          disabled={!canModifyMetricUnit(unit)}
                          title={getMetricUnitTooltip(unit, "edit")}
                        >
                          <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="h-8 w-8 p-0"
                          onClick={() => onDelete(unit)}
                          disabled={!canModifyMetricUnit(unit)}
                          title={getMetricUnitTooltip(unit, "delete")}
                        >
                          <Trash className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="text-muted-foreground mb-3">
                        <svg
                          className="mx-auto h-10 w-10 sm:h-12 sm:w-12"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <p className="text-sm sm:text-base text-muted-foreground">
                        No metric units found.
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground/80 mt-1">
                        Click "Add Unit" to create your first unit.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Mobile Card Layout */}
      <div className="sm:hidden space-y-3">
        {units.length === 0 ? (
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
                  strokeWidth={1.5}
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">No units found</h3>
            <p className="text-muted-foreground mb-4">
              No metric units have been created yet. Add your first unit to get started.
            </p>
          </div>
        ) : (
          units.map((unit) => {
            const canModify = canModifyMetricUnit(unit);

            return (
              <div
                key={unit.id}
                className="border-2 border-primary/20 rounded-lg px-4 py-3 space-y-3 bg-card"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium truncate">{unit.name}</h3>
                      {unit.is_default && (
                        <Badge variant="secondary" className="text-xs px-1.5 py-0.5 h-5">
                          <Shield className="w-2.5 h-2.5" />
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-3">
                      {unit.description || "No description"}
                    </p>
                  </div>
                </div>

                {/* Unit details in a compact grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">Code:</span>
                    <Badge variant="outline" className="text-xs font-mono">
                      {unit.code}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">Weight:</span>
                    <Badge variant="outline" className="text-xs">
                      ×{(parseFloat(unit.normalization_weight) || 1.0).toFixed(2)}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-1">
                    {unit.is_default ? (
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
                        {unit.created_by_name || "User"}
                      </Badge>
                    )}
                  </div>

                  <div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(unit)}
                      disabled={!canModify}
                      title={getMetricUnitTooltip(unit, "edit")}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(unit)}
                      disabled={!canModify}
                      title={getMetricUnitTooltip(unit, "delete")}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
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
