import { Separator } from "@/components/ui/separator";
import PeriodSelector from "./PeriodSelector";

const EventInfo = ({
  event,
  homeTeam,
  awayTeam,
  game,
  isSetBased,
  scoring,
  selectedPeriodIndex,
  onPeriodChange,
}) => {
  if (!event) {
    return <p className="text-muted-foreground">No game events available</p>;
  }

  return (
    <>
      <div className="flex items-center justify-between border-b border-dashed pb-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <img
              className="w-7"
              src={game.home_team.logo}
              alt={game.home_team.name}
            />
            <span className={event.team_side === "home" ? "font-bold" : ""}>
              {homeTeam.abbreviation} {event.current_score.home}
            </span>
          </div>
          <span>-</span>
          <div className="flex items-center gap-1">
            <img
              className="w-7"
              src={game.away_team.logo}
              alt={game.away_team.name}
            />
            <span className={event.team_side === "away" ? "font-bold" : ""}>
              {awayTeam.abbreviation} {event.current_score.away}
            </span>
          </div>
        </div>
        {isSetBased && (
          <PeriodSelector
            periods={scoring.periods}
            selectedPeriodIndex={selectedPeriodIndex}
            onPeriodChange={onPeriodChange}
          />
        )}
      </div>
      
      <div>
        <p className="text-xs font-medium mb-2">{event.period_label}</p>
        {event.id ? (
          <p className="text-xs text-muted-foreground">
            {event.team} – {event.player} makes {event.stat_name.toLowerCase()}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">{event.stat_name}</p>
        )}
      </div>
    </>
  );
};

export default EventInfo;
