import React, { useState, useEffect } from "react";
import DataTable from "@/components/common/DataTable";
import TablePagination from "@/components/ui/table-pagination";
import {
  useAssignedMetricsDetail,
  useAssignedMetricsOverview,
} from "@/hooks/useTrainings";
import { transformSessionsData } from "./utils/sessionDataTransform";
import {
  SessionCard,
  FilterControls,
  SummaryStats,
  EmptyState,
  getSessionTableColumns,
} from "./assigned";
import { Badge } from "@/components/ui/badge";
import SessionCardSkeleton from "./assigned/SessionCardSkeleton";
import TableSkeleton from "./assigned/TableSkeleton";
import ContentEmpty from "@/components/common/ContentEmpty";
import { Dumbbell } from "lucide-react";

const AssignedTraining = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [viewMode, setViewMode] = useState("cards"); // "table" or "cards"
  const [statusFilter, setStatusFilter] = useState("assigned"); // Set assigned as default
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [search, setSearch] = useState("");
  // Fetch assigned metrics using the reusable hook
  const { data, isLoading } = useAssignedMetricsDetail({
    page: currentPage,
    page_size: pageSize,
    status: statusFilter === "all" ? undefined : statusFilter,
    date_from: dateRange?.from
      ? dateRange.from.toISOString().split("T")[0]
      : undefined,
    date_to: dateRange?.to
      ? dateRange.to.toISOString().split("T")[0]
      : undefined,
    search: search || undefined,
  });

  // Fetch overall metrics overview using the reusable hook
  const { data: overviewData, isLoading: isOverviewLoading } =
    useAssignedMetricsOverview();
  const sessions = data?.results || [];
  const totalSessions = data?.count || 0;

  // Transform sessions data using the utility function
  const sessionsWithMetrics = transformSessionsData(sessions);

  // Use the overall unfiltered summary for display, fall back to filtered summary
  const summary = overviewData || {
    total_metrics: 0,
    completed: 0,
    in_progress: 0,
    assigned: 0,
    missed: 0,
    completion_rate: 0,
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Assigned Training Metrics
        </h2>
        <p className="text-muted-foreground">
          Track your assigned metrics across training sessions
        </p>
      </div>

      {/* Summary Stats */}
      <SummaryStats summary={summary} />

      {/* Filters and Controls */}
      <FilterControls
        statusFilter={statusFilter}
        viewMode={viewMode}
        onStatusFilterChange={handleStatusFilter}
        onViewModeChange={setViewMode}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        search={search}
        onSearchChange={setSearch}
      />

      {/* Content */}
      {viewMode === "table" ? (
        <div className="space-y-4">
          <div className="overflow-x-auto">
            {isLoading ? (
              <TableSkeleton rows={pageSize} columns={6} />
            ) : (
              <DataTable
                columns={getSessionTableColumns()}
                data={sessionsWithMetrics}
                loading={isLoading}
                className="text-xs sm:text-sm"
                showPagination={false}
                pageSize={pageSize}
              />
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {isLoading ? (
            <div className="columns-1 xl:columns-2 gap-6">
              {[...Array(pageSize)].map((_, i) => (
                <div key={i} className="mb-6 break-inside-avoid">
                  <SessionCardSkeleton />
                </div>
              ))}
            </div>
          ) : sessionsWithMetrics.length === 0 ? (
            <ContentEmpty
              title="No Trainings Found"
              icon={Dumbbell}
              description="You have no assigned training metrics at the moment."
            />
          ) : (
            <div className="columns-1 xl:columns-2 gap-6">
              {sessionsWithMetrics.map((sessionGroup, index) => (
                <div
                  key={`session-${sessionGroup.session.id}`}
                  className="animate-in fade-in-50 duration-500 mb-6 break-inside-avoid"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <SessionCard sessionGroup={sessionGroup} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalSessions > 0 && (
        <div className="border-t pt-4">
          <TablePagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={totalSessions}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            isLoading={isLoading}
            itemName="sessions"
            pageSizeOptions={[12, 24, 36, 48]}
          />
        </div>
      )}
    </div>
  );
};

export default AssignedTraining;
