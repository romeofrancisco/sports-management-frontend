import React from "react";
import { useParams } from "react-router";
import { useBracket } from "@/hooks/useBrackets";
import Loading from "@/components/common/FullLoading";
import PageError from "@/pages/PageError";
import SingleElimination from "@/components/brackets/SingleElimination";
import RoundRobin from "@/components/brackets/RoundRobin";
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
    [BRACKET_TYPES.ROUND_ROBIN]: RoundRobin,
  };

  const BracketComponent = bracketComponentMap[bracket.elimination_type];

  if (!BracketComponent) {
    return <PageError error="Bracket type not supported" status={400} />;
  }

  const { season_name, league_name, elimination_type, sport } = bracket;
  const bracketTypeDisplay = elimination_type === BRACKET_TYPES.SINGLE 
    ? "Single Elimination Tournament" 
    : "Round Robin Tournament";

  const totalTeams = bracket.teams?.length || 0;
  const completedMatches = bracket.rounds?.reduce((count, round) => 
    count + round.matches.filter(match => match.winner !== null).length, 0) || 0;
  const totalMatches = bracket.rounds?.reduce((count, round) => 
    count + round.matches.length, 0) || 0;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-4">
        <SeasonBracketHeader seasonName={season_name} leagueName={league_name} />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          <div className="bg-sidebar p-3 rounded-sm border border-sidebar-border">
            <h3 className="text-xs text-muted-foreground mb-1">Tournament Format</h3>
            <p className="text-sm font-medium text-sidebar-foreground">{bracketTypeDisplay}</p>
          </div>
          
          <div className="bg-sidebar p-3 rounded-sm border border-sidebar-border">
            <h3 className="text-xs text-muted-foreground mb-1">Participating Teams</h3>
            <p className="text-sm font-medium text-sidebar-foreground">{totalTeams} Teams</p>
          </div>
          
          <div className="bg-sidebar p-3 rounded-sm border border-sidebar-border">
            <h3 className="text-xs text-muted-foreground mb-1">Match Progress</h3>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-sidebar-foreground">{completedMatches}/{totalMatches}</p>
              <div className="w-full bg-sidebar-accent rounded-full h-1.5">
                <div 
                  className="bg-sidebar-primary h-1.5 rounded-full" 
                  style={{ width: `${(completedMatches/totalMatches) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="overflow-auto rounded-sm">
          <BracketComponent 
            bracket={{
              ...bracket,
              sport: sport || { 
                scoring_type: elimination_type === BRACKET_TYPES.ROUND_ROBIN ? "points" : "points",
                has_tie: false
              }
            }} 
          />
        </div>
      </div>
    </div>
  );
};

export default SeasonBracket;
