import React from "react";
import { useParams } from "react-router";
import { useBracket } from "@/hooks/useBrackets";
import Loading from "@/components/common/Loading";
import PageError from "../PageError";
import SingleElimination from "./components/bracket/SingleElimination";
import RoundRobin from "./components/bracket/RoundRobin";
import { BRACKET_TYPES } from "@/constants/bracket";

const SeasonBracket = () => {
  const { season } = useParams();
  const { data: bracket, isLoading, isError, error } = useBracket(season);

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <PageError
        error={error.response?.data?.detail || "Unknown Error"}
        status={error.response?.status || 500}
      />
    );

  // Map bracket types to corresponding components
  const bracketComponentMap = {
    [BRACKET_TYPES.SINGLE]: SingleElimination,
    // [ELIMINATION_TYPES.DOUBLE]: DoubleElimination,
    [BRACKET_TYPES.ROUND_ROBIN]: RoundRobin,
  };

  const BracketComponent = bracketComponentMap[bracket.elimination_type];

  if (!BracketComponent) {
    return <PageError error="Bracket type not supported" status={400} />;
  }

  return (
    <div className="p-4">
      <BracketComponent bracket={bracket} />
    </div>
  );
};

export default SeasonBracket;
