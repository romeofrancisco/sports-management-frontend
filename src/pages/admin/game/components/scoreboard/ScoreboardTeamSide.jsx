import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import AnimatedScore from "@/components/games/AnimatedScore";

const ScoreboardTeamSide = ({
  team,
  score,
  onScoreUpdate,
  isUpdatingScore,
  isRightSide = false,
}) => {
  return (
    <div
      className={`relative flex flex-col items-center justify-center p-2 sm:p-4 lg:p-8 ${
        isRightSide ? "rounded-r-xl" : "rounded-l-xl"
      }`}
      style={{
        backgroundColor: team?.color,
      }}
    >
      {/* Team Info */}
      <div className="flex flex-col items-center space-y-2 sm:space-y-3 lg:space-y-4 text-white">
        <Avatar className="size-12 sm:size-16 lg:size-24 border-2 sm:border-3 lg:border-4 border-white/20 shadow-lg">
          <AvatarImage src={team?.logo} alt={team?.name} />
          <AvatarFallback className="text-sm sm:text-lg lg:text-2xl font-bold text-gray-800">
            {team?.name?.[0]?.toUpperCase() || (isRightSide ? "A" : "H")}
          </AvatarFallback>
        </Avatar>

        <div className="text-center">
          <div className="text-xs sm:text-sm lg:text-xl font-bold mt-1">
            {team?.name?.toUpperCase() || (isRightSide ? "AWAY" : "HOME")}
          </div>
        </div>

        {/* Score Display with Controls */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 lg:gap-8">
          {/* Minus Button */}
          <Button
            variant="secondary"
            size="lg"
            onClick={() => onScoreUpdate(team, -1)}
            disabled={isUpdatingScore || score === 0}
            className="size-12 lg:size-20 bg-red-600 hover:bg-red-700 text-white border-2 border-white/30 shadow-lg"
          >
            <Minus className="size-6 sm:size-8 lg:size-10" />
          </Button>

          {/* Score Display */}
          <div className="border-2 rounded-lg sm:rounded-xl p-2 sm:p-3 lg:p-4 min-w-[80px] sm:min-w-[120px] lg:min-w-[160px] flex justify-center">
            <AnimatedScore
              value={score}
              className="text-white text-2xl sm:text-4xl lg:text-6xl drop-shadow-lg"
            />
          </div>

          {/* Plus Button */}
          <Button
            variant="default"
            size="lg"
            onClick={() => onScoreUpdate(team, 1)}
            disabled={isUpdatingScore}
            className="size-12 lg:size-20 bg-green-600 hover:bg-green-700 text-white border-2 border-white/30 shadow-lg"
          >
            <Plus className="size-6 sm:size-8 lg:size-10" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ScoreboardTeamSide;
