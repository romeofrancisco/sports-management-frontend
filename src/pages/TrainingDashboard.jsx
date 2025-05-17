import React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../components/ui";
import TrainingCategoriesList from "@/components/trainings/TrainingCategoriesList";
import TrainingMetricsList from "../components/trainings/TrainingMetricsList";
import TrainingSessionsList from "../components/trainings/sessions/TrainingSessionsList";
import {
  PlayerProgressChart,
  PlayerProgressMultiView,
} from "../components/trainings/PlayerProgressChart";
import TeamTrainingAnalytics from "../components/trainings/TeamTrainingAnalytics";
import TeamFilter from "../components/trainings/TeamFilter";
import PlayerFilter from "../components/trainings/PlayerFilter";
import PlayerSelectorChips from "../components/trainings/PlayerSelectorChips";
import { LayoutContainer } from "../layout/Container";
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
    handleQuickPlayerSelection
  } = useTrainingDashboard();

  return (
    <LayoutContainer>
      <div className="space-y-6">
        {/* Header with team selection */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Training Management</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Monitor training progress and manage training activities
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <TeamFilter 
              teams={teams}
              selectedTeamId={selectedTeamId}
              onSelect={handleTeamChange}
            />
          </div>
        </div>
        
        {/* Main tabs navigation */}
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <div className="mt-6">
            {/* Sessions tab */}
            <TabsContent value="sessions" className="space-y-4">              <TrainingSessionsList 
                teamSlug={selectedTeamId} 
                key={`sessions-${selectedTeamId || 'all'}`} 
              />
            </TabsContent>

            {/* Categories tab */}
            <TabsContent value="categories" className="space-y-4">
              <TrainingCategoriesList />
            </TabsContent>

            {/* Metrics tab */}
            <TabsContent value="metrics" className="space-y-4">
              <TrainingMetricsList />
            </TabsContent>

            {/* Progress tab */}
            <TabsContent value="progress" className="space-y-4">
              {/* Individual progress section */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Individual Progress</h2>
                <PlayerFilter
                  players={players}
                  selectedPlayerId={selectedPlayerId}
                  onSelect={setSelectedPlayerId}
                />
              </div>
              
              {/* Individual player chart or empty message */}
              {selectedPlayerId && selectedPlayerId !== "no_player" ? (                <PlayerProgressChart
                  playerId={selectedPlayerId}
                  teamSlug={selectedTeamId}
                  key={`progress-${selectedPlayerId}`}
                />
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Select a player to view their progress data
                  </p>
                </div>
              )}

              {/* Player comparison section */}
              <div className="mt-8 pt-6 border-t">
                <h2 className="text-2xl font-bold mb-4">Player Comparison</h2>

                {/* Quick select control */}
                <div className="flex justify-end mb-4">
                  <div className="w-64">
                    <Select
                      value={selectedPlayerIds.length > 0 ? "custom" : "compare"}
                      onValueChange={handleQuickPlayerSelection}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Quick select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="compare">
                          Compare players...
                        </SelectItem>
                        <SelectItem value="all">Select all players</SelectItem>
                        <SelectItem value="none">Clear selection</SelectItem>
                        {selectedPlayerIds.length > 0 && (
                          <SelectItem value="custom">
                            {selectedPlayerIds.length} player{selectedPlayerIds.length !== 1 ? 's' : ''} selected
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
                {selectedPlayerIds.length > 0 ? (                  <PlayerProgressMultiView
                    players={players.filter((p) =>
                      selectedPlayerIds.includes(p.id)
                    )}
                    teamSlug={selectedTeamId}
                    key={`multi-${selectedPlayerIds.join('-')}`}
                  />
                ) : (
                  <div className="text-center py-8 bg-muted/30 rounded-lg">
                    <p className="text-muted-foreground">
                      Select multiple players to compare their progress
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Analytics tab */}
            <TabsContent value="analytics" className="space-y-4">
              {selectedTeamId ? (                <TeamTrainingAnalytics 
                  teamSlug={selectedTeamId} 
                  key={`analytics-${selectedTeamId}`} 
                />
              ) : (
                <div className="text-center py-12 bg-muted/30 rounded-lg">
                  <p className="text-xl font-medium mb-2">Select a Team</p>
                  <p className="text-muted-foreground">
                    Please select a team from the dropdown above to view
                    analytics
                  </p>
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </LayoutContainer>
  );
};

export default TrainingDashboard;
