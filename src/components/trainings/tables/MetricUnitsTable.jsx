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
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-x-auto">        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[80px]">Code</TableHead>
              <TableHead className="min-w-[120px]">Name</TableHead>
              <TableHead className="min-w-[60px]">Type</TableHead>
              <TableHead className="min-w-[80px]">Weight</TableHead>
              <TableHead className="hidden sm:table-cell">Creator</TableHead>
              <TableHead className="hidden sm:table-cell">Description</TableHead>
              <TableHead className="text-right min-w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {units.length > 0 ? (
              units.map((unit) => (
                <TableRow key={unit.id}>
                  <TableCell className="font-medium text-sm">{unit.code}</TableCell>
                  <TableCell className="text-sm">{unit.name}</TableCell>
                  <TableCell className="text-sm">
                    {unit.is_default ? (
                      <Badge variant="secondary" className="text-xs flex items-center gap-1 w-fit">
                        <Shield className="h-3 w-3" />
                        System
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        Custom
                      </Badge>
                    )}
                  </TableCell>                  <TableCell className="text-sm">
                    ×{(parseFloat(unit.normalization_weight) || 1.0).toFixed(2)}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm">
                    <div className="flex items-center gap-1">
                      {unit.is_default ? (
                        <Badge variant="secondary" className="text-xs flex items-center gap-1">
                          <Shield className="h-3 w-3" />
                          System
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {unit.created_by_name || "Unknown"}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm max-w-xs truncate">
                    {unit.description || "-"}
                  </TableCell>                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">                      <Button 
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
              ))            ) : (
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
    </div>  );
};
