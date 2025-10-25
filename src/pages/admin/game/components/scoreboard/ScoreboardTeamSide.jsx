import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AnimatedScore from "@/components/games/AnimatedScore";
import ScoreControlButtons from "./ScoreControlButtons";

const ScoreboardTeamSide = ({ 
  team, 
  score, 
  onScoreUpdate, 
  isUpdatingScore, 
  isRightSide = false 
}) => {
  return (
    <div 
      className={`relative flex flex-col items-center justify-center p-2 sm:p-4 lg:p-8 ${
        isRightSide ? 'rounded-r-xl' : 'rounded-l-xl'
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

        {/* Score Display */}
        <div className="border-2 rounded-lg sm:rounded-xl p-2 sm:p-3 lg:p-4">
          <AnimatedScore 
            value={score} 
            className="text-white text-2xl sm:text-4xl lg:text-6xl drop-shadow-lg"
          />
        </div>

        {/* Score Control Buttons */}
        <ScoreControlButtons
          onScoreUpdate={onScoreUpdate}
          team={team}
          isUpdatingScore={isUpdatingScore}
          currentScore={score}
        />
      </div>
    </div>
  );
};

export default ScoreboardTeamSide;