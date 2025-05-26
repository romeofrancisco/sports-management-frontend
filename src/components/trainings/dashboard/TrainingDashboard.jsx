import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TrainingCategoriesList from "../categories/TrainingCategoriesList";
import TrainingMetricsList from "../metrics/TrainingMetricsList";
import TrainingSessionsList from "../sessions/TrainingSessionsList";
import PageHeader from "@/components/common/PageHeader";
import AttendanceAnalyticsTab from "../attendance/AttendanceAnalyticsTab";

import { useSelector } from "react-redux";
import { PlayerProgressSection } from "../players";
import { MetricUnitsManager } from "../units/MetricUnitsManager";

const TrainingDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("sessions");

  // Get user roles
  const isCoach = user?.roles?.includes("coach");

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Header Section */}
        <PageHeader
          title="Training Management"
          description="Monitor and track player improvements through comprehensive training analysis"
        />

        {/* Tabs Section - Enhanced responsive design */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Mobile-first tab layout */}
          <div className="w-full overflow-x-auto">
            <TabsList className="grid w-full min-w-fit grid-cols-2 sm:grid-cols-3 md:grid-cols-6 h-auto">
              <TabsTrigger
                value="sessions"
                className="whitespace-nowrap px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm"
              >
                <span className="hidden sm:inline">Training </span>Sessions
              </TabsTrigger>
              <TabsTrigger
                value="players"
                className="whitespace-nowrap px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm"
              >
                <span className="hidden sm:inline">Player </span>Progress
              </TabsTrigger>
              <TabsTrigger
                value="attendance"
                className="whitespace-nowrap px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm"
              >
                Attendance
              </TabsTrigger>
              <TabsTrigger
                value="categories"
                className="whitespace-nowrap px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm"
              >
                Categories
              </TabsTrigger>
              <TabsTrigger
                value="metrics"
                className="whitespace-nowrap px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm"
              >
                Metrics
              </TabsTrigger>
              <TabsTrigger
                value="units"
                className="whitespace-nowrap px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm"
              >
                Units
              </TabsTrigger>
            </TabsList>
          </div>
          {/* Tab Content - Responsive containers */}
          <div className="mt-6">
            <TabsContent value="sessions" className="space-y-0">
              <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
                <TrainingSessionsList coachId={isCoach ? user?.id : null} />
              </div>
            </TabsContent>
            <TabsContent value="players" className="space-y-0">
              <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
                <PlayerProgressSection />
              </div>
            </TabsContent>
            <TabsContent value="attendance" className="space-y-0">
              <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
                <AttendanceAnalyticsTab />
              </div>
            </TabsContent>
            <TabsContent value="categories" className="space-y-0">
              <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
                <TrainingCategoriesList />
              </div>
            </TabsContent>
            <TabsContent value="metrics" className="space-y-0">
              <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
                <TrainingMetricsList />
              </div>
            </TabsContent>
            <TabsContent value="units" className="space-y-0">
              <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
                <MetricUnitsManager />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default TrainingDashboard;
