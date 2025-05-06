import React, { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import TableContentLoading from "./TableContentLoading";

const DataTable = ({
  columns,
  data,
  showPagination = true,
  pageSize = 10,
  className = "",
  loading = false,
  alternateRowColors = false,
  unlimited = false, // New prop to show all rows without pagination
}) => {
  const [sorting, setSorting] = useState([]);

  // Calculate the effective page size - if unlimited, use the total data length
  const effectivePageSize = unlimited ? data?.length || 100 : pageSize;

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { 
      sorting,
      pagination: {
        pageIndex: 0,
        pageSize: effectivePageSize,
      },
    },
    // Don't set initialState since we want to control this directly through state
  });

  // Create custom styles for the first column that will be consistent
  const getFirstColumnStyle = (isHeader = false) => {
    return {
      position: 'sticky',
      left: 0,
      zIndex: isHeader ? 40 : 20,
    };
  };

  // Hide pagination controls if unlimited mode is enabled
  const showPaginationControls = showPagination && !unlimited;

  return (
    <div>
      {loading ? (
        <TableContentLoading 
          rowCount={pageSize > 5 ? 5 : pageSize} 
          columnCount={columns.length} 
        />
      ) : (
        <div className="rounded-md shadow border mt-2 relative">
          <div className="overflow-x-auto">
            <Table className={`${className} relative`}>
              <TableHeader>
                <TableRow className="border-b">
                  {table.getHeaderGroups()[0].headers.map((header, index) => (
                    <TableHead
                      key={header.id}
                      style={{
                        minWidth: header.column.columnDef.size,
                        maxWidth: header.column.columnDef.size,
                        ...(index === 0 ? getFirstColumnStyle(true) : {}),
                        backgroundColor: index === 0 ? 'var(--background)' : undefined
                      }}
                      className={`${index === 0 ? 'first-col' : ''}`}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row, rowIndex) => {
                    return (
                      <TableRow 
                        key={row.id}
                        className={`border-b ${alternateRowColors && rowIndex % 2 === 1 ? 'bg-muted/30' : ''}`}
                      >
                        {row.getVisibleCells().map((cell, cellIndex) => {
                          const isFirstColumn = cellIndex === 0;
                          
                          return (
                            <TableCell
                              key={cell.id}
                              style={{
                                minWidth: cell.column.columnDef.size,
                                maxWidth: cell.column.columnDef.size,
                                ...(isFirstColumn ? getFirstColumnStyle() : {}),
                              }}
                              className={isFirstColumn ? "first-col bg-background" : alternateRowColors && rowIndex % 2 === 1 ? "bg-muted/30" : "bg-background"}
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
      {showPaginationControls && !loading && (
        <div className="flex items-center justify-end space-x-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default DataTable;
