import React from "react";
import { CardHeader, CardTitle } from "../../../../ui/card";
import { Button } from "../../../../ui/button";
import { BadgeInfo, BarChart3 } from "lucide-react";

const PlayerMetricsHeader = ({ session, setShowCompletionModal }) => {
  return (
    <CardHeader className="border-b-2 border-primary/20 shadow-lg py-5">
      <CardTitle className="flex items-center gap-3">
        <div className="p-3 bg-primary rounded-lg">
          <BarChart3 className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight">
            Player Metrics Recording
          </h2>
          <p className="text-sm font-normal">
            Step 4 of training session setup
          </p>
        </div>
        {/* Training Summary Button for completed sessions */}
        {session?.status === "completed" && (
          <div className="ml-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCompletionModal(true)}
              className="flex items-center gap-2 bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
            >
              <BarChart3 className="h-4 w-4" />
              View Training Summary
            </Button>
          </div>
        )}
      </CardTitle>
      <div className="mt-4 p-4 rounded-lg border-2 bg-primary/10 border-primary/20">
        <p className="text-sm inline-flex text-primary items-center gap-1 leading-relaxed">
          <BadgeInfo className="size-4" /> Record performance metrics for each
          player. Navigate through players to enter their training data and
          track improvements in real-time.
        </p>
      </div>
    </CardHeader>
  );
};

export default PlayerMetricsHeader;
