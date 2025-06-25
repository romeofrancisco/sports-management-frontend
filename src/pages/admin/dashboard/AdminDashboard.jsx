import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, PieChart } from "lucide-react";
import {
  useAdminOverview,
  useAdminAnalytics,
  useAdminInsights,
} from "@/api/dashboardApi";
import { useSelector } from "react-redux";
import UniversityPageHeader from "@/components/common/UniversityPageHeader";

// Import refactored components using index files for cleaner imports
import {
  DashboardSkeleton,
  SystemOverviewCards,
  SystemHealthSection,
  DistributionSection,
  InsightsSection,
  QuickActionsSection,
} from "./components";
import { ChartsSection } from "./charts";

const AdminDashboard = () => {
  const [aiEnabled, setAiEnabled] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const {
    data: overview,
    isLoading: overviewLoading,
    error: overviewError,
  } = useAdminOverview();
  const {
    data: analytics,
    isLoading: analyticsLoading,
    error: analyticsError,
  } = useAdminAnalytics();
  const {
    data: insights,
    isLoading: insightsLoading,
    error: insightsError,
  } = useAdminInsights(aiEnabled);

  if (overviewLoading || analyticsLoading) {
    return <DashboardSkeleton />;
  }

  if (overviewError || analyticsError) {
    return (
      <div className="p-6">
        <div className="bg-destructive/15 border border-destructive/50 rounded-lg p-4">
          <h3 className="text-destructive font-semibold">
            Error Loading Dashboard
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {overviewError?.message ||
              analyticsError?.message ||
              "Failed to load dashboard data"}
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/2 to-secondary/2">
      <div className="p-4 md:p-6 space-y-8">
        {/* Enhanced Header with University Logo */}
        <UniversityPageHeader
          title={`Welcome Administrator ${user?.first_name || ""}!`}
          description="Monitor system performance and manage sports operations"
          showOnlineStatus={true}
          showUniversityColors={true}
        />
        {/* System Overview Cards */}

        <SystemOverviewCards overview={overview} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Primary Content */}
          <div className="xl:col-span-2 space-y-6">
            {/* System Health Section */}
            <SystemHealthSection overview={overview} />
            <DistributionSection overview={overview} />
            {/* Analytics Charts */}
            <ChartsSection overview={overview} analytics={analytics} />
          </div>
          {/* Right Column - Secondary Content */}
          <div className="xl:col-span-1 space-y-6">
            {/* Quick Actions */}
            <QuickActionsSection overview={overview} />
            {/* Insights Section Card now handled inside InsightsSection */}
            <InsightsSection
              insights={insights}
              isLoading={insightsLoading}
              error={insightsError}
              aiEnabled={aiEnabled}
              onAiToggle={setAiEnabled}
            />
            {/* Distribution Section Card now handled inside DistributionSection */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
