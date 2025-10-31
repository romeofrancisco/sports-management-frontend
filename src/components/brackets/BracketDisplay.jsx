import React from "react";
import SingleElimination from "@/components/brackets/SingleElimination";
import DoubleElimination from "./DoubleElimination";
import RoundRobin from "@/components/brackets/RoundRobin";
import { BRACKET_TYPES } from "@/constants/bracket";

/**
 * Component that displays the appropriate bracket visualization based on elimination type
 * @param {Object} bracket - The bracket data from the API
 */
const BracketDisplay = ({ bracket }) => {
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
  };

  return <BracketComponent bracket={bracketWithSport} />;
};

export default BracketDisplay;