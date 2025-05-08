import React from "react";
import { useBracket } from "@/hooks/useBrackets";
import Loading from "@/components/common/FullLoading";
import { Card, CardContent } from "@/components/ui/card";
import { BRACKET_TYPES } from "@/constants/bracket";
import BracketDisplay from "@/components/brackets/BracketDisplay";

const BracketView = ({ season, leagueId }) => {
  const { data: bracket, isLoading } = useBracket(leagueId, season.id);

  if (isLoading) {
    return <Loading />;
  }

  if (!bracket) {
    return (
      <Card className="p-6">
        <CardContent>
          <p>No bracket data available for this season.</p>
        </CardContent>
      </Card>
    );
  }

  // Calculate stats
  const bracketTypeDisplay = bracket.elimination_type === BRACKET_TYPES.SINGLE 
    ? "Single Elimination Tournament" 
    : bracket.elimination_type === BRACKET_TYPES.ROUND_ROBIN
    ? "Round Robin Tournament"
    : "Tournament";

  const totalTeams = bracket.teams?.length || 0;
  const completedMatches = bracket.rounds?.reduce((count, round) => 
    count + round.matches.filter(match => match.winner !== null).length, 0) || 0;
  const totalMatches = bracket.rounds?.reduce((count, round) => 
    count + round.matches.length, 0) || 0;
  
  const completionPercentage = totalMatches > 0 
    ? Math.round((completedMatches / totalMatches) * 100) 
    : 0;

  return (
    <div className="space-y-6">
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
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <Card className="border shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="min-w-[800px] p-6">
              <BracketDisplay bracket={bracket} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BracketView;