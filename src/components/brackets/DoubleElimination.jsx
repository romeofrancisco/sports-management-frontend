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

// Sample data (upper + lower) shaped for DoubleEliminationBracket
const matches = {
  upper: [
    {
      id: 1,
      name: "UB R1 M1",
      nextMatchId: 5,
      nextLooserMatchId: 8,
      startTime: "2021-05-30T12:00:00Z",
      state: "DONE",
      participants: [
        {
          id: "team-1",
          resultText: "WON",
          isWinner: true,
          status: "PLAYED",
          name: "GlootOne",
        },
        {
          id: "team-2",
          resultText: "LOST",
          isWinner: false,
          status: "PLAYED",
          name: "spacefudg3",
        },
      ],
    },
    {
      id: 2,
      name: "UB R1 M2",
      nextMatchId: 5,
      nextLooserMatchId: 9,
      startTime: "2021-05-30T12:00:00Z",
      state: "DONE",
      participants: [
        {
          id: "team-3",
          resultText: "WON",
          isWinner: true,
          status: "PLAYED",
          name: "Towby",
        },
        {
          id: "team-4",
          resultText: "LOST",
          isWinner: false,
          status: "PLAYED",
          name: "Alex",
        },
      ],
    },
    {
      id: 3,
      name: "UB R1 M3",
      nextMatchId: 6,
      nextLooserMatchId: 8,
      startTime: "2021-05-30T12:00:00Z",
      state: "DONE",
      participants: [
        {
          id: "team-5",
          resultText: "WON",
          isWinner: true,
          status: "PLAYED",
          name: "SeatloN",
        },
        {
          id: "team-6",
          resultText: "LOST",
          isWinner: false,
          status: "PLAYED",
          name: "jackieboi",
        },
      ],
    },
    {
      id: 4,
      name: "UB R1 M4",
      nextMatchId: 6,
      nextLooserMatchId: 9,
      startTime: "2021-05-30T12:00:00Z",
      state: "DONE",
      participants: [
        {
          id: "team-7",
          resultText: "LOST",
          isWinner: false,
          status: "PLAYED",
          name: "OmarDev",
        },
        {
          id: "team-8",
          resultText: "WON",
          isWinner: true,
          status: "PLAYED",
          name: "BTC",
        },
      ],
    },

    {
      id: 5,
      name: "UB R2 M1",
      nextMatchId: 7,
      nextLooserMatchId: 10,
      startTime: "2021-05-31T12:00:00Z",
      state: "DONE",
      participants: [
        {
          id: "team-1",
          resultText: "LOST",
          isWinner: false,
          status: "PLAYED",
          name: "GlootOne",
        },
        {
          id: "team-3",
          resultText: "WON",
          isWinner: true,
          status: "PLAYED",
          name: "Towby",
        },
      ],
    },
    {
      id: 6,
      name: "UB R2 M2",
      nextMatchId: 7,
      nextLooserMatchId: 11,
      startTime: "2021-05-31T12:00:00Z",
      state: "DONE",
      participants: [
        {
          id: "team-5",
          resultText: "LOST",
          isWinner: false,
          status: "PLAYED",
          name: "SeatloN",
        },
        {
          id: "team-8",
          resultText: "WON",
          isWinner: true,
          status: "PLAYED",
          name: "BTC",
        },
      ],
    },

    {
      id: 7,
      name: "UB Final",
      nextMatchId: 13,
      nextLooserMatchId: 14,
      startTime: "2021-06-01T12:00:00Z",
      state: "DONE",
      participants: [
        {
          id: "team-3",
          resultText: "WON",
          isWinner: true,
          status: "PLAYED",
          name: "Towby",
        },
        {
          id: "team-8",
          resultText: "LOST",
          isWinner: false,
          status: "PLAYED",
          name: "BTC",
        },
      ],
    },
    {
      id: 13,
      name: "Grand Final",
      nextMatchId: null,
      nextLooserMatchId: null,
      startTime: "2021-06-02T12:00:00Z",
      state: "DONE",
      participants: [
        {
          id: "team-3",
          resultText: "LOST",
          isWinner: false,
          status: "PLAYED",
          name: "Towby",
        },
        {
          id: "team-5",
          resultText: "WON",
          isWinner: true,
          status: "PLAYED",
          name: "SeatloN",
        },
      ],
    },
  ],

  lower: [
    {
      id: 8,
      name: "LB R1 M1",
      nextMatchId: 10,
      nextLooserMatchId: null,
      startTime: "2021-05-31T12:00:00Z",
      state: "DONE",
      participants: [
        {
          id: "team-2",
          resultText: "WON",
          isWinner: true,
          status: "PLAYED",
          name: "spacefudg3",
        },
        {
          id: "team-4",
          resultText: "LOST",
          isWinner: false,
          status: "PLAYED",
          name: "Alex",
        },
      ],
    },
    {
      id: 9,
      name: "LB R1 M2",
      nextMatchId: 11,
      nextLooserMatchId: null,
      startTime: "2021-05-31T12:00:00Z",
      state: "DONE",
      participants: [
        {
          id: "team-7",
          resultText: "LOST",
          isWinner: false,
          status: "PLAYED",
          name: "OmarDev",
        },
        {
          id: "team-6",
          resultText: "WON",
          isWinner: true,
          status: "PLAYED",
          name: "jackieboi",
        },
      ],
    },

    {
      id: 10,
      name: "LB R2 M1",
      nextMatchId: 12,
      nextLooserMatchId: null,
      startTime: "2021-06-01T12:00:00Z",
      state: "DONE",
      participants: [
        {
          id: "team-2",
          resultText: "LOST",
          isWinner: false,
          status: "PLAYED",
          name: "spacefudg3",
        },
        {
          id: "team-1",
          resultText: "WON",
          isWinner: true,
          status: "PLAYED",
          name: "GlootOne",
        },
      ],
    },
    {
      id: 11,
      name: "LB R2 M2",
      nextMatchId: 12,
      nextLooserMatchId: null,
      startTime: "2021-06-01T12:00:00Z",
      state: "DONE",
      participants: [
        {
          id: "team-6",
          resultText: "LOST",
          isWinner: false,
          status: "PLAYED",
          name: "jackieboi",
        },
        {
          id: "team-8",
          resultText: "WON",
          isWinner: true,
          status: "PLAYED",
          name: "BTC",
        },
      ],
    },

    {
      id: 12,
      name: "LB R3 (Lower Semi)",
      nextMatchId: 14,
      nextLooserMatchId: null,
      startTime: "2021-06-02T12:00:00Z",
      state: "DONE",
      participants: [
        {
          id: "team-1",
          resultText: "WON",
          isWinner: true,
          status: "PLAYED",
          name: "GlootOne",
        },
        {
          id: "team-8",
          resultText: "LOST",
          isWinner: false,
          status: "PLAYED",
          name: "BTC",
        },
      ],
    },

    {
      id: 14,
      name: "Losers Final",
      nextMatchId: 13,
      nextLooserMatchId: null,
      startTime: "2021-06-03T12:00:00Z",
      state: "DONE",
      participants: [
        {
          id: "team-1",
          resultText: "LOST",
          isWinner: false,
          status: "PLAYED",
          name: "GlootOne",
        },
        {
          id: "team-5",
          resultText: "WON",
          isWinner: true,
          status: "PLAYED",
          name: "SeatloN",
        },
      ],
    },
  ],
};

// The DoubleEliminationBracket expects an object with `upper` and `lower` arrays.
// Use `sample` directly (don't flatten) so the library can access `matches.upper` / `matches.lower`.

// Custom match component styled like RoundRobin's TeamSeed
const CustomMatch = ({ match }) => {
  const participants = match?.participants || [];
  const home = participants[0] || null;
  const away = participants[1] || null;

  const getResult = (team) => {
    if (!match || !team) return "";
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
        {formatDate(match?.startTime)}
      </div>
    </div>
  );
};

export const DoubleElimination = () => {
  const [width, height] = useWindowSize();
  const finalWidth = Math.max(width - 80, 900);
  const finalHeight = Math.max(height - 160, 600);

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
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
    </div>
  );
};

export default DoubleElimination;
