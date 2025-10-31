import React, { useEffect, useState } from 'react'
import { SingleEliminationBracket, SVGViewer } from '@g-loot/react-tournament-brackets';
import { formatDate } from '@/utils/formatDate';
import { Calendar } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';

// small hook to get window size for SVG viewport (match the double-elim file)
function useWindowSize() {
  const [size, setSize] = useState([window.innerWidth, window.innerHeight]);
  useEffect(() => {
    function onResize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return size;
}

// Expanded sample single-elimination matches (8 teams — quarters, semis, final)
// Styled to match DoubleElimination's UI
const sampleMatches = [
  // Quarterfinals
  {
    id: 1,
    name: 'QF1',
    nextMatchId: 5,
    startTime: '2021-05-30T09:00:00Z',
    state: 'DONE',
    participants: [
      { id: 'team-1', name: 'GlootOne', isWinner: true, resultText: 'WON' },
      { id: 'team-8', name: 'BTC', isWinner: false, resultText: 'LOST' },
    ],
  },
  {
    id: 2,
    name: 'QF2',
    nextMatchId: 5,
    startTime: '2021-05-30T10:00:00Z',
    state: 'DONE',
    participants: [
      { id: 'team-4', name: 'Alex', isWinner: false, resultText: 'LOST' },
      { id: 'team-5', name: 'SeatloN', isWinner: true, resultText: 'WON' },
    ],
  },
  {
    id: 3,
    name: 'QF3',
    nextMatchId: 6,
    startTime: '2021-05-30T11:00:00Z',
    state: 'DONE',
    participants: [
      { id: 'team-3', name: 'Towby', isWinner: true, resultText: 'WON' },
      { id: 'team-6', name: 'jackieboi', isWinner: false, resultText: 'LOST' },
    ],
  },
  {
    id: 4,
    name: 'QF4',
    nextMatchId: 6,
    startTime: '2021-05-30T12:00:00Z',
    state: 'DONE',
    participants: [
      { id: 'team-2', name: 'spacefudg3', isWinner: false, resultText: 'LOST' },
      { id: 'team-7', name: 'OmarDev', isWinner: true, resultText: 'WON' },
    ],
  },

  // Semifinals
  {
    id: 5,
    name: 'SF1',
    nextMatchId: 7,
    startTime: '2021-05-31T09:00:00Z',
    state: 'DONE',
    participants: [
      { id: 'team-1', name: 'GlootOne', isWinner: true, resultText: 'WON' },
      { id: 'team-5', name: 'SeatloN', isWinner: false, resultText: 'LOST' },
    ],
  },
  {
    id: 6,
    name: 'SF2',
    nextMatchId: 7,
    startTime: '2021-05-31T10:00:00Z',
    state: 'DONE',
    participants: [
      { id: 'team-3', name: 'Towby', isWinner: false, resultText: 'LOST' },
      { id: 'team-7', name: 'OmarDev', isWinner: true, resultText: 'WON' },
    ],
  },

  // Final
  {
    id: 7,
    name: 'Final',
    nextMatchId: null,
    startTime: '2021-06-01T12:00:00Z',
    state: 'SCHEDULED',
    participants: [
      { id: 'team-1', name: 'GlootOne', isWinner: null, resultText: null },
      { id: 'team-7', name: 'OmarDev', isWinner: null, resultText: null },
    ],
  },
];

// Reuse the same visual style as DoubleElimination's CustomMatch
const CustomMatch = ({ match }) => {
  const participants = match?.participants || [];
  const home = participants[0] || null;
  const away = participants[1] || null;

  const getResult = (team) => {
    if (!match || !team) return '';
    if (team.isWinner) return 'WON';
    return 'LOST';
  };

  const renderTeamRow = (team) => {
    const result = getResult(team);
    const opacity = !team
      ? 'opacity-70 italic'
      : team.isWinner
      ? 'opacity-100'
      : 'opacity-70';

    return (
      <div className={`flex items-center text-xs p-0 gap-2 h-7 w-full ${opacity}`}>
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
            result === 'WON' ? 'bg-secondary rounded' : 'text-muted-foreground'
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

const SingleElimination = () => {
  const [width, height] = useWindowSize();
  const finalWidth = Math.max(width - 80, 900);
  const finalHeight = Math.max(height - 160, 600);

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <SingleEliminationBracket
        matches={sampleMatches}
        matchComponent={CustomMatch}
        svgWrapper={({ children, ...props }) => (
          <SVGViewer width={finalWidth} height={finalHeight} SVGBackground="var(--background)" {...props}>
            {children}
          </SVGViewer>
        )}
      />
    </div>
  );
};

export default SingleElimination
