import React from "react";
import DataTable from "@/components/common/DataTable";
import getCoachTableColumns from "@/components/table_columns/CoachTableColumns";
import { Card, CardContent } from "@/components/ui/card";
import TablePagination from "@/components/ui/table-pagination";

const CoachTable = ({ 
  coaches, 
  totalItems,
  totalPages,
  currentPage,
  pageSize,
  isLoading,
  onPageChange,
  onPageSizeChange,
  onUpdate, 
  onDelete,
  onReactivate 
}) => {
  const columns = getCoachTableColumns({ onEdit: onUpdate, onDelete, onReactivate });

  return (
    <div className="space-y-4">
      <Card className="border-2 border-primary/10 shadow-xl bg-gradient-to-br from-card/60 via-card/40 to-primary/5">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <DataTable
              columns={columns}
              data={coaches || []}
              loading={isLoading}
              className="text-xs sm:text-sm"
              showPagination={false} // Disable built-in pagination
              pageSize={pageSize} // Still pass pageSize for row rendering
            />
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalItems > 0 && (
        <TablePagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          isLoading={isLoading}
          itemName="coaches"
        />
      )}
    </div>
  );
};

export default CoachTable;
