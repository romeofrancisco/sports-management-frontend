import React from "react";
import { Bracket, Seed, SeedItem, SeedTeam } from "react-brackets";
import { formatDate } from "@/utils/formatDate";

const TeamSeed = ({ seed, breakpoint }) => {
  const { home_team, away_team, winner, date } = seed;

  const getResult = (teamId) => {
    if (!winner || !teamId) return "";
    return winner === teamId ? "WON" : "LOST";
  };

  const getOpacity = (team) => {
    if (!team || (winner && team.id !== winner)) return "opacity-50";
    return "opacity-100";
  };

  const renderTeam = (team) => (
    <SeedTeam>
      <div
        className={`flex items-center dark:text-foreground text-xs px-1 gap-2 h-7 w-full ${getOpacity(
          team
        )}`}
      >
        {team ? (
          <>
            <img
              className="size-6 m-1 border-0"
              src={team.logo}
              alt={team.name}
            />
            {team.name}
          </>
        ) : (
          "TBD"
        )}
        <span className="bg-background/10 h-6 w-10 ml-auto text-[0.7rem] font-medium content-center">
          {getResult(team?.id)}
        </span>
      </div>
    </SeedTeam>
  );

  return (
    <Seed mobileBreakpoint={breakpoint} className="after:hidden before:hidden">
      <SeedItem>
        {renderTeam(home_team)}
        {renderTeam(away_team)}
      </SeedItem>
      <span className="text-xs text-muted-foreground">{formatDate(date)}</span>
    </Seed>
  );
};

const RoundRobin = ({ bracket }) => {
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

  return <Bracket bracketClassName="flex-wrap" roundClassName="mb-10" rounds={rounds} renderSeedComponent={TeamSeed} />;
};

export default RoundRobin;
