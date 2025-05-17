import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TrainingCategoriesList from "../categories/TrainingCategoriesList";
import TrainingMetricsList from "../metrics/TrainingMetricsList";
import TrainingSessionsList from "../sessions/TrainingSessionsList";
import TeamTrainingAnalytics from "../teams/TeamTrainingAnalytics";
import { useSelector } from "react-redux";
import PlayerProgressSection from "../players/PlayerProgressSection";

const TrainingDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("sessions");

  // Get user roles
  const isCoach = user?.roles?.includes("coach");


  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Training Management</h1>
          <p className="text-muted-foreground">
            Monitor and track player improvements through training
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
          <TabsTrigger value="sessions">Training Sessions</TabsTrigger>
          <TabsTrigger value="players">Player Progress</TabsTrigger>
          <TabsTrigger value="analytics">Team Analytics</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="sessions" className="mt-6">
          <TrainingSessionsList coachId={isCoach ? user?.id : null} />
        </TabsContent>

        <TabsContent value="players" className="mt-6">
          <PlayerProgressSection />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <TeamTrainingAnalytics />
        </TabsContent>

        <TabsContent value="categories" className="mt-6">
          <TrainingCategoriesList />
        </TabsContent>

        <TabsContent value="metrics" className="mt-6">
          <TrainingMetricsList />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrainingDashboard;
