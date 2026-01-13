import React, { useEffect, useState, useRef } from "react";
import {
  SingleEliminationBracket,
  SVGViewer,
} from "@g-loot/react-tournament-brackets";
import { formatDate } from "@/utils/formatDate";
import { Calendar } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";

// Hook to get container width
function useContainerWidth() {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(800); // Default width

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        setWidth(containerWidth);
      }
    };

    // Initial measurement
    updateWidth();

    // Update on resize
    window.addEventListener("resize", updateWidth);

    // Also update when content might change (optional)
    const resizeObserver = new ResizeObserver(updateWidth);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener("resize", updateWidth);
      resizeObserver.disconnect();
    };
  }, []);

  return { containerRef, width };
}

// Reuse the same visual style as DoubleElimination's CustomMatch
const CustomMatch = ({ match }) => {
  const participants = match?.participants || [];
  const home = participants[0] || null;
  const away = participants[1] || null;

  console.log("Match Data:", match);

  const getResult = (team) => {
    if (match.state === "SCHEDULED") return "";
    if (team?.isWinner) return "WON";
    return "LOST";
  };

  const renderTeamRow = (team) => {
    const result = getResult(team);
    const opacity = !team
      ? "opacity-70 italic"
      : team?.isWinner
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

const SingleElimination = ({ bracket }) => {
  const { containerRef, width } = useContainerWidth();
  // Use container width directly with a reasonable minimum
  const finalWidth = Math.max(width, 400);
  // Make height responsive based on expected bracket size, but cap it
  const finalHeight = Math.min(Math.max(width * 0.6, 400), 800);

  // Use matches from bracket prop, or empty array if not available
  const matches = bracket?.matches || [];

  return (
    <div ref={containerRef} className="w-full overflow-x-auto overflow-y-hidden">
      <div className="min-w-full">
        <SingleEliminationBracket
          matches={matches}
          matchComponent={CustomMatch}
          svgWrapper={({ children, ...props }) => (
            <SVGViewer
              width={finalWidth}
              height={finalHeight}
              SVGBackground="var(--background)"
              style={{ maxWidth: '100%', height: 'auto' }}
              {...props}
            >
              {children}
            </SVGViewer>
          )}
        />
      </div>
    </div>
  );
};

export default SingleElimination;
