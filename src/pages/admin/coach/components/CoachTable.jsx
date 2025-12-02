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
  onReactivate,
}) => {
  const columns = getCoachTableColumns({
    onEdit: onUpdate,
    onDelete,
    onReactivate,
  });

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={coaches || []}
        loading={isLoading}
        className="text-xs sm:text-sm"
        showPagination={false} // Disable built-in pagination
        pageSize={pageSize} // Still pass pageSize for row rendering
      />

      <div className="px-6">
        <TablePagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          isLoading={isLoading}
          itemName="coaches"
        />
      </div>
    </div>
  );
};

export default CoachTable;
