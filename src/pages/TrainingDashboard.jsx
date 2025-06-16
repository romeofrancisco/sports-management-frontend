import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Users, ChevronDown, BarChart3 } from "lucide-react";
import TrainingCategoriesList from "@/components/trainings/TrainingCategoriesList";
import TrainingMetricsList from "../components/trainings/TrainingMetricsList";
import TrainingSessionsList from "../components/trainings/sessions/TrainingSessionsList";
import { PlayerProgressChart } from "@/components/charts/PlayerProgressChart";
import { PlayerProgressMultiView } from "@/components/trainings/players";
import { PlayerRadarChartContainer } from "@/components/charts/PlayerRadarChart";
import UniversityPageHeader from "@/components/common/UniversityPageHeader";

import TeamFilter from "../components/trainings/TeamFilter";
import PlayerFilter from "../components/trainings/PlayerFilter";
import PlayerSelectorChips from "../components/trainings/PlayerSelectorChips";
import useTrainingDashboard from "../hooks/useTrainingDashboard";

const TrainingDashboard = () => {
  const {
    activeTab,
    selectedTeamId,
    selectedPlayerId,
    selectedPlayerIds,
    teams,
    players,
    filteredPlayers,
    setActiveTab,
    setSelectedPlayerId,
    handleTeamChange,
    togglePlayerSelection,
    handleQuickPlayerSelection,
  } = useTrainingDashboard();
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/2 to-secondary/2">
      <div className="p-4 md:p-6 space-y-8">
        {/* Header with team selection */}
        <UniversityPageHeader
          title="Training Management"
          subtitle="Training Portal"
          description="Monitor training progress and manage training activities"
          showOnlineStatus={true}
          showUniversityColors={true}
        >
          <div className="flex items-center space-x-4">
            <TeamFilter
              teams={teams}
              selectedTeamId={selectedTeamId}
              onSelect={handleTeamChange}
            />
          </div>
        </UniversityPageHeader>

        {/* Main tabs navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="radar">Radar Analysis</TabsTrigger>
          </TabsList>
          <div className="mt-6">
            {/* Sessions tab */}
            <TabsContent value="sessions" className="space-y-0">
              <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
                <TrainingSessionsList
                  teamSlug={selectedTeamId}
                  key={`sessions-${selectedTeamId || "all"}`}
                />
              </div>
            </TabsContent>
            {/* Categories tab */}
            <TabsContent value="categories" className="space-y-0">
              <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
                <TrainingCategoriesList />
              </div>
            </TabsContent>
            {/* Metrics tab */}
            <TabsContent value="metrics" className="space-y-0">
              <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
                <TrainingMetricsList />
              </div>
            </TabsContent>{" "}
            {/* Progress tab */}
            <TabsContent value="progress" className="space-y-0">
              <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
                <div className="p-6 space-y-6">
                  {/* Individual progress section */}
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">
                      Individual Progress
                    </h2>
                    <PlayerFilter
                      players={players}
                      selectedPlayerId={selectedPlayerId}
                      onSelect={setSelectedPlayerId}
                    />
                  </div>

                  {/* Individual player chart or empty message */}
                  {selectedPlayerId && selectedPlayerId !== "no_player" ? (
                    <PlayerProgressChart
                      playerId={selectedPlayerId}
                      teamSlug={selectedTeamId}
                      key={`progress-${selectedPlayerId}`}
                    />
                  ) : (
                    <Card className="border-2 border-dashed border-muted-foreground/20 bg-muted/5">
                      <CardContent className="p-8 text-center">                        <div className="flex flex-col items-center justify-center space-y-4">
                          {/* Icon with background */}
                          <div className="bg-muted/20 p-4 rounded-full">
                            <Target className="h-12 w-12 text-muted-foreground/60" />
                          </div>

                          {/* Title and description */}
                          <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-foreground">
                              No Player Selected
                            </h3>
                            <p className="text-sm text-muted-foreground max-w-md">
                              Choose a player from the dropdown above to view
                              their individual training progress and performance
                              metrics.
                            </p>
                          </div>

                          {/* Call to action hint */}
                          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 px-3 py-2 rounded-full">
                            <ChevronDown className="h-3 w-3" />
                            <span>Use the player dropdown to get started</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Player comparison section */}
                  <div className="pt-6 border-t">
                    <h2 className="text-2xl font-bold mb-4">
                      Player Comparison
                    </h2>
                    {/* Quick select control */}
                    <div className="flex justify-end mb-4">
                      <div className="w-64">
                        <Select
                          value={
                            selectedPlayerIds.length > 0 ? "custom" : "compare"
                          }
                          onValueChange={handleQuickPlayerSelection}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Quick select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="compare">
                              Compare players...
                            </SelectItem>
                            <SelectItem value="all">
                              Select all players
                            </SelectItem>
                            <SelectItem value="none">
                              Clear selection
                            </SelectItem>
                            {selectedPlayerIds.length > 0 && (
                              <SelectItem value="custom">
                                {selectedPlayerIds.length} player
                                {selectedPlayerIds.length !== 1 ? "s" : ""}{" "}
                                selected
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    {/* Player selection chips */}
                    <PlayerSelectorChips
                      players={players}
                      selectedPlayerIds={selectedPlayerIds}
                      onTogglePlayer={togglePlayerSelection}
                    />
                    {/* Multi-player progress chart or empty message */}
                    {selectedPlayerIds.length > 0 ? (
                      <PlayerProgressMultiView
                        players={players.filter((p) =>
                          selectedPlayerIds.includes(p.id)
                        )}
                        teamSlug={selectedTeamId}
                        key={`multi-${selectedPlayerIds.join("-")}`}
                      />
                    ) : (
                      <Card className="border-2 border-dashed border-muted-foreground/20 bg-muted/5">
                        <CardContent className="p-8 text-center">
                          <div className="flex flex-col items-center justify-center space-y-4">
                            {/* Icon with background */}
                            <div className="bg-muted/20 p-4 rounded-full">
                              <Users className="h-12 w-12 text-muted-foreground/60" />
                            </div>

                            {/* Title and description */}
                            <div className="space-y-2">
                              <h3 className="text-lg font-semibold text-foreground">
                                No Players Selected for Comparison
                              </h3>
                              <p className="text-sm text-muted-foreground max-w-md">
                                Select multiple players from the chips above to
                                compare their training progress side by side.
                              </p>
                            </div>

                            {/* Call to action hint */}
                            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 px-3 py-2 rounded-full">
                              <BarChart3 className="h-3 w-3" />
                              <span>
                                Click on player chips to start comparing
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>                    )}{" "}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Radar Analysis tab */}
            <TabsContent value="radar" className="space-y-0">
              <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
                <div className="p-6 space-y-6">
                  {/* Player selection for radar */}
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-semibold">
                        Performance Radar Analysis
                      </h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        Multi-dimensional performance visualization across training categories
                      </p>
                    </div>
                    <PlayerFilter
                      players={players}
                      selectedPlayerId={selectedPlayerId}
                      onSelect={setSelectedPlayerId}
                    />
                  </div>

                  {/* Radar chart or empty message */}
                  {selectedPlayerId && selectedPlayerId !== "no_player" ? (
                    <PlayerRadarChartContainer
                      playerId={selectedPlayerId}
                      playerName={
                        players.find(p => p.id === parseInt(selectedPlayerId))?.full_name ||
                        players.find(p => p.id === parseInt(selectedPlayerId))?.name ||
                        "Selected Player"
                      }
                      key={`radar-${selectedPlayerId}`}
                    />
                  ) : (
                    <Card className="border-2 border-dashed border-muted-foreground/20 bg-muted/5">
                      <CardContent className="p-8 text-center">
                        <div className="flex flex-col items-center justify-center space-y-4">
                          {/* Icon with background */}
                          <div className="bg-muted/20 p-4 rounded-full">
                            <BarChart3 className="h-12 w-12 text-muted-foreground/60" />
                          </div>

                          {/* Title and description */}
                          <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-foreground">
                              No Player Selected for Radar Analysis
                            </h3>
                            <p className="text-sm text-muted-foreground max-w-md">
                              Choose a player from the dropdown above to view their performance radar chart 
                              across different training categories like strength, endurance, speed, and more.
                            </p>
                          </div>

                          {/* Call to action hint */}
                          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 px-3 py-2 rounded-full">
                            <ChevronDown className="h-3 w-3" />
                            <span>Select a player to view their radar analysis</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>
          </div></Tabs>
      </div>
    </div>
  );
};

export default TrainingDashboard;
