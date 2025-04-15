import { FilterDate, FilterLeague, FilterSeason, FilterStatus, FilterType } from "./GameFilter";
import { GAME_TYPE_VALUES } from "@/constants/game";

const GameFilterBar = ({ filter, setFilter }) => {
  const handleLeagueChange = (leagueId) => {
    setFilter((prev) => ({ ...prev, league: leagueId, season: "" }));
  };

  const handleTypeChange = (type) => {
    setFilter((prev) => ({
      ...prev,
      type,
      league: type === GAME_TYPE_VALUES.LEAGUE ? prev.league : "",
      season: "",
    }));
  };

  return (
    <div className="flex gap-2 flex-wrap mb-4">
      <FilterType value={filter.type} onChange={handleTypeChange} />
      <FilterLeague value={filter.league} type={filter.type} onChange={handleLeagueChange} />
      <FilterSeason
        value={filter.season}
        league={filter.league}
        onChange={(seasonId) => setFilter((prev) => ({ ...prev, season: seasonId }))}
      />
      <FilterStatus
        value={filter.status}
        onChange={(status) => setFilter((prev) => ({ ...prev, status }))}
      />
      <FilterDate
        value={{ start_date: filter.start_date, end_date: filter.end_date }}
        onChange={({ start_date, end_date }) =>
          setFilter((prev) => ({ ...prev, start_date, end_date }))
        }
      />
    </div>
  );
};

export default GameFilterBar;
