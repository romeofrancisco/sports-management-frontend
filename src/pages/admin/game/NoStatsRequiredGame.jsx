import React from "react";
import ScoreboardHeader from "./components/scoreboard/ScoreboardHeader";
import ScoreboardLayout from "./components/scoreboard/ScoreboardLayout";
import { useScoreboard } from "./hooks/useScoreboard";

const NoStatsRequiredGame = ({ sport, game }) => {
  const {
    isUpdatingScore,
    home_team_score,
    away_team_score,
    home_team,
    away_team,
    handleScoreUpdate,
  } = useScoreboard(game);


  return (
    <div className="h-screen overflow-hidden">
      <ScoreboardHeader sport={sport} />
      <ScoreboardLayout
        home_team={home_team}
        away_team={away_team}
        home_team_score={home_team_score}
        away_team_score={away_team_score}
        onScoreUpdate={handleScoreUpdate}
        isUpdatingScore={isUpdatingScore}
      />
    </div>
  );
};

export default NoStatsRequiredGame;
