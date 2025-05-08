import React from "react";
import { Bracket, Seed, SeedItem, SeedTeam } from "react-brackets";
import { formatDate } from "@/utils/formatDate";

const TeamSeed = ({ seed, breakpoint }) => {
  const { home_team, away_team, winner, date } = seed;

  const getResult = (teamId) => {
    if (!winner || !teamId) return "";
    return winner === teamId ? "WON" : "LOST";
  };

  const getResultStyle = (teamId) => {
    if (!winner || !teamId) return "";
    return winner === teamId 
      ? "bg-sidebar-primary text-sidebar-primary-foreground" 
      : "text-muted-foreground";
  };

  const getOpacity = (team) => {
    if (!team) return "opacity-70 italic";
    if (winner && team.id !== winner) return "opacity-70";
    return "opacity-100";
  };

  const renderTeam = (team) => {
    const result = getResult(team?.id);
    
    return (
      <SeedTeam>
        <div
          className={`flex items-center dark:text-foreground text-xs p-0 gap-2 h-7 w-full 
            ${getOpacity(team)}`}
        >
          {team ? (
            <>
              <div className="size-7 flex-shrink-0 flex items-center justify-center bg-sidebar rounded-l">
                <img
                  className="size-5 object-cover"
                  src={team.logo}
                  alt={team.name}
                />
              </div>
              <span className="truncate max-w-24">{team.name}</span>
            </>
          ) : (
            <span className="text-muted-foreground ml-2">TBD</span>
          )}
          <span className={`h-5 w-10 ml-auto text-[0.65rem] font-medium flex items-center justify-center ${getResultStyle(team?.id, result)}`}>
            {result}
          </span>
        </div>
      </SeedTeam>
    );
  };

  return (
    <Seed mobileBreakpoint={breakpoint}>
      <SeedItem className="bg-card overflow-hidden border-0 shadow-sm">
        {renderTeam(home_team)}
        <div className="border-t border-border/50"></div>
        {renderTeam(away_team)}
      </SeedItem>
      <div className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-days">
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
          <line x1="16" x2="16" y1="2" y2="6"></line>
          <line x1="8" x2="8" y1="2" y2="6"></line>
          <line x1="3" x2="21" y1="10" y2="10"></line>
        </svg>
        {formatDate(date)}
      </div>
    </Seed>
  );
};

const SingleElimination = ({ bracket }) => {
  const rounds = bracket.rounds.map((round) => ({
    title: `Round ${round.round_number}`,
    seeds: round.matches.map((match) => ({
      id: match.id,
      winner: match.winner,
      date: match.date,
      home_team: match.home_team_details
        ? {
            id: match.home_team_details.id,
            name: match.home_team_details.name,
            logo: match.home_team_details.logo,
          }
        : null,
      away_team: match.away_team_details
        ? {
            id: match.away_team_details.id,
            name: match.away_team_details.name,
            logo: match.away_team_details.logo,
          }
        : null,
    })),
  }));

  return (
    <div className="overflow-x-auto pb-6">
      <Bracket 
        rounds={rounds} 
        renderSeedComponent={TeamSeed}
        roundClassName="min-w-[180px] mx-2"
        roundTitleClassName="font-semibold text-xs mb-4 text-center"
        swipeableProps={{ enableMouseEvents: true }}
      />
    </div>
  );
};

export default SingleElimination;
