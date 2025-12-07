import React from "react";
import { CardHeader, CardTitle } from "../../../../ui/card";
import { Button } from "../../../../ui/button";
import { BadgeInfo, BarChart3, CheckCircle } from "lucide-react";

const PlayerMetricsHeader = ({
  onFinishTraining,
  session,
  playersWithMetrics = [],
  isFormDisabled = false,
  allPlayersComplete = false,
  hasEmptyCurrentPlayer = false,
}) => {
  // Show finish button only if session is ongoing, all players have completed metrics, and current player is not empty
  const showFinishButton =
    session?.status === "ongoing" && allPlayersComplete && !isFormDisabled && !hasEmptyCurrentPlayer;

  return (
    <CardHeader className="border-b-2 border-primary/20 shadow-lg p-4 md:py-5 md:px-6">
      <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-2 sm:p-3 bg-primary rounded-lg">
            <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight">
              Player Metrics Recording
            </h2>
            <p className="text-xs sm:text-sm font-normal">
              Step 4 of training session setup
            </p>
          </div>
        </div>

        {showFinishButton && (
          <Button onClick={onFinishTraining} size="sm" className="w-full sm:w-auto">
            <CheckCircle className="h-4 w-4" />
            Finish Training
          </Button>
        )}
      </CardTitle>
      <div className="mt-3 sm:mt-4 p-3 sm:p-4 rounded-lg border-2 bg-primary/10 border-primary/20">
        <p className="text-xs sm:text-sm inline-flex text-primary items-start sm:items-center gap-1 leading-relaxed">
          <BadgeInfo className="size-4 flex-shrink-0 mt-0.5 sm:mt-0" /> 
          <span>Record performance metrics for each player. Navigate through players to enter their training data and track improvements in real-time.</span>
        </p>
      </div>
    </CardHeader>
  );
};

export default PlayerMetricsHeader;
