import { formatShortDate, formatTime } from "@/utils/formatDate";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import GameTableActions from "./GameTableActions";
import { GAME_STATUS_VALUES } from "@/constants/game";
import { formatDuration } from "@/utils/formatDuration";

const baseColumns = [
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
              <div className="flex justify-center gap-4 text-center">                <span
                  className={
                    lineup_status.home_ready ? "text-red-800" : "text-red-600"
                  }
                >
                  {lineup_status.home_ready  ? "Ready" : "Pending"}
                </span>
                <span>|</span>                <span
                  className={
                    lineup_status.away_ready ? "text-red-800" : "text-red-600"
                  }
                >
                  {lineup_status.away_ready ? "Ready" : "Pending"}
                </span>
              </div>
            );
          },
        },
      ]);
    case GAME_STATUS_VALUES.IN_PROGRESS:
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
      ]);
    case GAME_STATUS_VALUES.COMPLETED:
      return withActionCol([
        {
          id: "final",
          header: () => <h1 className="text-center">Final</h1>,
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
            return (
              <div className="text-center font-semibold">
                {winner === home_team.id ? home_team.name : away_team.name}
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
      ]);
    case GAME_STATUS_VALUES.POSTPONED:
      return withActionCol([
        {
          id: "status_note",
          header: () => <h1 className="text-center">Status</h1>,
          cell: () => (
            <div className="text-center text-red-500 font-semibold">
              Postponed
            </div>
          ),
        },
      ]);
    default:
      return withActionCol();
  }
};

export default getGameTableColumns;
