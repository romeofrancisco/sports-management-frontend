import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, PieChart, FileText } from "lucide-react";
import {
  useAdminOverview,
  useAdminAnalytics,
  useAdminInsights,
  useAdminReports,
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
  ReportsSection,
  QuickActionsSection,
} from "./components";
import { ChartsSection } from "./charts";

const AdminDashboard = () => {
  const [selectedReportType, setSelectedReportType] = useState("summary");
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
  const {
    data: reports,
    isLoading: reportsLoading,
    error: reportsError,
  } = useAdminReports(selectedReportType);

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
        <div className="animate-in fade-in-50 duration-500 delay-100">
          <SystemOverviewCards overview={overview} />
        </div>
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Primary Content */}
          <div className="xl:col-span-2 space-y-6">
            {/* System Health Section */}
            <div className="animate-in fade-in-50 duration-500 delay-200">
              <SystemHealthSection overview={overview} />
            </div>

            {/* Analytics Charts */}
            <div className="animate-in fade-in-50 duration-500 delay-300">
              <ChartsSection overview={overview} analytics={analytics} />
            </div>
          </div>          {/* Right Column - Secondary Content */}
          <div className="xl:col-span-1 space-y-6">
            {" "}
            {/* Quick Actions */}
            <div className="animate-in fade-in-50 duration-500 delay-300">
              <QuickActionsSection overview={overview} />
            </div>
            {/* Main Content Tabs */}
            <div className="animate-in fade-in-50 duration-500 delay-400">
              <Card className="bg-gradient-to-br from-card via-card to-card/95 shadow-xl border-2 border-primary/20 transition-all duration-300 hover:shadow-2xl hover:border-primary/30 relative overflow-hidden">
                {/* Enhanced background effects */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/10 to-transparent rounded-full blur-2xl opacity-70"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-xl opacity-60"></div>

                <CardContent className="relative p-6">
                  <Tabs defaultValue="insights" className="space-y-6">
                    <TabsList className="grid w-full h-full grid-cols-3 bg-gradient-to-r from-card/60 via-card/80 to-card/60 backdrop-blur-md border-2 border-primary/30 rounded-2xl p-1 gap-1">
                      <TabsTrigger
                        value="insights"
                        className="group relative flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all duration-500 ease-out
                                   hover:bg-gradient-to-r hover:from-primary/20 hover:to-primary/30 hover:shadow-lg hover:scale-[1.02] hover:border hover:border-primary/40
                                   data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/90 
                                   data-[state=active]:text-primary-foreground data-[state=active]:shadow-xl data-[state=active]:scale-[1.02]
                                   data-[state=active]:border-2 data-[state=active]:border-primary/50
                                   data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground"
                      >
                        <Lightbulb className="w-4 h-4 transition-all duration-300 group-hover:animate-pulse group-data-[state=active]:animate-bounce" />
                        <span className="hidden sm:inline transition-all duration-300">
                          Insights
                        </span>
                        <span className="sm:hidden transition-all duration-300">
                          Info
                        </span>
                        {/* Active indicator */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-data-[state=active]:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      </TabsTrigger>
                      <TabsTrigger
                        value="distribution"
                        className="group relative flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all duration-500 ease-out
                                   hover:bg-gradient-to-r hover:from-secondary/20 hover:to-secondary/30 hover:shadow-lg hover:scale-[1.02] hover:border hover:border-secondary/40
                                   data-[state=active]:bg-gradient-to-r data-[state=active]:from-secondary data-[state=active]:to-secondary/90 
                                   data-[state=active]:text-secondary-foreground data-[state=active]:shadow-xl data-[state=active]:scale-[1.02]
                                   data-[state=active]:border-2 data-[state=active]:border-secondary/50
                                   data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground"
                      >
                        <PieChart className="w-4 h-4 transition-all duration-300 group-hover:rotate-12 group-data-[state=active]:rotate-45" />
                        <span className="hidden sm:inline transition-all duration-300">
                          Distribution
                        </span>
                        <span className="sm:hidden transition-all duration-300">
                          Charts
                        </span>
                        {/* Active indicator */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-secondary/10 to-transparent opacity-0 group-data-[state=active]:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      </TabsTrigger>
                      <TabsTrigger
                        value="reports"
                        className="group relative flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all duration-500 ease-out
                                   hover:bg-gradient-to-r hover:from-primary/20 hover:to-primary/30 hover:shadow-lg hover:scale-[1.02] hover:border hover:border-primary/40
                                   data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/90 
                                   data-[state=active]:text-primary-foreground data-[state=active]:shadow-xl data-[state=active]:scale-[1.02]
                                   data-[state=active]:border-2 data-[state=active]:border-primary/50
                                   data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground"
                      >
                        <FileText className="w-4 h-4 transition-all duration-300 group-hover:scale-110 group-data-[state=active]:scale-125" />
                        <span className="hidden sm:inline transition-all duration-300">
                          Reports
                        </span>
                        <span className="sm:hidden transition-all duration-300">
                          Files
                        </span>
                        {/* Active indicator */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-data-[state=active]:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      </TabsTrigger>
                    </TabsList>{" "}                    <TabsContent value="insights" className="space-y-6">
                      <InsightsSection
                        insights={insights}
                        isLoading={insightsLoading}
                        error={insightsError}
                        aiEnabled={aiEnabled}
                        onAiToggle={setAiEnabled}
                      />
                    </TabsContent>
                    <TabsContent value="distribution" className="space-y-6">
                      <DistributionSection overview={overview} />
                    </TabsContent>
                    <TabsContent value="reports" className="space-y-6">
                      <ReportsSection
                        reports={reports}
                        selectedReportType={selectedReportType}
                        setSelectedReportType={setSelectedReportType}
                        isLoading={reportsLoading}
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
