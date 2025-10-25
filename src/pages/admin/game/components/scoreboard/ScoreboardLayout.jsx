import React from "react";
import { Card } from "@/components/ui/card";
import ScoreboardTeamSide from "./ScoreboardTeamSide";

const ScoreboardLayout = ({ 
  home_team, 
  away_team, 
  home_team_score, 
  away_team_score, 
  onScoreUpdate, 
  isUpdatingScore 
}) => {
  return (
    <Card className="h-[calc(100vh-4rem)] sm:h-[calc(100vh-6rem)] mx-2 sm:mx-4 p-0 grid grid-cols-2 gap-0 relative overflow-hidden">
      {/* Home Team Side */}
      <ScoreboardTeamSide
        team={home_team}
        score={home_team_score}
        onScoreUpdate={onScoreUpdate}
        isUpdatingScore={isUpdatingScore}
        isRightSide={false}
      />

      {/* Away Team Side */}
      <ScoreboardTeamSide
        team={away_team}
        score={away_team_score}
        onScoreUpdate={onScoreUpdate}
        isUpdatingScore={isUpdatingScore}
        isRightSide={true}
      />

      {/* Center Divider */}
      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 sm:w-1 bg-white/20 transform -translate-x-1/2 z-10"></div>
    </Card>
  );
};

export default ScoreboardLayout;