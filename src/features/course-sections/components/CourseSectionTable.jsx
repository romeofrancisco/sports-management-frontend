import React, { useState } from "react";
import DataTable from "@/components/common/DataTable";
import { useAcademicInfo } from "@/hooks/useAcademicInfo";
import { Button } from "@/components/ui/button";
import TablePagination from "@/components/ui/table-pagination";

const CourseSectionTable = ({ filter, onUpdate, onDelete }) => {
  // Build query params from filter
  const queryParams = React.useMemo(() => {
    const params = {};
    if (filter?.year_level) params.year_level = filter.year_level;
    if (filter?.course) params.course = filter.course;
    if (filter?.section) params.section = filter.section;
    // Include search string if present
    if (filter?.search) params.search = filter.search;
    if (filter?.exclude) params.exclude = filter.exclude;
    return params;
  }, [filter]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Include pagination in query params for the API
  const pagedQueryParams = React.useMemo(() => ({
    ...queryParams,
    page: currentPage,
    page_size: pageSize,
  }), [queryParams, currentPage, pageSize]);

  // Reset to first page when filters change (so searches start at page 1)
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filter?.search, filter?.year_level, filter?.course, filter?.section, filter?.exclude]);

  // Fetch paginated academic info with player counts
  const { data, isLoading } = useAcademicInfo(pagedQueryParams);

  // Determine which columns to show based on exclude parameter
  const columns = React.useMemo(() => {
    const baseColumns = [];

    // Always show year_level
    baseColumns.push({ accessorKey: "year_level", header: "Year Level" });

    // Show course unless excluded
    if (filter?.exclude !== "course") {
      baseColumns.push({ accessorKey: "course", header: "Course" });
    }

    // Show section unless course or section is excluded
    if (filter?.exclude !== "course" && filter?.exclude !== "section") {
      baseColumns.push({
        accessorKey: "section",
        header: "Section",
        cell: ({ getValue }) => {
          const value = getValue();
          return <span>{value === "" || value == null ? "--" : value}</span>;
        },
      });
    }

    // Always show player count
    baseColumns.push({ accessorKey: "player_count", header: "Player Count" });

    // Actions column
    baseColumns.push({
      accessorKey: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onUpdate(row.original)}
          >
            Update
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(row.original)}
          >
            Delete
          </Button>
        </div>
      ),
      size: 50,
    });

    return baseColumns;
  }, [filter?.exclude, onUpdate, onDelete]);
  // Extract results and total from paginated response
  const results = data?.results || [];
  const total = data?.count || 0;

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  return (
    <>
      <DataTable data={results} columns={columns} loading={isLoading} showPagination={false} pageSize={pageSize} />
      {total > 0 && (
        <div className="pt-4">
          <TablePagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={total}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            isLoading={isLoading}
            itemName="course sections"
            pageSizeOptions={[10, 25, 50]}
          />
        </div>
      )}
    </>
  );
};

export default CourseSectionTable;
