import React from "react";
import { Bracket, Seed, SeedItem, SeedTeam } from "react-brackets";
import { formatDate } from "@/utils/formatDate";
import { Calendar, Trophy } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";

const TeamSeed = ({ seed, breakpoint }) => {
  const { home_team, away_team, winner, date } = seed;

  const getResult = (teamId) => {
    if (!winner || !teamId) return "";
    return winner === teamId ? "WON" : "LOST";
  };

  const getResultStyle = (teamId) => {
    if (!winner || !teamId) return "";
    return winner === teamId ? "bg-secondary rounded" : "text-muted-foreground";
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
              <div className="size-7 flex-shrink-0 flex items-center justify-center rounded-l">
                <Avatar className="size-7 border border-primary/20">
                  <AvatarImage src={team.logo} alt={team.name} />
                  <AvatarFallback className="bg-muted text-muted-foreground">
                    {team.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <span className="truncate max-w-24">{team.name}</span>
            </>
          ) : (
            <span className="text-muted-foreground ml-2">TBD</span>
          )}
          <span
            className={`h-5 w-10 ml-auto text-[0.65rem] font-medium flex items-center justify-center ${getResultStyle(
              team?.id,
              result
            )}`}
          >
            {result}
          </span>
        </div>
      </SeedTeam>
    );
  };

  return (
    <Seed mobileBreakpoint={breakpoint} className="after:hidden before:hidden">
      <SeedItem className="bg-card overflow-hidden border-0 shadow-sm">
        {renderTeam(home_team)}
        <div className="border-t border-border/50"></div>
        {renderTeam(away_team)}
      </SeedItem>
      <div className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
        <Calendar size={12} className="text-muted-foreground" />
        {formatDate(date)}
      </div>
    </Seed>
  );
};

const RoundRobin = ({ bracket }) => {
  // Set mobile breakpoint value - default from react-brackets is 992
  const mobileBreakpoint = 640; // You can adjust this value based on your needs

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
    <Bracket
      bracketClassName="flex flex-wrap justify-center gap-y-6 gap-x-4"
      roundClassName="mb-6 min-w-[270px] flex flex-col items-center"
      rounds={rounds}
      mobileBreakpoint={mobileBreakpoint}
      renderSeedComponent={(seedProps) => (
        <TeamSeed {...seedProps} breakpoint={mobileBreakpoint} />
      )}
      roundTitleClassName="font-semibold text-xs mb-3 text-center"
      swipeableProps={{
        slideClassName: "flex items-center justify-center h-auto",
        containerStyle: {
          maxWidth: "100vw",
        },
      }}
    />
  );
};

export default RoundRobin;
