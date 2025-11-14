import React, { useState, useEffect } from "react";
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
  unlimited = false, // New prop to show all rows without pagination
}) => {
  const [sorting, setSorting] = useState([]);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  
  // Calculate the effective page size - if unlimited, use the total data length
  const effectivePageSize = unlimited ? data?.length || 100 : pageSize;

  // Track window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Process columns based on screen size
  const responsiveColumns = React.useMemo(() => {
    return columns.map(column => {
      // Define responsive behavior for each column
      let visibility = true;
      let width = column.size;
      
      // Optional: Hide certain columns on smaller screens based on priority
      if (column.meta?.priority === 'low' && windowWidth < 640) {
        visibility = false;
      } else if (column.meta?.priority === 'medium' && windowWidth < 480) {
        visibility = false;
      }
      
      // Apply responsive width logic - with smaller sizes for all screens
      if (windowWidth < 640) {
        // For small screens - ultra compact
        width = column.meta?.mobileSize || column.size || 50;
      } else if (windowWidth < 1024) {
        // For medium screens - very compact
        width = column.meta?.tabletSize || column.size || 60;
      } else {
        // For large screens - compact
        width = column.size || 80;
      }
      
      return {
        ...column,
        size: width,
        show: visibility
      };
    }).filter(col => col.show !== false);
  }, [columns, windowWidth]);

  const table = useReactTable({
    data: data || [],
    columns: responsiveColumns,
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
  });

  // Create custom styles for the first column that will be consistent
  const getFirstColumnStyle = (isHeader = false) => {
    return {
      position: 'sticky',
      left: 0,
      zIndex: isHeader ? 40 : 20,
      width: windowWidth < 640 ? 'auto' : undefined,
    };
  };

  // Hide pagination controls if unlimited mode is enabled
  const showPaginationControls = showPagination && !unlimited;

  return (
    <div>
      {loading ? (
        <TableContentLoading 
          rowCount={pageSize > 5 ? 5 : pageSize} 
          columnCount={responsiveColumns.length} 
        />
      ) : (
        <div className="border-y relative">
          <div className="overflow-x-auto">
            <Table className={`${className} text-xs md:text-sm relative`}>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="border-b">
                    {headerGroup.headers.map((header, index) => {
                      const isFirstColumn = index === 0 && headerGroup.depth === table.getHeaderGroups().length - 1;
                      return (
                        <TableHead
                          key={header.id}
                          colSpan={header.colSpan}
                          style={{
                            ...(isFirstColumn ? getFirstColumnStyle(true) : {}),
                            width: header.column.columnDef.size,
                            minWidth: header.column.columnDef.minWidth || (windowWidth < 640 ? 40 : 60),
                          }}
                          className={`border-r border-border ${isFirstColumn ? 'first-col w-0 sm:w-auto' : ''} whitespace-nowrap py-3 bg-muted px-3`}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row, rowIndex) => {
                    return (
                      <TableRow 
                        key={row.id}
                        className="border-b"
                      >
                        {row.getVisibleCells().map((cell, cellIndex) => {
                          const isFirstColumn = cellIndex === 0;
                          return (
                            <TableCell
                              key={cell.id}
                              style={{
                                ...(isFirstColumn ? getFirstColumnStyle() : {}),
                                width: cell.column.columnDef.size,
                                minWidth: cell.column.columnDef.minWidth || (windowWidth < 640 ? 40 : 60),
                              }}
                              className={`border-r border-border relative ${isFirstColumn ? "first-col bg-background" : "bg-background"} ${cell.column.columnDef.meta?.className || ""} truncate p-3`}
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
                      colSpan={responsiveColumns.length}
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
