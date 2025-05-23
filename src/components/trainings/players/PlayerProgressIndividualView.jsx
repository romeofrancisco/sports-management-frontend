import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  LineChart,
  BarChart,
  BarChart3,
  PlusCircle,
} from "lucide-react";
import PlayerProgressChart from "@/components/charts/PlayerProgressChart/PlayerProgressChart";
import PlayerProgressStats from "./PlayerProgressStats";

const PlayerProgressIndividualView = ({
  playerId,
  playerName,
  dateRangeParams,
  handleBackToCompare,
  openModal,
  teamSlug,
}) => {
  const [activeTab, setActiveTab] = useState("chart");

  return (
    <Card className="shadow-sm border overflow-hidden pt-0">
      <CardHeader className="bg-muted/30 pb-2 border-b py-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 rounded-full hover:bg-muted/80 transition-colors"
              onClick={handleBackToCompare}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
            <div>
              <CardTitle className="text-lg font-semibold">
                {playerName || "Player"}'s Progress
              </CardTitle>
              <CardDescription>
                Track individual performance over time
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <PlayerProgressStats playerId={playerId} />

      <Tabs
        defaultValue="chart"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="px-4 pt-2 border-b">
          <TabsList className="bg-background/80 backdrop-blur-sm border justify-start h-10 mb-2">
            <TabsTrigger
              value="chart"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <LineChart className="h-4 w-4 mr-2" />
              Chart
            </TabsTrigger>
            <TabsTrigger
              value="data"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <BarChart className="h-4 w-4 mr-2" />
              Data
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="chart" className="m-0">
          <PlayerProgressChart
            playerId={playerId}
            dateRange={dateRangeParams}
          />
        </TabsContent>
        <TabsContent value="data" className="m-0">
          <div className="p-4">
            <Card className="border shadow-sm bg-muted/5">
              <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="bg-muted/20 p-3 rounded-full mb-4">
                    <BarChart className="h-10 w-10 text-muted-foreground/80" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">
                    Detailed Metrics Data
                  </h3>
                  <p className="text-muted-foreground max-w-md mb-6">
                    A comprehensive data table showing all recorded metrics and
                    analytics for this player is coming soon.
                  </p>
                  <div className="flex gap-3">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => openModal(playerId, teamSlug)}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Record New Data Point
                    </Button>
                    <Button variant="outline" size="sm">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View All Data
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default PlayerProgressIndividualView;
