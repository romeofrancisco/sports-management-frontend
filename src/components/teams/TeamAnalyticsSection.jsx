import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, RefreshCw } from "lucide-react";
import Loading from "@/components/common/FullLoading";

// Import refactored components
import QuickStatsCards from "./analytics/QuickStatsCards";
import { TeamStatsBreakdownChart, TeamPerformanceTrendsChart, TrainingAnalyticsChart } from "@/components/charts/TeamAnalyticsCharts";
import { processStatsBreakdown, processPerformanceData, processTrainingData } from "@/utils/teamAnalyticsHelpers";
import { useTeamAnalyticsData } from "@/hooks/useTeamAnalyticsData";

const TeamAnalyticsSection = ({ teamSlug }) => {
  const [timeRange, setTimeRange] = useState(30); // days
  // Use the custom hook for all data fetching and processing
  const {
    analytics,
    performance,
    games,
    trainings,
    statistics,
    attendanceTrends,
    attendanceOverview,
    trainingEffectiveness,
    teamOverviewMetrics,
    quickStats,
    isLoading,
    refetchAnalytics,
  } = useTeamAnalyticsData(teamSlug, timeRange);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-[400px]">
          <Loading />
        </CardContent>
      </Card>
    );
  }  return (
    <div className="space-y-6">
      {/* Quick Stats Cards */}
      <QuickStatsCards stats={quickStats} />

      {/* Team Overview Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Team Overview
              </CardTitle>
              <CardDescription>
                Overall team performance and metrics
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                Last {timeRange} days
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetchAnalytics()}
                className="h-8 w-8 p-0"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>        <CardContent>
          <TeamStatsBreakdownChart
            data={processStatsBreakdown(statistics)}
            title="Win/Loss Distribution"
          />
        </CardContent>
      </Card>

      {/* Performance Analytics Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Performance Analytics
          </CardTitle>
          <CardDescription>
            Game performance and statistics
          </CardDescription>
        </CardHeader>        <CardContent>
          <TeamPerformanceTrendsChart
            data={processPerformanceData(performance)}
            title="Detailed Performance Analysis"
          />
        </CardContent>
      </Card>

      {/* Training Analytics Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Training Analytics
          </CardTitle>
          <CardDescription>
            Training effectiveness and attendance
          </CardDescription>        </CardHeader>        <CardContent>
          <TrainingAnalyticsChart
            data={processTrainingData(trainingEffectiveness, trainings, attendanceTrends, analytics)}
            title="Training Session Analysis"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamAnalyticsSection;
