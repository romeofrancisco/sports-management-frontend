import { formatShortDate, formatTime } from "@/utils/formatDate";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import GameTableActions from "./GameTableActions";
import { GAME_STATUS_VALUES } from "@/constants/game";
import { formatDuration } from "@/utils/formatDuration";

const baseColumns = [
  {
    id: "league_season",
    header: () => <h1 className="text-center">League/Season</h1>,
    cell: ({ row }) => {
      const { league, season } = row.original;
      return (
        <div className="text-center">
          <div className="font-medium text-sm">{league?.name || "N/A"}</div>
          <div className="text-xs text-muted-foreground">
            {season?.name || season?.year || "N/A"}
          </div>
        </div>
      );
    },
    size: 130,
  },
  {
    id: "teams",
    header: () => <h1 className="text-center">Teams</h1>,
    cell: ({ row }) => {
      const { home_team, away_team } = row.original;
      return (
        <div className="grid grid-cols-[3] grid-rows-2 items-center font-medium text-center">
          <Avatar className="place-self-center">
            <AvatarImage src={home_team.logo} />
          </Avatar>
          <span className="text-primary row-start-2">{home_team.abbreviation || "HOME"}</span>
          <span className="text-muted-foreground font-bold col-start-2 row-start-1 row-span-2">VS</span>
          <span className="text-secondary row-start-2">{away_team.abbreviation || "AWAY"}</span>
          <Avatar className="place-self-center">
            <AvatarImage src={away_team.logo} />
          </Avatar>
        </div>
      );
    },
    size: 200,
  },
  {
    id: "sport_type",
    header: () => <h1 className="text-center">Sport/Type</h1>,
    cell: ({ row }) => {
      const { sport_slug, type } = row.original;
      const sportName = sport_slug 
        ? sport_slug.charAt(0).toUpperCase() + sport_slug.slice(1)
        : "N/A";
      return (
        <div className="text-center">
          <div className="font-medium text-sm">{sportName}</div>
          {type && (
            <Badge variant="outline" className="text-xs mt-1">
              {type}
            </Badge>
          )}
        </div>
      );
    },
    size: 100,
  },
  {
    id: "date_time",
    header: () => <h1 className="text-center">Date & Time</h1>,
    cell: ({ row }) => {
      const { date } = row.original;
      return (
        <div className="text-center">
          <div>{formatShortDate(date)}</div>
          <div className="text-xs text-muted-foreground">
            {formatTime(date)}
          </div>
        </div>
      );
    },
  },
  {
    id: "location",
    header: () => <h1 className="text-center">Location</h1>,
    cell: ({ row }) => (
      <div className="text-center">{row.original.location || "TBD"}</div>
    ),
  },
];

