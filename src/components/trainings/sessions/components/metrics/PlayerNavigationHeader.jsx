import React from "react";
import { Button } from "../../../../ui/button";
import { Badge } from "../../../../ui/badge";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Check,
  ChevronLeft,
  ChevronRight,
  User,
  Trophy,
  AlertCircle,
} from "lucide-react";

const PlayerNavigationHeader = ({
  currentPlayerIndex,
  playersWithMetrics,
  currentPlayer,
  hasValidMetrics,
  hasChanges,
  metricsToShow,
  onPreviousPlayer,
  onNextPlayer,
}) => {
  const isFirstPlayer = currentPlayerIndex === 0;
  const isLastPlayer = currentPlayerIndex === playersWithMetrics.length - 1;
  const hasIncompleteChanges = hasChanges() && !hasValidMetrics();

  return (
    <div className="space-y-4">
      {/* Navigation Controls */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="default"
          onClick={onPreviousPlayer}
          disabled={isFirstPlayer}
          className={cn(
            "flex items-center gap-3 px-6 transition-all duration-200",
            isFirstPlayer 
              ? "opacity-50 cursor-not-allowed" 
              : "hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm"
          )}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="font-medium">Previous Player</span>
        </Button>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="default"
            onClick={onNextPlayer}
            disabled={isLastPlayer}
            className={cn(
              "flex items-center gap-3 px-6 transition-all duration-200",
              hasIncompleteChanges &&
                "border-amber-400 text-amber-700 bg-amber-50 hover:bg-amber-100",
              isLastPlayer 
                ? "opacity-50 cursor-not-allowed" 
                : !hasIncompleteChanges && "hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm"
            )}
          >
            <span className="font-medium">Next Player</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Player Info Card */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          {/* Player Avatar & Info */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div
                className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg transition-all duration-300",
                  hasValidMetrics()
                    ? "bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/25"
                    : "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25"
                )}
              >
                {hasValidMetrics() ? (
                  <CheckCircle2 className="h-7 w-7" />
                ) : currentPlayer?.jersey_number ? (
                  `#${currentPlayer.jersey_number}`
                ) : (
                  <User className="h-7 w-7" />
                )}
              </div>
              {hasValidMetrics() && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="h-3 w-3 text-white" />
                </div>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-gray-900">{currentPlayer?.player_name}</h3>
                {hasValidMetrics() && (
                  <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">
                    <Trophy className="h-3 w-3 mr-1" />
                    Completed
                  </Badge>
                )}
                {hasIncompleteChanges && (
                  <Badge variant="outline" className="border-amber-400 text-amber-700 bg-amber-50">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Incomplete
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <span className="font-medium">{metricsToShow.length}</span> 
                  metrics to record
                </span>
                {currentPlayer?.position && (
                  <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium">
                    {currentPlayer.position}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="text-right space-y-1">
            <div className="text-2xl font-bold text-gray-900">
              {currentPlayerIndex + 1}/{playersWithMetrics.length}
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">
              Current Player
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerNavigationHeader;
