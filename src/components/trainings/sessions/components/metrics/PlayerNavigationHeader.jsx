import React from "react";
import { Button } from "../../../../ui/button";
import { Badge } from "../../../../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../ui/avatar";
import { cn } from "@/lib/utils";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Trophy,
  AlertCircle,
  User,
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
              : "hover:bg-secondary/10 hover:border-primary/30 hover:scale-105"
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
                : !hasIncompleteChanges &&
                    "hover:bg-secondary/10 hover:border-primary/30 hover:shadow-lg hover:scale-105"
            )}
          >
            <span className="font-medium">Next Player</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {/* Player Info Card */}
      <div className="bg-card rounded-xl p-6 border-2 border-primary/20 ">
        <div className="flex items-center justify-between">
          {/* Player Avatar & Info */}
          <div className="flex items-center gap-4">
            <div className="relative">              <Avatar
                className={cn(
                  "h-12 w-12 border-4 transition-all duration-300",
                  hasValidMetrics()
                    ? "border-primary/30 shadow-lg shadow-primary/25"
                    : "border-primary/20 shadow-md"
                )}
              >
                <AvatarImage
                  src={currentPlayer?.player?.profile}
                  alt={`${currentPlayer?.player?.first_name} ${currentPlayer?.player?.last_name}`}
                />
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-bold">
                  {currentPlayer?.player?.profile ? (
                    <User className="h-6 w-6" />
                  ) : (
                    `${currentPlayer?.player?.first_name?.[0] || ""}${
                      currentPlayer?.player?.last_name?.[0] || ""
                    }`.toUpperCase()
                  )}
                </AvatarFallback>
              </Avatar>
              {hasValidMetrics() && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <Check className="h-3 w-3 text-white" />
                </div>
              )}
            </div>
            <div className="space-y-1">              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-foreground">
                  {currentPlayer?.player?.first_name} {currentPlayer?.player?.last_name}
                </h3>
                {hasValidMetrics() && (
                  <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/15">
                    <Trophy className="h-3 w-3 mr-1" />
                    Completed
                  </Badge>
                )}
                {hasIncompleteChanges && (
                  <Badge
                    variant="outline"
                    className="border-amber-400 text-amber-700 bg-amber-50"
                  >
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Incomplete
                  </Badge>
                )}
              </div>              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="font-medium">{metricsToShow.length}</span>
                  metrics to record
                </span>
              </div>
            </div>
          </div>
          {/* Quick Stats */}
          <div className="text-right space-y-1">
            <div className="text-2xl font-bold text-foreground">
              {currentPlayerIndex + 1}/{playersWithMetrics.length}
            </div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
              Current Player
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerNavigationHeader;
