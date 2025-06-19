import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import DataTable from "@/components/common/DataTable";
import TablePagination from "@/components/ui/table-pagination";
import { fetchAssignedMetricsDetail, fetchAssignedMetricsOverview } from "@/api/trainingsApi";
import {
  SessionCard,
  FilterControls,
  SummaryStats,
  EmptyState,
  getSessionTableColumns
} from "./assigned";
import { Badge } from "@/components/ui/badge";
import SessionCardSkeleton from "./assigned/SessionCardSkeleton";
import TableSkeleton from "./assigned/TableSkeleton";

const AssignedTraining = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [viewMode, setViewMode] = useState("cards"); // "table" or "cards"
  const [statusFilter, setStatusFilter] = useState("assigned"); // Set assigned as default
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [search, setSearch] = useState("");

  // Fetch assigned metrics using React Query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["assigned-metrics-detail", currentPage, pageSize, statusFilter, dateRange, search],
    queryFn: () => fetchAssignedMetricsDetail({
      page: currentPage,
      page_size: pageSize,
      status: statusFilter === "all" ? undefined : statusFilter,
      date_from: dateRange?.from ? dateRange.from.toISOString().split("T")[0] : undefined,
      date_to: dateRange?.to ? dateRange.to.toISOString().split("T")[0] : undefined,
      search: search || undefined,
    }),
    keepPreviousData: true,
  });

  // Fetch overall metrics overview (unfiltered summary for display)
  const { data: overviewData, isLoading: isOverviewLoading } = useQuery({
    queryKey: ["assigned-metrics-overview"],
    queryFn: fetchAssignedMetricsOverview,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes since overview changes less frequently
  });

  const sessions = data?.results || [];
  const totalSessions = data?.count || 0;
  
  // Transform sessions data and create a session-based view
  const sessionsWithMetrics = sessions.map(sessionData => ({
    // Session info
    session: {
      id: sessionData.session,
      title: sessionData.session_title,
      date: sessionData.session_date,
      start_time: sessionData.session_start_time,
      end_time: sessionData.session_end_time,
      location: sessionData.session_location,
      status: sessionData.session_status,
      description: sessionData.session_description,
    },    // Transform assigned metrics with their records
    metrics: sessionData.assigned_metrics?.map(assignedMetric => {
      // Find the corresponding metric record
      const metricRecord = sessionData.metric_records?.find(
        record => record.metric === assignedMetric.id
      );
      
      return {
        id: assignedMetric.id,
        metric_name: assignedMetric.name,
        metric_description: assignedMetric.description,
        metric_category: assignedMetric.category_name,
        metric_unit: {
          code: metricRecord?.metric_unit_code || assignedMetric.metric_unit_data?.code,
          name: metricRecord?.metric_unit_name || assignedMetric.metric_unit_data?.name,
        },
        is_lower_better: assignedMetric.is_lower_better,
        weight: assignedMetric.weight,
        // Status based on recording and session status
        status: metricRecord?.value !== null && metricRecord?.value !== undefined ? "completed" : 
               sessionData.session_status === "completed" ? "missed" :
               sessionData.session_status === "in_progress" ? "in_progress" : "assigned",
        is_recorded: metricRecord?.value !== null && metricRecord?.value !== undefined,
        recorded_value: metricRecord?.value,
        recorded_at: metricRecord?.recorded_at,
        recorded_by: metricRecord?.recorded_by,
        notes: metricRecord?.notes || "",
        // Improvement data from the new backend calculation
        improvement_from_last: metricRecord?.improvement_from_last,
        improvement_percentage: metricRecord?.improvement_percentage,
        // Include session info for individual metric cards
        session_title: sessionData.session_title,
        session_date: sessionData.session_date,
        session_start_time: sessionData.session_start_time,
        session_end_time: sessionData.session_end_time,
        session_location: sessionData.session_location,
        session_status: sessionData.session_status,
        attendance_status: sessionData.attendance_status,
      };
    }) || [],
    // Session metadata
    attendance_status: sessionData.attendance_status,
    completion_status: sessionData.metrics_completion_status,
    can_record_metrics: sessionData.can_record_metrics,
  }));
  // Flatten metrics for individual metric view (for categories extraction)
  const metrics = sessionsWithMetrics.flatMap(sessionGroup => sessionGroup.metrics);

  // Use the overall unfiltered summary for display, fall back to filtered summary
  const summary = overviewData || {
    total_metrics: 0,
    completed: 0,
    in_progress: 0,
    assigned: 0,
    missed: 0,
    completion_rate: 0
  };

  // Optionally show filtered summary info when filters are active
  const isFiltered = statusFilter !== "all";
  const filteredSummary = isFiltered ? data?.summary : null;

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

  // Handle loading and error states
  if (isError) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-lg text-red-500">Error loading assigned metrics: {error?.message}</div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Assigned Training Metrics</h2>
        <p className="text-muted-foreground">Track your assigned metrics across training sessions</p>
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
            <EmptyState statusFilter={statusFilter} />
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
