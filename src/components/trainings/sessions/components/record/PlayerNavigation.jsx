import React from "react";
import { Button } from "../../../../ui/button";
import { Badge } from "../../../../ui/badge";
import { Progress } from "../../../../ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../ui/avatar";
import { ChevronLeft, ChevronRight, User } from "lucide-react";

const PlayerNavigation = ({
  currentPlayerIndex,
  playersWithMetrics,
  currentPlayer,
  metricsToShow,
  metricValues,
  hasChanges,
  progressPercentage,
  canProceed,
  session,
  handlePreviousPlayer,
  handleEnhancedNextPlayer,
  setShowCompletionModal,
}) => {
  return (
    <div className="animate-in fade-in-50 duration-500 delay-100">
      <div className="rounded-2xl border-2 border-primary/20 p-6 space-y-6">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Player {currentPlayerIndex + 1} of {playersWithMetrics.length}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Progress:</span>
              <span className="text-sm font-bold text-primary">
                {Math.round(progressPercentage)}%
              </span>
            </div>
          </div>
          <div className="relative mt-1">
            <Progress
              value={progressPercentage}
              className="h-2.5 bg-muted"
            />
          </div>
        </div>

        {/* Header with Current Player */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-white shadow-lg">
              <AvatarImage
                src={
                  currentPlayer?.player?.profile ||
                  currentPlayer?.player?.user?.profile
                }
                alt={`${currentPlayer?.player?.first_name} ${currentPlayer?.player?.last_name}`}
              />
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white font-bold">
                {currentPlayer?.player?.profile ? (
                  <User className="h-6 w-6" />
                ) : (
                  `${currentPlayer?.player?.first_name?.[0] || ""}${
                    currentPlayer?.player?.last_name?.[0] || ""
                  }`.toUpperCase()
                )}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {currentPlayer?.player?.first_name} {currentPlayer?.player?.last_name}
              </h3>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-gray-600">
                  {metricsToShow.length} metrics to record
                </span>
                {Object.keys(metricValues).length > 0 && (
                  <Badge
                    variant="outline"
                    className="text-xs bg-green-500/20 border-green-700 text-green-600"
                  >
                    {Object.keys(metricValues).length} recorded
                  </Badge>
                )}
                {hasChanges() && (
                  <Badge
                    variant="outline"
                    className="text-xs bg-blue-500/20 border-blue-700 text-blue-600"
                  >
                    Has changes
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
                {playersWithMetrics.length} Total
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">
                {
                  playersWithMetrics.filter(
                    (record) =>
                      record.metric_records &&
                      record.metric_records.length > 0
                  ).length
                }
                Done
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">
                {
                  playersWithMetrics.filter(
                    (record) =>
                      !record.metric_records ||
                      record.metric_records.length === 0
                  ).length
                }
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
            <div className="text-center">
              {session?.status === "completed" ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCompletionModal(true)}
                  className="text-sm bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                >
                  View Training Summary
                </Button>
              ) : !canProceed ? (
                <Badge
                  variant="outline"
                  className="text-sm bg-destructive/20 border-destructive text-destructive"
                >
                  Need to record metrics
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="text-sm bg-green-500/20 border-green-700 text-green-600"
                >
                  Ready to proceed
                </Badge>
              )}
            </div>
            <Button
              variant={canProceed ? "default" : "outline"}
              size="sm"
              onClick={handleEnhancedNextPlayer}
              disabled={!canProceed}
              className={`flex items-center py-1.5 transition-all duration-200 ${
                canProceed
                  ? "bg-primary hover:bg-primary/90"
                  : "border-red-300 text-red-600 hover:bg-red-50"
              }`}
            >
              <span className="text-xs">
                {currentPlayerIndex === playersWithMetrics.length - 1
                  ? session?.status === "completed"
                    ? "View Training Summary"
                    : "Complete"
                  : "Next"}
              </span>
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerNavigation;