const getGameTableColumns = ({
  filterStatus,
  navigate,
  setSelectedGame,
  modals,
}) => {
  const dynamicCols = [...baseColumns];

  const withActionCol = (extraCols = []) => [
    ...dynamicCols,
    ...extraCols,
    {
      id: "actions",
      cell: ({ row }) => (
        <GameTableActions
          game={row.original}
          navigate={navigate}
          setSelectedGame={setSelectedGame}
          modals={modals}
        />
      ),
      size: 50,
    },
  ];
  switch (filterStatus) {
    case GAME_STATUS_VALUES.SCHEDULED:
      return withActionCol([
        {
          id: "lineup_status",
          header: () => <h1 className="text-center">Lineup Status</h1>,
          cell: ({ row }) => {
            const { lineup_status } = row.original;
            return (
              <div className="flex justify-center gap-4 text-center">
                <span
                  className={
                    lineup_status.home_ready ? "text-green-600" : "text-red-600"
                  }
                >
                  {lineup_status.home_ready ? "Ready" : "Pending"}
                </span>
                <span>|</span>
                <span
                  className={
                    lineup_status.away_ready ? "text-green-600" : "text-red-600"
                  }
                >
                  {lineup_status.away_ready ? "Ready" : "Pending"}
                </span>
              </div>
            );
          },
        },
        {
          id: "teams_readiness",
          header: () => <h1 className="text-center">Overall Status</h1>,
          cell: ({ row }) => {
            const { lineup_status } = row.original;
            const bothReady = lineup_status.home_ready && lineup_status.away_ready;
            const noneReady = !lineup_status.home_ready && !lineup_status.away_ready;
            
            return (
              <div className="text-center">
                <Badge 
                  variant={bothReady ? "default" : noneReady ? "destructive" : "secondary"}
                  className="text-xs"
                >
                  {bothReady ? "Ready to Start" : noneReady ? "Not Ready" : "Partially Ready"}
                </Badge>
              </div>
            );
          },
        },
      ]);    case GAME_STATUS_VALUES.IN_PROGRESS:
      return withActionCol([
        {
          id: "current_period",
          header: () => <h1 className="text-center">Period</h1>,
          cell: ({ row }) => (
            <div className="text-center font-bold">
              {row.original.current_period || "1"}
            </div>
          ),
        },
        {
          id: "live_score",
          header: "Live Score",
          cell: ({ row }) => {
            const { home_team_score, away_team_score } = row.original;
            return (
              <div className="text-center font-bold">
                {home_team_score} - {away_team_score}
              </div>
            );
          },
        },
        {
          id: "score_differential",
          header: () => <h1 className="text-center">Lead</h1>,
          cell: ({ row }) => {
            const { home_team_score, away_team_score } = row.original;
            const diff = home_team_score - away_team_score;
            const leader = diff > 0 ? row.original.home_team.abbreviation : 
                          diff < 0 ? row.original.away_team.abbreviation : "TIE";
            
            return (
              <div className="text-center">
                <div className="text-sm font-medium">{leader}</div>
                {diff !== 0 && (
                  <div className="text-xs text-muted-foreground">
                    +{Math.abs(diff)}
                  </div>
                )}
              </div>
            );
          },
        },
        {
          id: "game_time",
          header: () => <h1 className="text-center">Elapsed</h1>,
          cell: ({ row }) => {
            const startTime = row.original.started_at;
            if (!startTime) return <div className="text-center">--</div>;
            
            const elapsed = Math.floor((new Date() - new Date(startTime)) / 60000); // minutes
            return (
              <div className="text-center">
                <Badge variant="outline" className="animate-pulse">
                  {elapsed}m
                </Badge>
              </div>
            );
          },
        },
      ]);    case GAME_STATUS_VALUES.COMPLETED:
      return withActionCol([
        {
          id: "final",
          header: () => <h1 className="text-center">Final Score</h1>,
          cell: ({ row }) => {
            const { home, away } = row.original.score_summary.total;
            return (
              <div className="text-center font-bold">
                {home} - {away}
              </div>
            );
          },
        },
        {
          id: "winner",
          header: () => <h1 className="text-center">Winner</h1>,
          cell: ({ row }) => {
            const { winner, home_team, away_team } = row.original;
            if (!winner) return <div className="text-center">Draw</div>;
            const winnerTeam = winner === home_team.id ? home_team : away_team;
            return (
              <div className="text-center">
                <div className="font-semibold">{winnerTeam.abbreviation}</div>
                <div className="text-xs text-muted-foreground">{winnerTeam.name}</div>
              </div>
            );
          },
        },
        {
          id: "margin",
          header: () => <h1 className="text-center">Margin</h1>,
          cell: ({ row }) => {
            const { home, away } = row.original.score_summary.total;
            const margin = Math.abs(home - away);
            const marginType = margin === 0 ? "TIE" : 
                             margin <= 3 ? "Close" : 
                             margin <= 10 ? "Comfortable" : "Blowout";
            
            return (
              <div className="text-center">
                <div className="font-medium">{margin}</div>
                <Badge 
                  variant={margin === 0 ? "secondary" : 
                          margin <= 3 ? "default" : 
                          margin <= 10 ? "outline" : "destructive"}
                  className="text-xs"
                >
                  {marginType}
                </Badge>
              </div>
            );
          },
        },
        {
          id: "duration",
          header: () => <h1 className="text-center">Duration</h1>,
          cell: ({ row }) => (
            <div className="text-center">
              {formatDuration(row.original.duration) || "N/A"}
            </div>
          ),
        },
        {
          id: "periods_breakdown",
          header: () => <h1 className="text-center">Periods</h1>,
          cell: ({ row }) => {
            const periods = row.original.score_summary?.periods || [];
            if (periods.length === 0) return <div className="text-center">--</div>;
            
            return (
              <div className="text-center text-xs">
                {periods.map((period, index) => (
                  <div key={index} className="text-muted-foreground">
                    {period.label}: {period.home}-{period.away}
                  </div>
                ))}
              </div>
            );
          },
          size: 80,
        },
      ]);    case GAME_STATUS_VALUES.POSTPONED:
      return withActionCol([
        {
          id: "status_note",
          header: () => <h1 className="text-center">Status</h1>,
          cell: () => (
            <div className="text-center">
              <Badge variant="destructive" className="font-semibold">
                Postponed
              </Badge>
            </div>
          ),
        },
        {
          id: "original_date",
          header: () => <h1 className="text-center">Original Date</h1>,
          cell: ({ row }) => (
            <div className="text-center text-sm text-muted-foreground">
              {formatShortDate(row.original.date)}
            </div>
          ),
        },
        {
          id: "teams_info",
          header: () => <h1 className="text-center">Teams Affected</h1>,
          cell: ({ row }) => {
            const { home_team, away_team } = row.original;
            return (
              <div className="text-center text-sm">
                <div>{home_team.abbreviation} vs {away_team.abbreviation}</div>
                <div className="text-xs text-muted-foreground">
                  {home_team.name} vs {away_team.name}
                </div>
              </div>
            );
          },
        },
      ]);
    default:
      return withActionCol([
        {
          id: "game_status",
          header: () => <h1 className="text-center">Status</h1>,
          cell: ({ row }) => {
            const status = row.original.status;
            const statusDisplay = status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
            
            return (
              <div className="text-center">
                <Badge 
                  variant={status === 'cancelled' ? 'destructive' : 'secondary'}
                  className="font-medium"
                >
                  {statusDisplay}
                </Badge>
              </div>
            );
          },
        },
        {
          id: "recorded_status",
          header: () => <h1 className="text-center">Recording</h1>,
          cell: ({ row }) => (
            <div className="text-center">
              <Badge 
                variant={row.original.is_recorded ? "default" : "outline"}
                className="text-xs"
              >
                {row.original.is_recorded ? "Recorded" : "Not Recorded"}
              </Badge>
            </div>
          ),
        },
      ]);
  }
};

export default getGameTableColumns;
