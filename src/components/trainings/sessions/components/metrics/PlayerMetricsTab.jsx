import React, { useMemo, useState } from "react";
import { Button } from "../../../../ui/button";
import { Badge } from "../../../../ui/badge";
import { Progress } from "../../../../ui/progress";
import SimpleCheckbox from "../../../../ui/simple-checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../ui/avatar";
import {
  Target,
  ChevronLeft,
  ChevronRight,
  Check,
  User,
  Clock,
  CheckCircle,
} from "lucide-react";
import { usePlayerMetrics } from "./usePlayerMetrics";
import {
  useTrainingMetrics,
  useAssignMetricsToSinglePlayer,
} from "@/hooks/useTrainings";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const PlayerMetricsTab = ({
  session,
  onSaveSuccess,
  lastSessionMissedMetrics,
  isFormDisabled = false,
}) => {
  const {
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
  const { mutate: assignSinglePlayerMetrics } =
    useAssignMetricsToSinglePlayer();

  // State for current player navigation
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);

  // Fetch all metrics
  const { data: allMetrics } = useTrainingMetrics();

  // Get session metric IDs
  const sessionMetricIds = useMemo(() => {
    return session?.metrics?.map((m) => m.id) || [];
  }, [session?.metrics]);

  // Use all metrics as filtered metrics for now (could add filtering later)
  const filteredMetrics = allMetrics || []; // Navigation handlers
  const handlePreviousPlayer = async () => {
    // Save current player's metrics before navigating (without triggering onSaveSuccess)
    const currentPlayerId = allPlayers[currentPlayerIndex]?.player?.id;
    if (
      currentPlayerId &&
      ((selectedPlayerMetrics[currentPlayerId] || []).length > 0 ||
        (metricsToRemove[currentPlayerId] || []).length > 0)
    ) {
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
      ...currentAssigned
        .filter((m) => !metricsToRemoveList.includes(m.id))
        .map((m) => m.id),
      ...metricsToAssign,
    ];

    if (
      finalMetrics.length === 0 &&
      metricsToAssign.length === 0 &&
      metricsToRemoveList.length === 0
    ) {
      return; // Nothing to save
    }

    return new Promise((resolve, reject) => {
      assignSinglePlayerMetrics(
        {
          sessionId: session.id,
          playerId: playerId,
          metricIds: finalMetrics,
        },
        {
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
          },
        }
      );
    });
  };  const handleNextPlayer = async () => {
    // Save current player's metrics before navigating
    const currentPlayerId = allPlayers[currentPlayerIndex]?.player?.id;
    const isLastPlayer = currentPlayerIndex === allPlayers.length - 1;

    // Check if current player has any metrics (assigned + selected - removed)
    const currentPlayerAssignedMetrics =
      playerAssignedMetrics.get(currentPlayerId) || [];
    const currentPlayerSelectedMetrics =
      selectedPlayerMetrics[currentPlayerId] || [];
    const currentPlayerRemovingMetrics = metricsToRemove[currentPlayerId] || [];

    // Calculate effective metrics count
    const effectiveMetricsCount =
      currentPlayerAssignedMetrics.length -
      currentPlayerRemovingMetrics.length +
      currentPlayerSelectedMetrics.length;

    // If form is disabled, only allow navigation without saving
    if (isFormDisabled) {
      if (!isLastPlayer) {
        setCurrentPlayerIndex((prev) =>
          Math.min(allPlayers.length - 1, prev + 1)
        );
      }
      return;
    }

    // Prevent navigation if player has no metrics
    if (effectiveMetricsCount === 0) {
      toast.error(
        `${currentPlayer?.first_name} ${currentPlayer?.last_name} needs at least one metric assigned to proceed.`
      );
      return;
    }

    if (
      currentPlayerId &&
      ((selectedPlayerMetrics[currentPlayerId] || []).length > 0 ||
        (metricsToRemove[currentPlayerId] || []).length > 0)
    ) {
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
      <div className="h-full flex flex-col">
        <div className="pb-4">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            <h3 className="text-lg font-bold">
              Player-Specific Metric Assignment
            </h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Assign specific metrics to individual players. This is useful when
            different players need to track different metrics.
          </p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center py-8 text-muted-foreground">
            <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p>No players found for this session.</p>
            <p className="text-sm">Please check the session configuration.</p>
          </div>
        </div>
      </div>
    );
  }
  const currentRecord = allPlayers[currentPlayerIndex];
  const currentPlayer = currentRecord?.player;
  const playerId = currentPlayer?.id;
  const playerMetrics = playerAssignedMetrics.get(playerId) || [];
  const metricsToRemoveCount = (metricsToRemove[playerId] || []).length;
  const selectedMetricsCount = (selectedPlayerMetrics[playerId] || []).length;
  const effectiveMetricsCount =
    playerMetrics.length - metricsToRemoveCount + selectedMetricsCount;

  // Find missed metrics for the current player from the last session
  const currentPlayerMissedMetrics = useMemo(() => {
    if (
      !lastSessionMissedMetrics?.players_with_missed_metrics ||
      !currentPlayer
    ) {
      return [];
    }

    // Find the current player in the missed metrics data
    // Match by player name since we might not have consistent IDs
    const playerName = `${currentPlayer.first_name} ${currentPlayer.last_name}`;
    const missedPlayerData =
      lastSessionMissedMetrics.players_with_missed_metrics.find(
        (p) => p.player_name === playerName
      );

    return missedPlayerData?.missed_metrics || [];
  }, [lastSessionMissedMetrics, currentPlayer]);

  // Create a set of missed metric IDs for quick lookup
  const missedMetricIds = useMemo(() => {
    return new Set(currentPlayerMissedMetrics.map((m) => m.metric_id));
  }, [currentPlayerMissedMetrics]);

  // Check if player can proceed (has at least one metric)
  const canProceed = effectiveMetricsCount > 0;
  return (
    <div className="space-y-6 flex flex-col h-full relative z-10">
      {/* Enhanced Player Navigation & Statistics Dashboard */}
      <div className="rounded-2xl border-2 border-primary/20 p-6 space-y-6">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Player {currentPlayerIndex + 1} of {allPlayers.length}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Progress:</span>
              <span className="text-sm font-bold text-primary">
                {Math.round(progressPercentage)}%
              </span>
            </div>
          </div>
          <div className="relative mt-1">
            <Progress value={progressPercentage} className="h-2.5 bg-muted" />
          </div>
        </div>
        {/* Header with Current Player */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-white shadow-lg">
              <AvatarImage
                src={currentPlayer?.profile || currentPlayer?.user?.profile}
                alt={`${currentPlayer?.first_name} ${currentPlayer?.last_name}`}
              />
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white font-bold">
                {currentPlayer?.profile ? (
                  <User className="h-6 w-6" />
                ) : (
                  `${currentPlayer?.first_name?.[0] || ""}${
                    currentPlayer?.last_name?.[0] || ""
                  }`.toUpperCase()
                )}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {currentPlayer?.first_name} {currentPlayer?.last_name}
              </h3>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-gray-600">
                  {effectiveMetricsCount} metrics assigned
                </span>
                {selectedMetricsCount > 0 && (
                  <Badge
                    variant="outline"
                    className="text-xs bg-green-500/20 border-green-700 text-green-600"
                  >
                    +{selectedMetricsCount} new
                  </Badge>
                )}
                {metricsToRemoveCount > 0 && (
                  <Badge
                    variant="outline"
                    className="text-xs bg-destructive/20 border-destructive text-destructive"
                  >
                    -{metricsToRemoveCount} removing
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Compact Statistics */}
          <div className="flex items-center gap-5 rounded-xl px-4 py-2.5 border-2 border-primary/20">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">
                {allPlayers.length} Total
              </span>
            </div>            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">
                {
                  allPlayers.filter(
                    (record) =>
                      record.assigned_metrics && record.assigned_metrics.length > 0
                  ).length
                }{" "}
                Done
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">
                {
                  allPlayers.filter(
                    (record) =>
                      !record.assigned_metrics ||
                      record.assigned_metrics.length === 0
                  ).length
                }{" "}
                Pending
              </span>
            </div>
          </div>
        </div>
        {/* Progress Bar with Navigation */}
        <div className="space-y-3">
          {/* Integrated Navigation Controls */}
          <div className="flex items-center justify-between">            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPlayer}
              disabled={currentPlayerIndex === 0}
              className="flex items-center gap-2 px-3 py-1.5 border-gray-300 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 disabled:opacity-50"
            >
              <ChevronLeft className="h-3 w-3" />
              <span className="text-xs">Previous</span>
            </Button>
            <div className="text-center">
              {!canProceed ? (
                <Badge
                  variant="outline"
                  className="text-sm bg-destructive/20 border-destructive text-destructive"
                >
                  Need at least one metric
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="text-sm bg-green-500/20 border-green-700 text-green-600"
                >
                  Ready to proceed
                </Badge>
              )}
            </div>            <Button
              variant={canProceed ? "default" : "outline"}
              size="sm"
              onClick={handleNextPlayer}
              disabled={!canProceed}
              className={`flex items-center py-1.5 transition-all duration-200 ${
                canProceed
                  ? "bg-primary hover:bg-primary/90"
                  : "border-red-300 text-red-600 hover:bg-red-50"
              }`}
            >
              <span className="text-xs">
                {currentPlayerIndex === allPlayers.length - 1
                  ? "Complete"
                  : "Next"}
              </span>
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        </div>{" "}
      </div>{" "}
      {/* Missed Metrics from Last Session */}
      {currentPlayerMissedMetrics.length > 0 && (
        <div className="rounded-xl p-4 border-2 border-amber-200 bg-amber-50/80 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-amber-800 flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-600" />
              Missed Metrics from Last Session
              <Badge
                variant="outline"
                className="text-xs bg-amber-100 text-amber-700 border-amber-300"
              >
                {currentPlayerMissedMetrics.length} missed
              </Badge>
            </h4>            <Button
              variant="outline"
              size="sm"
              disabled={isFormDisabled}
              onClick={() => {
                // Get all missed metric IDs that are not already assigned
                const missedMetricIds = currentPlayerMissedMetrics
                  .filter(
                    (missedMetric) =>
                      !playerMetrics.some(
                        (pm) => pm.id === missedMetric.metric_id
                      ) &&
                      !(selectedPlayerMetrics[playerId] || []).includes(
                        missedMetric.metric_id
                      )
                  )
                  .map((missedMetric) => missedMetric.metric_id);

                // Add all missed metrics to selection
                missedMetricIds.forEach((metricId) => {
                  handleTogglePlayerMetric(playerId, metricId);
                });
              }}
              className="text-xs px-3 py-1 bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200 hover:border-amber-400"
            >
              <Target className="h-3 w-3 mr-1" />
              Assign All Missed
            </Button>
          </div>
          <p className="text-xs text-amber-700 mb-3">
            These metrics were assigned but not recorded in the previous
            session. Click to select or use the button above:
          </p>
          <div className="flex flex-wrap gap-2">
            {currentPlayerMissedMetrics.map((missedMetric) => {
              const isAlreadyAssigned = playerMetrics.some(
                (pm) => pm.id === missedMetric.metric_id
              );
              const isSelected = (
                selectedPlayerMetrics[playerId] || []
              ).includes(missedMetric.metric_id);              const isClickable = !isAlreadyAssigned && !isFormDisabled;

              return (
                <Badge
                  key={missedMetric.metric_id}
                  variant="outline"
                  className={`text-sm px-3 py-1.5 font-medium transition-all duration-200 ${
                    isAlreadyAssigned
                      ? "bg-primary/10 text-primary border-primary/20"
                      : isSelected
                      ? "bg-secondary/10 text-secondary border-secondary/20 ring-2 ring-secondary/30"
                      : isFormDisabled
                      ? "bg-amber-100 text-amber-800 border-amber-300 opacity-60 cursor-not-allowed"
                      : "bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200 cursor-pointer"
                  }`}
                  onClick={() => {
                    if (isClickable) {
                      handleTogglePlayerMetric(
                        playerId,
                        missedMetric.metric_id
                      );
                    }
                  }}
                >
                  {isAlreadyAssigned ? (
                    <CheckCircle className="h-3 w-3 mr-1" />
                  ) : isSelected ? (
                    <Target className="h-3 w-3 mr-1" />
                  ) : (
                    <Clock className="h-3 w-3 mr-1" />
                  )}
                  {missedMetric.metric_name}
                  {missedMetric.metric_unit && (
                    <span className="ml-1 text-amber-600">
                      ({missedMetric.metric_unit})
                    </span>
                  )}{" "}
                  {isAlreadyAssigned && (
                    <span className="ml-1 text-primary text-xs">
                      ✓ Already assigned
                    </span>
                  )}
                  {isSelected && !isAlreadyAssigned && (
                    <span className="ml-1 text-secondary text-xs">
                      Selected
                    </span>
                  )}
                </Badge>
              );
            })}
          </div>
        </div>
      )}
      {/* Enhanced Player's Assigned Metrics */}
      {playerMetrics.length > 0 && (
        <div className="rounded-xl p-4 border-2 border-primary/20 shadow-sm">
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1pl">
            <CheckCircle className="h-4 w-4 text-primary" />
            Currently Assigned Metrics
          </h4>
          <div className="flex flex-wrap gap-2">
            {playerMetrics.map((metric) => {
              const isMarkedForRemoval = (
                metricsToRemove[playerId] || []
              ).includes(metric.id);
              return (
                <Badge
                  key={metric.id}
                  variant={isMarkedForRemoval ? "destructive" : "primary"}
                  className={cn(
                    "text-sm px-3 py-1.5 font-medium transition-all duration-200",
                    isMarkedForRemoval && "line-through opacity-75",
                    !isMarkedForRemoval &&
                      "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                  )}
                >
                  {metric.name}
                  {isMarkedForRemoval && " (removing)"}
                </Badge>
              );
            })}
          </div>
        </div>
      )}
      {/* Enhanced Metric Selection */}
      <div className="space-y-4 flex-1 flex flex-col">
        {" "}
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-semibold text-foreground">
            Select Metrics to Assign:
          </h4>
          <Badge variant="outline" className="text-xs">
            {filteredMetrics.length} available
          </Badge>
          {currentPlayerMissedMetrics.length > 0 && (
            <Badge
              variant="outline"
              className="text-xs bg-amber-100 text-amber-800 border-amber-300"
            >
              <Clock className="h-3 w-3 mr-1" />
              {currentPlayerMissedMetrics.length} from last session
            </Badge>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
          {filteredMetrics.map((metric) => {
            const isAlreadyAssigned = playerMetrics.some(
              (pm) => pm.id === metric.id
            );
            const isSelected = (selectedPlayerMetrics[playerId] || []).includes(
              metric.id
            );
            const isMarkedForRemoval = (
              metricsToRemove[playerId] || []
            ).includes(metric.id);

            // Check if this metric was missed in the last session
            const wasMissedInLastSession = missedMetricIds.has(metric.id);

            const isChecked = isAlreadyAssigned
              ? !isMarkedForRemoval
              : isSelected;

            return (              <div
                key={metric.id}
                className={cn(
                  "relative overflow-hidden group flex items-center space-x-3 p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md",
                  // Keep original styling regardless of missed status
                  isAlreadyAssigned &&
                    !isMarkedForRemoval &&
                    "bg-primary/10 border-primary/20 shadow-sm",
                  isMarkedForRemoval &&
                    "bg-destructive/10 border-destructive/20 shadow-sm",
                  isSelected &&
                    !isAlreadyAssigned &&
                    "bg-secondary/10 border-secondary/20 shadow-sm",
                  !isAlreadyAssigned &&
                    !isSelected &&
                    !isMarkedForRemoval &&
                    "bg-gradient-to-r from-card to-card/80 border-border hover:border-primary/30 hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/10",
                  // Add cursor pointer only when not disabled
                  !isFormDisabled && "cursor-pointer",
                  isFormDisabled && "cursor-not-allowed opacity-60"
                )}
                onClick={!isFormDisabled ? () => handleTogglePlayerMetric(playerId, metric.id) : undefined}
              >
                {/* Background hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>                <SimpleCheckbox
                  checked={isChecked}
                  onChange={!isFormDisabled ? () => handleTogglePlayerMetric(playerId, metric.id) : undefined}
                  disabled={isFormDisabled}
                  className="relative z-10"
                />
                <div className="flex-1 relative z-10">
                  {" "}
                  <span
                    className={cn(
                      "font-semibold text-sm block",
                      // Keep original text colors regardless of missed status
                      isAlreadyAssigned &&
                        !isMarkedForRemoval &&
                        "text-primary",
                      isMarkedForRemoval && "text-red-700 line-through",
                      isSelected && !isAlreadyAssigned && "text-secondary",
                      !isAlreadyAssigned &&
                        !isSelected &&
                        !isMarkedForRemoval &&
                        "text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-1">
                      {wasMissedInLastSession && (
                        <Clock className="h-3 w-3 text-amber-600" />
                      )}
                      {metric.name}
                    </div>
                  </span>
                  {metric.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {metric.description}
                    </p>
                  )}
                </div>{" "}
                <div className="relative z-10">
                  {isAlreadyAssigned &&
                    !isMarkedForRemoval &&
                    wasMissedInLastSession && (
                      <Badge
                        variant="outline"
                        className="text-primary bg-primary/10 border-primary/20"
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Assigned (Missed)
                      </Badge>
                    )}
                  {isAlreadyAssigned &&
                    !isMarkedForRemoval &&
                    !wasMissedInLastSession && (
                      <Badge
                        variant="outline"
                        className="text-primary bg-primary/10 border-primary/20"
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Assigned
                      </Badge>
                    )}
                  {isMarkedForRemoval && (
                    <Badge variant="destructive" className="text-xs">
                      Removing
                    </Badge>
                  )}
                  {wasMissedInLastSession &&
                    !isAlreadyAssigned &&
                    !isSelected && (
                      <Badge
                        variant="outline"
                        className="text-muted-foreground bg-muted border-border"
                      >
                        <Clock className="h-3 w-3 mr-1" />
                        Missed
                      </Badge>
                    )}
                  {wasMissedInLastSession &&
                    isSelected &&
                    !isAlreadyAssigned && (
                      <Badge
                        variant="outline"
                        className="text-secondary bg-secondary/10 border-secondary/20"
                      >
                        <Target className="h-3 w-3 mr-1" />
                        Selected (Missed)
                      </Badge>
                    )}
                  {!wasMissedInLastSession &&
                    isSelected &&
                    !isAlreadyAssigned && (
                      <Badge
                        variant="outline"
                        className="text-secondary bg-secondary/10 border-secondary/20"
                      >
                        <Target className="h-3 w-3 mr-1" />
                        Selected
                      </Badge>
                    )}
                </div>
              </div>
            );
          })}
        </div>
        {/* Bottom Navigation for Better UX */}
        <div className="flex items-center rounded-xl shadow-sm justify-between p-4 border-2 border-primary/20">          <Button
            variant="outline"
            size="default"
            onClick={handlePreviousPlayer}
            disabled={currentPlayerIndex === 0}
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous Player</span>
          </Button>
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-1">
              Player {currentPlayerIndex + 1} of {allPlayers.length}
            </div>
            {!canProceed ? (
              <Badge
                variant="outline"
                className="text-sm bg-destructive/20 border-destructive text-destructive"
              >
                Need at least one metric
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="text-sm bg-green-500/20 border-green-700 text-green-600"
              >
                Ready to proceed
              </Badge>
            )}
          </div>          <Button
            variant={canProceed ? "default" : "destructive"}
            size="default"
            onClick={handleNextPlayer}
            disabled={!canProceed}
          >
            <span>
              {currentPlayerIndex === allPlayers.length - 1
                ? "Complete"
                : "Next Player"}
            </span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlayerMetricsTab;
