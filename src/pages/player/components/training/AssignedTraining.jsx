import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import DataTable from "@/components/common/DataTable";
import TablePagination from "@/components/ui/table-pagination";
import { fetchAssignedMetricsDetail } from "@/api/trainingsApi";
import {
  SessionCard,
  FilterControls,
  SummaryStats,
  EmptyState,
  getSessionTableColumns
} from "./assigned";

const AssignedTraining = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [viewMode, setViewMode] = useState("cards"); // "table" or "cards"
  const [statusFilter, setStatusFilter] = useState("assigned"); // Set assigned as default
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Fetch assigned metrics using React Query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["assigned-metrics-detail", currentPage, pageSize, statusFilter, categoryFilter],
    queryFn: () => fetchAssignedMetricsDetail({
      page: currentPage,
      page_size: pageSize,
      status: statusFilter === "all" ? undefined : statusFilter,
      category: categoryFilter === "all" ? undefined : categoryFilter,
    }),
    keepPreviousData: true,
  });  const sessions = data?.results || [];
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

  // Flatten metrics for individual metric view and summary calculation
  const metrics = sessionsWithMetrics.flatMap(sessionGroup => sessionGroup.metrics);  // Calculate summary from processed metrics
  const summary = {
    total_metrics: metrics.length,
    completed: metrics.filter(m => m.status === "completed").length,
    in_progress: metrics.filter(m => m.status === "in_progress").length,
    assigned: metrics.filter(m => m.status === "assigned").length,
    missed: metrics.filter(m => m.status === "missed").length,
    completion_rate: metrics.length > 0 ? Math.round((metrics.filter(m => m.status === "completed").length / metrics.length) * 100) : 0
  };

  // Get unique categories for filtering
  const categories = [...new Set(metrics.map(m => m.metric_category).filter(Boolean))];
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
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-lg">Loading assigned metrics...</div>
      </div>
    );
  }

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
        categoryFilter={categoryFilter}
        categories={categories}
        viewMode={viewMode}
        onStatusFilterChange={handleStatusFilter}
        onCategoryFilterChange={setCategoryFilter}
        onViewModeChange={setViewMode}
      />

      {/* Content */}
      {viewMode === "table" ? (
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <DataTable
              columns={getSessionTableColumns()}
              data={sessionsWithMetrics}
              loading={isLoading}
              className="text-xs sm:text-sm"
              showPagination={false}
              pageSize={pageSize}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {sessionsWithMetrics.length === 0 && !isLoading ? (
            <EmptyState statusFilter={statusFilter} />
          ) : isLoading ? (
            <div className="text-center py-16">
              <div className="text-muted-foreground">Loading training sessions...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {sessionsWithMetrics.map((sessionGroup, index) => (
                <div
                  key={`session-${sessionGroup.session.id}`}
                  className="animate-in fade-in-50 duration-500"
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
