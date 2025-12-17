import React, { useEffect, useState } from "react";
import {
  DoubleEliminationBracket,
  Match,
  SVGViewer,
} from "@g-loot/react-tournament-brackets";
import { formatDate } from "@/utils/formatDate";
import { Calendar } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";

// small hook to get window size for SVG viewport
function useWindowSize() {
  const [size, setSize] = useState([window.innerWidth, window.innerHeight]);
  useEffect(() => {
    function onResize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return size;
}

// Custom match component styled like RoundRobin's TeamSeed
const CustomMatch = ({ match }) => {
  const participants = match?.participants || [];
  const home = participants[0] || null;
  const away = participants[1] || null;

  const getResult = (team) => {
    if (!match || !team) return "";
    if (match.state !== "DONE") return "";
    if (team.isWinner) return "WON";
    return "LOST";
  };

  const renderTeamRow = (team) => {
    const result = getResult(team);
    const opacity = !team
      ? "opacity-70 italic"
      : team.isWinner
      ? "opacity-100"
      : "opacity-70";

    return (
      <div
        className={`flex items-center text-xs p-0 gap-2 h-7 w-full ${opacity}`}
      >
        {team ? (
          <>
            <div className="size-7 flex-shrink-0 flex items-center justify-center rounded-l">
              <Avatar className="size-7 border border-primary/20">
                <AvatarImage src={team.logo} alt={team.name} />
                <AvatarFallback className="bg-muted text-muted-foreground">
                  {team.name?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <span className="truncate text-white">{team.name}</span>
          </>
        ) : (
          <span className="text-muted-foreground ml-2">TBD</span>
        )}

        <span
          className={`h-5 w-10 ml-auto text-[0.65rem] font-medium flex items-center justify-center ${
            result === "WON" ? "bg-secondary rounded" : "text-muted-foreground"
          }`}
        >
          {result}
        </span>
      </div>
    );
  };

  return (
    <div className="inline-block w-full mt-3">
      <div className="bg-gray-900 overflow-hidden border-0 shadow-sm p-2 rounded">
        <div>{renderTeamRow(home)}</div>
        <div className="border-t border-border/50 my-1"></div>
        <div>{renderTeamRow(away)}</div>
      </div>
      <div className="text-[10px] justify-center text-muted-foreground mt-1 flex items-center gap-1">
        <Calendar size={12} className="text-muted-foreground" />
        {match?.startTime ? formatDate(match.startTime) : "TBD"}
      </div>
    </div>
  );
};

export const DoubleElimination = ({ bracket }) => {
  const [width, height] = useWindowSize();
  const finalWidth = Math.max(width - 14);
  const finalHeight = Math.max(height - 100, 500);

  // Use matches from bracket prop, or empty structure if not available
  const matches = bracket?.matches || { upper: [], lower: [] };

  return (
    <DoubleEliminationBracket
      matches={matches}
      matchComponent={CustomMatch}
      svgWrapper={({ children, ...props }) => (
        <SVGViewer
          width={finalWidth}
          height={finalHeight}
          SVGBackground="var(--background)"
          {...props}
        >
          {children}
        </SVGViewer>
      )}
    />
  );
};

export default DoubleElimination;
