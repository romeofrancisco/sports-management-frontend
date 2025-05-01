import { Separator } from "@/components/ui/separator";
import PeriodSelector from "./PeriodSelector";

const EventInfo = ({ event, homeTeam, awayTeam, isSetBased, scoring, selectedPeriodIndex, onPeriodChange }) => {
  if (!event) {
    return <p className="text-muted-foreground">No game events available</p>;
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <p>
          <span className={event.team_side === "home" ? "font-bold" : ""}>
            {homeTeam.abbreviation} {event.current_score.home}
          </span>{" "}
          -{" "}
          <span className={event.team_side === "away" ? "font-bold" : ""}>
            {awayTeam.abbreviation} {event.current_score.away}
          </span>
        </p>
        {isSetBased && (
          <PeriodSelector
            periods={scoring.periods}
            selectedPeriodIndex={selectedPeriodIndex}
            onPeriodChange={onPeriodChange}
          />
        )}
      </div>
      <Separator className="min-h-px my-4" />
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