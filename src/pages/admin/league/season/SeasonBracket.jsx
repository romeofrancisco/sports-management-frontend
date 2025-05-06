import React from "react";
import { useParams } from "react-router";
import { useBracket } from "@/hooks/useBrackets";
import Loading from "@/components/common/FullLoading";
import PageError from "@/pages/PageError";
import SingleElimination from "@/components/common/bracket/SingleElimination";
import RoundRobin from "@/components/common/bracket/RoundRobin";
import { BRACKET_TYPES } from "@/constants/bracket";
import SeasonBracketHeader from "./components/SeasonBracketHeader";

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

  const { season_name, league_name } = bracket;

  return (
    <div className="p-4">
      <SeasonBracketHeader seasonName={season_name} leagueName={league_name} />
      <BracketComponent bracket={bracket} />
    </div>
  );
};

export default SeasonBracket;
