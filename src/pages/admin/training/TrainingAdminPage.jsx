import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TrainingCategoriesPage from "./TrainingCategoriesPage";
import PlayerMetricsPage from "./PlayerMetricsPage";

const TrainingAdminPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  // Determine the active tab based on the URL
  const getActiveTab = () => {
    if (currentPath.includes("/admin/training/metrics")) {
      return "metrics";
    } else {
      return "settings";
    }
  };

  const handleTabChange = (value) => {
    if (value === "settings") {
      navigate("/admin/training");
    } else if (value === "metrics") {
      navigate("/admin/training/metrics");
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold">Training Management</h1>

      <Tabs
        defaultValue={getActiveTab()}
        className="mt-6"
        onValueChange={handleTabChange}
      >
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
          <TabsTrigger value="settings">Configuration</TabsTrigger>
          <TabsTrigger value="metrics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="mt-0">
          <TrainingCategoriesPage />
        </TabsContent>

        <TabsContent value="metrics" className="mt-0">
          <PlayerMetricsPage />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrainingAdminPage;
