import React from "react";
import { Bracket, Seed, SeedItem, SeedTeam } from "react-brackets";
import { formatDate } from "@/utils/formatDate";
import { Calendar, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const TeamSeed = ({ seed, breakpoint }) => {
  const { home_team, away_team, winner, date } = seed;

  const getResult = (teamId) => {
    if (!winner || !teamId) return "";
    return winner === teamId ? "WON" : "LOST";
  };

  const getResultStyle = (teamId) => {
    if (!winner || !teamId) return "";
    return winner === teamId 
      ? "bg-secondary rounded" 
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

  // Determine if this is set-based scoring (volleyball, tennis) or points-based (basketball)
  const isSetBased = bracket.sport?.scoring_type === "sets";
  
  // No need to sort standings - they come pre-sorted from the backend
  const sortedStandings = bracket.standings || [];
  
  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <Bracket 
          bracketClassName="flex flex-wrap justify-center gap-y-6 gap-x-4" 
          roundClassName="mb-6" 
          rounds={rounds} 
          renderSeedComponent={TeamSeed} 
          roundTitleClassName="font-semibold text-xs mb-3 text-center"
        />
      </div>
      
      {bracket.standings && (
        <div className="mt-8 border rounded-sm overflow-hidden bg-background/90">
          <div className="bg-sidebar px-4 py-2 font-medium text-sm text-sidebar-foreground">
            Team Standings
            {isSetBased && (
              <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200 text-xs">
                Set-based Scoring
              </Badge>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 text-xs">
                  <th className="py-2 px-3 text-left">Rank</th>
                  <th className="py-2 px-3 text-left">Team</th>
                  <th className="py-2 px-3 text-center">MP</th>
                  <th className="py-2 px-3 text-center">W</th>
                  <th className="py-2 px-3 text-center">L</th>
                  {bracket.sport?.has_tie && (
                    <th className="py-2 px-3 text-center">T</th>
                  )}
                  {isSetBased ? (
                    <>
                      <th className="py-2 px-3 text-center">Sets W</th>
                      <th className="py-2 px-3 text-center">Sets L</th>
                      <th className="py-2 px-3 text-center">Set Ratio</th>
                    </>
                  ) : (
                    <>
                      <th className="py-2 px-3 text-center">Points</th>
                      <th className="py-2 px-3 text-center">Win%</th>
                    </>
                  )}
                  <th className="py-2 px-3 text-center">
                    <span className="text-amber-500">★</span> Points
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedStandings.map((team, index) => (
                  <tr key={team.id} className={index % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                    <td className="py-2 px-3">
                      <div className="flex items-center">
                        {index < 3 ? (
                          <Badge className={
                            index === 0 ? "bg-amber-500 text-white" : 
                            index === 1 ? "bg-gray-400 text-white" : 
                            "bg-amber-700 text-white"}>
                            {index + 1}
                          </Badge>
                        ) : (
                          <span className="font-medium text-muted-foreground">{index + 1}</span>
                        )}
                        {index === 0 && (
                          <Trophy size={12} className="text-amber-500 ml-1.5" />
                        )}
                      </div>
                    </td>
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2">
                        <div className="size-6 flex-shrink-0 flex items-center justify-center bg-sidebar rounded">
                          <img className="size-4 object-cover" src={team.logo} alt={team.name} />
                        </div>
                        <span className="font-medium">{team.name}</span>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-center font-medium">{team.matches_played || 0}</td>
                    <td className="py-2 px-3 text-center font-medium text-emerald-600">{team.wins || 0}</td>
                    <td className="py-2 px-3 text-center font-medium text-rose-600">{team.losses || 0}</td>
                    {bracket.sport?.has_tie && (
                      <td className="py-2 px-3 text-center font-medium text-amber-600">{team.ties || 0}</td>
                    )}
                    {isSetBased ? (
                      <>
                        <td className="py-2 px-3 text-center font-medium">{team.sets_won || 0}</td>
                        <td className="py-2 px-3 text-center font-medium">{team.sets_lost || 0}</td>
                        <td className="py-2 px-3 text-center font-medium">
                          {team.set_ratio ? team.set_ratio.toFixed(3) : "0.000"}
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-2 px-3 text-center font-medium">
                          {team.scored || 0}
                        </td>
                        <td className="py-2 px-3 text-center font-medium">
                          {team.win_percentage ? `${(team.win_percentage * 100).toFixed(1)}%` : "0.0%"}
                        </td>
                      </>
                    )}
                    <td className="py-2 px-3 text-center font-bold">{team.points || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-2 text-xs text-muted-foreground">
            {isSetBased 
              ? "Teams are ranked based on match points first, followed by set ratio and sets won."
              : "Teams are ranked based on points, followed by win percentage."
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default RoundRobin;
