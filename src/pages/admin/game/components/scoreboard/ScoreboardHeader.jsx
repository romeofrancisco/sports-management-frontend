import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AnimatedScore from "@/components/games/AnimatedScore";
import formatPeriod from "@/utils/formatPeriod";
import { getPeriodLabel } from "@/constants/sport";
import GameSettings from "../GameSettings";

const ScoreboardHeader = ({ sport }) => {
  const navigate = useNavigate();

  // Get game state from Redux
  const {
    score_summary: {
      total: { home: total_home, away: total_away },
    },
    current_period,
    home_team,
    away_team,
  } = useSelector((state) => state.game);
  const { max_period, scoring_type } = useSelector((state) => state.sport);

  return (
    <div className="grid grid-cols-3 p-2 sm:p-4 bg-background/80 backdrop-blur-sm z-20">
      <div className="flex gap-1 sm:gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 sm:h-10 sm:w-10"
          onClick={() => navigate(-1)}
          title="Go Back"
        >
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 sm:h-10 sm:w-10"
          onClick={() => navigate("/")}
          title="Home"
        >
          <Home className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </div>

      {/* Center Scoreboard */}
      <div className="flex justify-center items-center">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Home Team */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Avatar
              className="size-6 sm:size-8 border"
              style={{ borderColor: home_team?.color || "#8B1538" }}
            >
              <AvatarImage src={home_team?.logo} alt={home_team?.name} />
              <AvatarFallback className="text-xs">
                {home_team?.name?.[0]?.toUpperCase() || "H"}
              </AvatarFallback>
            </Avatar>
            <div
              className="rounded px-1.5 py-0.5 sm:px-2 sm:py-1 min-w-[35px] sm:min-w-[40px] text-center"
              style={{ backgroundColor: home_team?.color || "#8B1538" }}
            >
              <AnimatedScore
                value={total_home}
                className="text-white font-bold text-sm sm:text-base justify-center"
              />
            </div>
          </div>

          {/* Period Info */}
          <div className="text-center px-2 sm:px-3">
            <div className="text-xs text-muted-foreground">
              {getPeriodLabel(scoring_type)}
            </div>
            <div className="text-xs sm:text-sm font-semibold">
              {formatPeriod(current_period, max_period)}
            </div>
          </div>

          {/* Away Team */}
          <div className="flex items-center gap-1 sm:gap-2">
            <div
              className="rounded px-1.5 py-0.5 sm:px-2 sm:py-1 min-w-[35px] sm:min-w-[40px] text-center"
              style={{ backgroundColor: away_team?.color || "#8B1538" }}
            >
              <AnimatedScore
                value={total_away}
                className="text-white font-bold text-sm sm:text-base justify-center"
              />
            </div>
            <Avatar
              className="size-6 sm:size-8 border"
              style={{ borderColor: away_team?.color || "#8B1538" }}
            >
              <AvatarImage src={away_team?.logo} alt={away_team?.name} />
              <AvatarFallback className="text-xs">
                {away_team?.name?.[0]?.toUpperCase() || "A"}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <GameSettings />
      </div>
    </div>
  );
};

export default ScoreboardHeader;
