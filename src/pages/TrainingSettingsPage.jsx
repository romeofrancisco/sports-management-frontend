import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MetricUnitsManager } from "@/components/trainings/units/MetricUnitsManager";

const TrainingSettingsPage = () => {
  const [activeTab, setActiveTab] = useState("units");

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6">Training Settings</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="units">Metric Units</TabsTrigger>
        </TabsList>        <TabsContent value="units" className="space-y-0">
          <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <MetricUnitsManager />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrainingSettingsPage;
