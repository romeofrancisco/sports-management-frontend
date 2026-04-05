import React, { useMemo } from "react";
import SingleElimination from "@/components/brackets/SingleElimination";
import DoubleElimination from "./DoubleElimination";
import RoundRobin from "@/components/brackets/RoundRobin";
import { BRACKET_TYPES } from "@/constants/bracket";
import { Expand } from "lucide-react";
import { Button } from "../ui/button";

/**
 * Component that displays the appropriate bracket visualization based on elimination type
 * @param {Object} bracket - The bracket data from the API
 */
const BracketDisplay = ({ bracket, navigationContext }) => {
  const gameIdByBracketMatchId = useMemo(() => {
    if (!bracket?.rounds?.length) return {};

    return bracket.rounds.reduce((acc, round) => {
      (round.matches || []).forEach((match) => {
        if (match?.id && match?.game) {
          acc[match.id] = match.game;
        }
      });
      return acc;
    }, {});
  }, [bracket]);

  if (!bracket) return null;

  // Map bracket types to their corresponding display components
  const bracketComponentMap = {
    [BRACKET_TYPES.SINGLE]: SingleElimination,
    [BRACKET_TYPES.DOUBLE]: DoubleElimination,
    [BRACKET_TYPES.ROUND_ROBIN]: RoundRobin,
  };

  const BracketComponent = bracketComponentMap[bracket.elimination_type];

  if (!BracketComponent) {
    return <div className="p-4 text-center">Unsupported bracket type</div>;
  }

  // Pass any sport info needed by the bracket components
  const bracketWithSport = {
    ...bracket,
    sport: bracket.sport || {
      scoring_type: "points",
      has_tie: false,
    },
    navigationContext,
    gameIdByBracketMatchId,
  };

  return <BracketComponent bracket={bracketWithSport} />;
};

export default BracketDisplay;
