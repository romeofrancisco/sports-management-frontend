import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import formatPeriod from "@/utils/formatPeriod";
import { getPeriodLabel } from "@/constants/sport";
import AnimatedScore from "@/components/games/AnimatedScore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ScoreBoard = () => {
  // Destructure state values from Redux store
  const {
    home_team_score,
    away_team_score,
    current_period,
    home_team,
    away_team,
  } = useSelector((state) => state.game);
  const { max_period, scoring_type } = useSelector((state) => state.sport);

  return (
    <div className="w-full">
      {/* Compact Scoreboard */}
      <div className="border-2 border-primary/20 shadow-sm">

        {/* Main Score Section */}
        <div className="md:p-4">
          <div className="grid grid-cols-[1fr_auto_1fr] md:gap-4 items-center">
            {/* Home Team */}
            <div className="flex items-center justify-end gap-3">
              <div className="hidden md:block text-right">
                <div 
                  className="font-bold text-sm md:text-base truncate"
                  style={{ color: home_team?.color || '#8B1538' }}
                >
                  {home_team?.name?.toUpperCase()}
                </div>
                <div className="text-xs text-muted-foreground">HOME</div>
              </div>
              <Avatar className="size-8 md:size-12 border-2 shadow-sm" style={{ borderColor: home_team?.color || '#8B1538' }}>
                <AvatarImage src={home_team?.logo} alt={home_team?.name} />
                <AvatarFallback>{home_team?.name?.[0]?.toUpperCase() || "H"}</AvatarFallback>
              </Avatar>
            </div>

            {/* Score Display */}
            <div className="flex items-center gap-2 md:gap-3 px-4 py-2">
              {/* Home Score */}
              <div 
                className="rounded px-2 py-1 min-w-[55px] text-center"
                style={{ backgroundColor: home_team?.color || '#8B1538' }}
              >
                <AnimatedScore 
                  value={home_team_score} 
                  className="text-white font-bold md:text-xl justify-center" 
                />
              </div>

              {/* Period & VS */}
              <div className="text-center">
                <div className="text-xs">
                  {getPeriodLabel(scoring_type)}
                </div>
                <div className="text-xs md:text-sm font-semibold">
                  {formatPeriod(current_period, max_period)}
                </div>
              </div>

              {/* Away Score */}
              <div 
                className="rounded px-2 py-1 min-w-[55px] text-center"
                style={{ backgroundColor: away_team?.color || '#8B1538' }}
              >
                <AnimatedScore 
                  value={away_team_score} 
                  className="text-white font-bold md:text-xl justify-center" 
                />
              </div>
            </div>

            {/* Away Team */}
            <div className="flex items-center justify-start gap-3">
              <Avatar className="size-8 md:size-12 border-2 shadow-sm" style={{ borderColor: away_team?.color || '#8B1538' }}>
                <AvatarImage src={away_team?.logo} alt={away_team?.name} />
                <AvatarFallback>{away_team?.name?.[0]?.toUpperCase() || "A"}</AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <div 
                  className="font-bold text-sm md:text-base truncate"
                  style={{ color: away_team?.color || '#8B1538' }}
                >
                  {away_team?.name?.toUpperCase()}
                </div>
                <div className="text-xs text-muted-foreground">AWAY</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreBoard;
