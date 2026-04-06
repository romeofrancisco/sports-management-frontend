import React from "react";
import { useNavigate } from "react-router";
import { Bracket, Seed, SeedItem, SeedTeam } from "react-brackets";
import { formatDate } from "@/utils/formatDate";
import { Calendar } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";

const TeamSeed = ({ seed, breakpoint, onSeedClick }) => {
  const dragStateRef = React.useRef({
    isPointerDown: false,
    startX: 0,
    startY: 0,
    hasDragged: false,
  });
  const DRAG_THRESHOLD_PX = 8;

  const { home_team, away_team, winner, date } = seed;
  const isClickable = Boolean(seed?.gameId && onSeedClick);

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

  const activateSeed = (event) => {
    if (!isClickable) return;

    const dragState = dragStateRef.current;
    const wasDrag = dragState.hasDragged;
    dragState.isPointerDown = false;

    if (wasDrag) return;

    event.stopPropagation();
    onSeedClick(seed);
  };

  return (
    <Seed mobileBreakpoint={breakpoint} className="after:hidden before:hidden">
      <SeedItem
        className={`bg-card overflow-hidden border-0 shadow-sm ${
          isClickable ? "cursor-pointer" : "cursor-default"
        }`}
        role={isClickable ? "button" : undefined}
        tabIndex={isClickable ? 0 : undefined}
        style={{ touchAction: "manipulation" }}
        onPointerDown={(event) => {
          if (!isClickable) return;
          dragStateRef.current = {
            isPointerDown: true,
            startX: event.clientX,
            startY: event.clientY,
            hasDragged: false,
          };
        }}
        onPointerMove={(event) => {
          if (!isClickable || !dragStateRef.current.isPointerDown) return;

          const deltaX = Math.abs(event.clientX - dragStateRef.current.startX);
          const deltaY = Math.abs(event.clientY - dragStateRef.current.startY);

          if (deltaX > DRAG_THRESHOLD_PX || deltaY > DRAG_THRESHOLD_PX) {
            dragStateRef.current.hasDragged = true;
          }
        }}
        onPointerCancel={() => {
          dragStateRef.current.isPointerDown = false;
        }}
        onPointerUp={activateSeed}
        onKeyDown={(event) => {
          if (!isClickable) return;
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            event.stopPropagation();
            onSeedClick(seed);
          }
        }}
      >
        {renderTeam(home_team)}
        <div className="border-t border-border/50"></div>
        {renderTeam(away_team)}
      </SeedItem>
      <div className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
        <Calendar size={12} className="text-muted-foreground" />
        {date ? formatDate(date) : 'TBD'}
      </div>
    </Seed>
  );
};

const RoundRobin = ({ bracket }) => {
  const navigate = useNavigate();
  // Set mobile breakpoint value - default from react-brackets is 992
  const mobileBreakpoint = 640; // You can adjust this value based on your needs

  const handleSeedClick = (seed) => {
    const gameId = seed?.gameId;

    if (!gameId || !bracket?.navigationContext?.type) return;

    if (
      bracket.navigationContext.type === "tournament" &&
      bracket.navigationContext.tournamentId
    ) {
      navigate(
        `/tournaments/${bracket.navigationContext.tournamentId}/games?gameId=${gameId}`
      );
      return;
    }

    if (
      bracket.navigationContext.type === "league" &&
      bracket.navigationContext.leagueId &&
      bracket.navigationContext.seasonId
    ) {
      navigate(
        `/leagues/${bracket.navigationContext.leagueId}/seasons/${bracket.navigationContext.seasonId}/games?gameId=${gameId}`
      );
    }
  };

  const rounds = bracket.rounds.map((round) => ({
    title: `Round ${round.round_number}`,
    seeds: round.matches.map((match) => ({
      id: match.id,
      gameId: match.game,
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
        <TeamSeed
          {...seedProps}
          breakpoint={mobileBreakpoint}
          onSeedClick={handleSeedClick}
        />
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
