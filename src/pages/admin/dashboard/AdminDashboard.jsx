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
        <div className="bg-gradient-to-r from-card via-secondary/8 to-primary/8 rounded-xl p-4 md:p-6 shadow-xl border-2 border-primary/20 transition-all duration-300 hover:shadow-2xl animate-in fade-in-50 duration-500 relative overflow-hidden">
          {/* Enhanced background effects */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-secondary/15 to-transparent rounded-full blur-3xl opacity-70"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-primary/15 to-transparent rounded-full blur-2xl opacity-60"></div>

          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6">
              {/* University Logo with enhanced styling */}
              <div className="flex-shrink-0 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg blur-sm opacity-60"></div>
                <div className="relative bg-card p-2 rounded-lg shadow-lg border-2 border-secondary/30">
                  <img
                    src="/UPHSD-logo.png"
                    alt="University of Perpetual Help System DALTA"
                    className="h-10 sm:h-12 md:h-16 w-auto object-contain"
                  />
                </div>
              </div>
              <div className="sm:border-l-2 sm:border-primary/40 sm:pl-4 md:pl-6">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-gradient break-words">
                  Welcome Administrator {user?.first_name || ""}!
                </h1>
                <p className="text-foreground mt-1 md:mt-2 text-sm sm:text-base md:text-lg font-semibold">
                  University of Perpetual Help System DALTA
                </p>
                <p className="text-muted-foreground text-xs sm:text-sm font-medium">
                  Monitor system performance and manage sports operations
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 lg:gap-6 mt-4 lg:mt-0">
              <div className="flex items-center gap-2 md:gap-3 bg-card/80 backdrop-blur-md rounded-full px-3 md:px-4 py-2 border-2 border-secondary/30 shadow-lg">
                <div className="h-2.5 w-2.5 md:h-3 md:w-3 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 animate-pulse shadow-sm"></div>
                <span className="text-xs md:text-sm font-semibold text-foreground whitespace-nowrap">
                  System Online
                </span>
              </div>
              {/* Enhanced University Colors Indicator */}
              <div className="flex gap-2 items-center bg-card/80 backdrop-blur-md rounded-full px-2 md:px-3 py-2 border-2 border-primary/30 shadow-lg">
                <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-gradient-to-br from-primary to-primary/80 shadow-md border border-white/30"></div>
                <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-gradient-to-br from-secondary to-secondary/80 shadow-md border border-white/30"></div>
                <span className="text-xs font-semibold text-muted-foreground ml-1 whitespace-nowrap">
                  UPHSD
                </span>
              </div>
            </div>
          </div>
        </div>
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
                    </TabsList>{" "}
                    <TabsContent value="insights" className="space-y-6">
                      <InsightsSection
                        insights={insights}
                        isLoading={insightsLoading}
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
