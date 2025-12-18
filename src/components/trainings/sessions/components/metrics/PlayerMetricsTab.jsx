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
import { useScrollToTopOnChange } from "@/components/common/ScrollToTopOnChange";

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
  const filteredMetrics = allMetrics.filter((metric) => metric.is_active) || []; // Navigation handlers
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
  };
  const handleNextPlayer = async () => {
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

  useScrollToTopOnChange(currentPlayerIndex, 500);

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
      <div className="flex flex-col gap-4 md:gap-6">
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
        <div className="flex flex-col md:flex-row gap-2 md:gap-4 justify-between">
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
            </div>{" "}
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">
                {
                  allPlayers.filter(
                    (record) =>
                      record.assigned_metrics &&
                      record.assigned_metrics.length > 0
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
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPlayer}
              disabled={currentPlayerIndex === 0}
              className="flex items-center gap-2 px-3 py-1.5 border-gray-300 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 disabled:opacity-50"
            >
              <ChevronLeft className="h-3 w-3" />
              <span className="text-xs">Previous</span>
            </Button>
            <div className="text-center text-xs md:text-sm">
              {!canProceed ? (
                <Badge
                  variant="outline"
                  className="bg-destructive/20 border-destructive text-destructive"
                >
                  Need at least one metric
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="bg-green-500/20 border-green-700 text-green-600"
                >
                  Ready to proceed
                </Badge>
              )}
            </div>{" "}
            <Button
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
              <ChevronRight />
            </Button>
          </div>
        </div>{" "}
      </div>{" "}
      {/* Missed Metrics from Last Session */}
      {currentPlayerMissedMetrics.length > 0 && (
        <div className="rounded-xl p-4 bg-amber-500/10 text-amber-700 border border-amber-200/30  shadow-sm">
          <div className="flex flex-col md:flex-row justify-between mb-3">
            <h4 className="text-sm font-semibold  flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-600" />
              Missed from Last Session
              <Badge
                variant="outline"
                className="text-xs ml-auto bg-amber-800/10 text-amber-800 border-amber-800/40"
              >
                {currentPlayerMissedMetrics.length} missed
              </Badge>
            </h4>
            <Button
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
              className={cn(
                "text-xs px-3 py-1.5 font-medium transition-all duration-200 mt-2 md:mt-0",
                "border-amber-400  text-amber-800 hover:bg-amber-100 hover:border-amber-500",
                "dark:border-amber-500/50 dark:text-amber-300 dark:hover:bg-amber-500/10 dark:hover:border-amber-400/60",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              <Target className="h-3 w-3 mr-1" />
              Assign All Missed
            </Button>
          </div>
          <p className="text-xs mb-3">
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
              ).includes(missedMetric.metric_id);
              const isClickable = !isAlreadyAssigned && !isFormDisabled;

              return (
                <button
                  key={missedMetric.metric_id}
                  disabled={!isClickable}
                  className={cn(
                    "inline-flex w-full md:w-auto items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 border-2 shadow-sm",
                    "hover:scale-[1.02] active:scale-[0.98]",
                    isAlreadyAssigned && [
                      "bg-primary/10",
                      "border-primary/40 text-primary",
                      "dark:from-primary/30 dark:to-primary/20",
                      "dark:border-primary/50",
                      "cursor-default shadow-primary/10"
                    ],
                    isSelected && !isAlreadyAssigned && [
                      "bg-secondary/10 dark:bg-secondary/5",
                      "border-secondary/20 text-amber-600",
                      "dark:from-secondary/30 dark:to-secondary/20",
                      "dark:border-amber-600/60",
                      "hover:border-secondary/60 hover:shadow-md"
                    ],
                    !isAlreadyAssigned && !isSelected && !isFormDisabled && [
                      "bg-amber-400/10",
                      "border-amber-400/20 text-amber-400",
                      "dark:from-amber-500/20 dark:to-amber-600/15",
                      "dark:border-amber-500/50 dark:text-amber-300",
                      "hover:from-amber-100 hover:to-amber-200",
                      "dark:hover:from-amber-500/30 dark:hover:to-amber-600/25",
                      "hover:border-amber-500 hover:shadow-md hover:shadow-amber-200/50",
                      "dark:hover:border-amber-400/60 dark:hover:shadow-amber-500/20",
                      "cursor-pointer"
                    ],
                    isFormDisabled && !isAlreadyAssigned && [
                      "bg-amber-50 border-amber-200 text-amber-600",
                      "dark:bg-amber-950/30 dark:border-amber-800/40 dark:text-amber-400",
                      "opacity-50 cursor-not-allowed"
                    ]
                  )}
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
                    <CheckCircle className="h-3.5 w-3.5 flex-shrink-0" />
                  ) : isSelected ? (
                    <Target className="h-3.5 w-3.5 flex-shrink-0" />
                  ) : (
                    <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                  )}
                  <span className="font-semibold truncate max-w-[200px] md:max-w-auto">{missedMetric.metric_name}</span>
                  {isAlreadyAssigned && (
                    <Badge variant="outline" className="ml-auto text-[10px] px-1.5 py-0 h-4 bg-primary/10 border-primary/30 text-primary dark:bg-primary/20 dark:border-primary/40">
                      ✓ Assigned
                    </Badge>
                  )}
                  {isSelected && !isAlreadyAssigned && (
                    <Badge variant="outline" className="ml-auto text-[10px] px-1.5 py-0 h-4 bg-secondary/10 border-secondary/30 text-amber-600 dark:bg-amber-900/10 dark:border-amber-900/40">
                      Selected
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
      {/* Enhanced Player's Assigned Metrics */}
      {playerMetrics.length > 0 && (
        <div className="rounded-xl p-4 border-2 border-primary/20 shadow-sm">
          <h4 className="text-sm font-semibold text-foreground mb-3 gap-1 flex items-center gap-1pl">
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
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {filteredMetrics.length} available
          </Badge>
          {currentPlayerMissedMetrics.length > 0 && (
            <Badge
              variant="outline"
              className="text-xs bg-amber-500/10 text-amber-500 border-amber-500/40"
            >
              <Clock className="h-3 w-3" />
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

            return (
              <div
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
                onClick={
                  !isFormDisabled
                    ? () => handleTogglePlayerMetric(playerId, metric.id)
                    : undefined
                }
              >
                {/* Background hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>{" "}
                <SimpleCheckbox
                  checked={isChecked}
                  onChange={
                    !isFormDisabled
                      ? () => handleTogglePlayerMetric(playerId, metric.id)
                      : undefined
                  }
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
        {/* Integrated Navigation Controls */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPlayer}
            disabled={currentPlayerIndex === 0}
            className="flex items-center gap-2 px-3 py-1.5 border-gray-300 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 disabled:opacity-50"
          >
            <ChevronLeft className="h-3 w-3" />
            <span className="text-xs">Previous</span>
          </Button>
          <div className="text-center text-xs md:text-sm">
            {!canProceed ? (
              <Badge
                variant="outline"
                className="bg-destructive/20 border-destructive text-destructive"
              >
                Need at least one metric
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="bg-green-500/20 border-green-700 text-green-600"
              >
                Ready to proceed
              </Badge>
            )}
          </div>{" "}
          <Button
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
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlayerMetricsTab;
