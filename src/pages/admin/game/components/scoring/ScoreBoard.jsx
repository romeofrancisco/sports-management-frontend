import React from "react";
import { useSelector } from "react-redux";
import formatPeriod from "@/utils/formatPeriod"
import { getPeriodLabel } from "@/constants/sport";

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
    <div className="grid grid-cols-[1fr_auto_1fr] place-items-center mb-2 md:mb-5">
      {/* Home Team */}
      <div className="flex items-center gap-5">
        <img
          className="hidden md:block size-8 lg:size-14"
          src={home_team?.logo}
          alt={home_team?.name}
        />
        <span className="font-medium md:text-xl  lg:text-4xl">
          {home_team?.name?.toUpperCase()}
        </span>
      </div>

      {/* Score and Period Display */}
      <div className="flex justify-center items-center gap-3 md:gap-8 lg:gap-20">
        {/* Home Team Score */}
        <div>
          <div className="md:text-2xl lg:text-4xl border-2 text-center content-center w-14 h-8 md:h-10 md:w-20 lg:h-16  lg:w-30">
            {home_team_score}
          </div>
        </div>

        {/* Period Info */}
        <div>
          <div className="flex flex-col h-full justify-center text-center">
            <p className="text-sm md:text-lg lg:text-xl">{getPeriodLabel(scoring_type)}</p>
            <span className="md:text-xl">{formatPeriod(current_period, max_period)}</span>
          </div>
        </div>

        {/* Away Team Score */}
        <div>
          <div className="md:text-2xl lg:text-4xl border-2 text-center content-center w-14 h-8 md:h-10 md:w-20 lg:h-16 lg:w-30">
            {away_team_score}
          </div>
        </div>
      </div>

      {/* Away Team */}
      <div className="flex items-center gap-5">
        <span className="font-medium md:text-xl lg:text-4xl">
          {away_team?.name?.toUpperCase()}
        </span>
        <img
          className="hidden md:block size-8 lg:size-14"
          src={away_team?.logo}
          alt={away_team?.name}
        />
      </div>
    </div>
  );
};

export default ScoreBoard;
