import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../ui/card";
import { Button } from "../../../../ui/button";
import { Badge } from "../../../../ui/badge";
import { Progress } from "../../../../ui/progress";
import SimpleCheckbox from "../../../../ui/simple-checkbox";
import { User, Users, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { usePlayerMetrics } from "./usePlayerMetrics";
import { useTrainingMetrics, useAssignMetricsToSinglePlayer } from "@/hooks/useTrainings";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const PlayerMetricsTab = ({ session, onSaveSuccess }) => {  const {
    allPlayers,
    playerAssignedMetrics,
    selectedPlayerMetrics,
    metricsToRemove,
    handleTogglePlayerMetric,
    handleAssignPlayerMetrics,
    handleAssignToPlayers,
    clearPlayerState,
  } = usePlayerMetrics(session);

  // Add direct mutation hook for navigation control
  const { mutate: assignSinglePlayerMetrics } = useAssignMetricsToSinglePlayer();

  // State for current player navigation
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);

  // Fetch all metrics
  const { data: allMetrics } = useTrainingMetrics();

  // Get session metric IDs
  const sessionMetricIds = useMemo(() => {
    return session?.metrics?.map((m) => m.id) || [];
  }, [session?.metrics]);

  // Use all metrics as filtered metrics for now (could add filtering later)
  const filteredMetrics = allMetrics || [];  // Navigation handlers
  const handlePreviousPlayer = async () => {
    // Save current player's metrics before navigating (without triggering onSaveSuccess)
    const currentPlayerId = allPlayers[currentPlayerIndex]?.player?.id;
    if (currentPlayerId && 
        (((selectedPlayerMetrics[currentPlayerId] || []).length > 0) || 
         ((metricsToRemove[currentPlayerId] || []).length > 0))) {
      await savePlayerMetrics(currentPlayerId, false);
    }
    setCurrentPlayerIndex((prev) => Math.max(0, prev - 1));
  };

  // Helper function to save metrics with control over navigation
  const savePlayerMetrics = async (playerId, shouldNavigate = false) => {
    const metricsToAssign = selectedPlayerMetrics[playerId] || [];
    const metricsToRemoveList = metricsToRemove[playerId] || [];
    
    // Calculate final metrics: current assigned - removed + newly selected
    const currentAssigned = playerAssignedMetrics.get(playerId) || [];
    const finalMetrics = [
      ...currentAssigned.filter(m => !metricsToRemoveList.includes(m.id)).map(m => m.id),
      ...metricsToAssign
    ];
    
    if (finalMetrics.length === 0 && metricsToAssign.length === 0 && metricsToRemoveList.length === 0) {
      return; // Nothing to save
    }

    return new Promise((resolve, reject) => {
      assignSinglePlayerMetrics(
        {
          sessionId: session.id,
          playerId: playerId,
          metricIds: finalMetrics,
        },        {
          onSuccess: () => {
            // Clear selected metrics and removal list for this player after assignment
            clearPlayerState(playerId);
            
            // Only call onSaveSuccess if shouldNavigate is true
            if (shouldNavigate && onSaveSuccess) {
              onSaveSuccess();
            }
            
            resolve();
          },
          onError: (error) => {
            reject(error);
          }
        }
      );
    });
  };  const handleNextPlayer = async () => {
    // Save current player's metrics before navigating
    const currentPlayerId = allPlayers[currentPlayerIndex]?.player?.id;
    const isLastPlayer = currentPlayerIndex === allPlayers.length - 1;
    
    // Check if current player has any metrics (assigned + selected - removed)
    const currentPlayerAssignedMetrics = playerAssignedMetrics.get(currentPlayerId) || [];
    const currentPlayerSelectedMetrics = selectedPlayerMetrics[currentPlayerId] || [];
    const currentPlayerRemovingMetrics = metricsToRemove[currentPlayerId] || [];
    
    // Calculate effective metrics count
    const effectiveMetricsCount = currentPlayerAssignedMetrics.length - currentPlayerRemovingMetrics.length + currentPlayerSelectedMetrics.length;
    
    // Prevent navigation if player has no metrics
    if (effectiveMetricsCount === 0) {
      toast.error(`${currentPlayer?.first_name} ${currentPlayer?.last_name} needs at least one metric assigned to proceed.`);
      return;
    }
    
    if (currentPlayerId && 
        (((selectedPlayerMetrics[currentPlayerId] || []).length > 0) || 
         ((metricsToRemove[currentPlayerId] || []).length > 0))) {
      
      // Save metrics - trigger navigation only if this is the last player
      await savePlayerMetrics(currentPlayerId, isLastPlayer);
    } else if (isLastPlayer) {
      // If last player but no changes to save, still trigger navigation
      if (onSaveSuccess) {
        onSaveSuccess();
      }
      return;
    }
      // If not the last player, navigate to next player
    if (!isLastPlayer) {
      setCurrentPlayerIndex((prev) =>
        Math.min(allPlayers.length - 1, prev + 1)
      );
    }
  };
  // Calculate progress
  const progressPercentage =
    allPlayers.length > 0
      ? ((currentPlayerIndex + 1) / allPlayers.length) * 100
      : 0;
  if (allPlayers.length === 0) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Player-Specific Metric Assignment
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Assign specific metrics to individual players. This is useful when
            different players need to track different metrics.
          </p>
        </CardHeader>        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p>No players found for this session.</p>
            <p className="text-sm">Please check the session configuration.</p>
          </div>
        </CardContent>
      </Card>
    );
  }  const currentRecord = allPlayers[currentPlayerIndex];
  const currentPlayer = currentRecord?.player;
  const playerId = currentPlayer?.id;
  const playerMetrics = playerAssignedMetrics.get(playerId) || [];
  const metricsToRemoveCount = (metricsToRemove[playerId] || []).length;
  const selectedMetricsCount = (selectedPlayerMetrics[playerId] || []).length;
  const effectiveMetricsCount = playerMetrics.length - metricsToRemoveCount + selectedMetricsCount;
  
  // Check if player can proceed (has at least one metric)
  const canProceed = effectiveMetricsCount > 0;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Player-Specific Metric Assignment
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Assign specific metrics to individual players. Navigate through each
          player to configure their metrics.
        </p>
      </CardHeader>
      <CardContent className="space-y-6 flex flex-col h-full">
        {/* Progress Bar */}
        <div className="space-y-2">          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              Player {currentPlayerIndex + 1} of {allPlayers.length}
            </span>
            <span className="text-muted-foreground">
              {Math.round(progressPercentage)}% Complete
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
        {/* Player Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPlayer}
            disabled={currentPlayerIndex === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold">
                {currentPlayer?.first_name} {currentPlayer?.last_name}
              </h3>              <p className="text-sm text-muted-foreground">
                {effectiveMetricsCount} metrics assigned
                {metricsToRemoveCount > 0 && (
                  <span className="text-red-600 ml-1">
                    ({metricsToRemoveCount} pending removal)
                  </span>
                )}
                {selectedMetricsCount > 0 && (
                  <span className="text-blue-600 ml-1">
                    ({selectedMetricsCount} selected)
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPlayer}
              disabled={!canProceed}
              className={`flex items-center gap-2 ${
                !canProceed ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {currentPlayerIndex === allPlayers.length - 1 ? "Complete" : "Next"}
              <ChevronRight className="h-4 w-4" />
            </Button>
            {!canProceed && (
              <p className="text-xs text-red-600 max-w-[150px] text-right">
                Assign at least one metric to proceed
              </p>
            )}
          </div>
        </div>
        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              if (sessionMetricIds.length > 0) {
                handleAssignToPlayers(sessionMetricIds, [playerId]);
              } else {
                toast.info(
                  "No session metrics available. Configure session metrics first."
                );
              }
            }}
            disabled={sessionMetricIds.length === 0}
            className="flex-1"
          >
            Assign Session Metrics
          </Button>
        </div>
        {/* Player's assigned metrics */}
        {playerMetrics.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Currently Assigned Metrics:</h4>
            <div className="flex flex-wrap gap-2">
              {playerMetrics.map((metric) => {
                const isMarkedForRemoval = (
                  metricsToRemove[playerId] || []
                ).includes(metric.id);
                return (
                  <Badge
                    key={metric.id}
                    variant={isMarkedForRemoval ? "destructive" : "secondary"}
                    className={cn(
                      "text-sm",
                      isMarkedForRemoval && "line-through"
                    )}
                  >
                    {metric.name}
                    {isMarkedForRemoval && " (removing)"}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}{" "}
        {/* Metric Selection */}
        <div className="space-y-4 flex-1 flex flex-col">
          <h4 className="text-sm font-medium">Select Metrics to Assign:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 rounded flex-1">
            {filteredMetrics.map((metric) => {
              const isAlreadyAssigned = playerMetrics.some(
                (pm) => pm.id === metric.id
              );
              const isSelected = (
                selectedPlayerMetrics[playerId] || []
              ).includes(metric.id);
              const isMarkedForRemoval = (
                metricsToRemove[playerId] || []
              ).includes(metric.id);

              const isChecked = isAlreadyAssigned
                ? !isMarkedForRemoval
                : isSelected;

              return (
                <div
                  key={metric.id}
                  className={cn(
                    "flex items-center space-x-3 p-3 rounded-lg border transition-colors",
                    isAlreadyAssigned &&
                      !isMarkedForRemoval &&
                      "bg-green-50 border-green-200",
                    isMarkedForRemoval && "bg-red-50 border-red-200",
                    isSelected &&
                      !isAlreadyAssigned &&
                      "bg-blue-50 border-blue-200",
                    "hover:bg-muted/50"
                  )}
                >
                  <SimpleCheckbox
                    checked={isChecked}
                    onChange={() =>
                      handleTogglePlayerMetric(playerId, metric.id)
                    }
                  />
                  <div className="flex-1">
                    <span
                      className={cn(
                        "font-medium",
                        isAlreadyAssigned &&
                          !isMarkedForRemoval &&
                          "text-green-700",
                        isMarkedForRemoval && "text-red-700 line-through"
                      )}
                    >
                      {metric.name}
                    </span>
                    {metric.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {metric.description}
                      </p>
                    )}
                  </div>
                  {isAlreadyAssigned && !isMarkedForRemoval && (
                    <Badge variant="outline" className="text-green-600">
                      <Check className="h-3 w-3 mr-1" />
                      Assigned
                    </Badge>
                  )}
                  {isMarkedForRemoval && (
                    <Badge variant="destructive">Removing</Badge>
                  )}
                </div>
              );
            })}
          </div>        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerMetricsTab;
