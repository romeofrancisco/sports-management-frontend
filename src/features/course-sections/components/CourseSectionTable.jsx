import React from "react";
import DataTable from "@/components/common/DataTable";
import { useAcademicInfo } from "@/hooks/useAcademicInfo";
import { Button } from "@/components/ui/button";

const CourseSectionTable = ({ filter }) => {
  // Build query params from filter
  const queryParams = React.useMemo(() => {
    const params = {};
    if (filter?.year_level) params.year_level = filter.year_level;
    if (filter?.course) params.course = filter.course;
    if (filter?.section) params.section = filter.section;
    if (filter?.exclude) params.exclude = filter.exclude;
    return params;
  }, [filter]);

  // Fetch paginated academic info with player counts
  const { data, isLoading } = useAcademicInfo(queryParams);

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
          return <span>{getValue() ?? "None"}</span>;
        },
      });
    }

    // Always show player count
    baseColumns.push({ accessorKey: "player_count", header: "Player Count" });

    // Actions column
    baseColumns.push({
      accessorKey: "actions",
      header: "",
      cell: () => (
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm">
            Update
          </Button>
          <Button variant="destructive" size="sm">
            Delete
          </Button>
        </div>
      ),
      size: 50,
    });

    return baseColumns;
  }, [filter?.exclude]);

  // Extract results from paginated response
  const results = data?.results || [];

  if (isLoading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return <DataTable data={results} columns={columns} />;
};

export default CourseSectionTable;
