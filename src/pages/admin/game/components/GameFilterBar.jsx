import {
  FilterDateRange,
  FilterLeague,
  FilterSeason,
  FilterGameStatus,
  FilterGameType,
  SearchFilter,
  FilterSport,
} from "@/components/common/Filters";
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
    <div className="px-5 grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
      <SearchFilter
        className="order-3 col-span-2 md:order-1"
        onChange={(team_name) => setFilter((prev) => ({ ...prev, team_name }))}
      />
      <FilterGameType
        className="order-2"
        value={filter.type}
        onChange={handleTypeChange}
      />
      <FilterLeague
        className=""
        value={filter.league}
        type={filter.type}
        onChange={handleLeagueChange}
      />
      <FilterSeason
        className=""
        value={filter.season}
        league={filter.league}
        onChange={(seasonId) =>
          setFilter((prev) => ({ ...prev, season: seasonId }))
        }
      />
      <FilterGameStatus
        className="md:order-3"
        value={filter.status}
        onChange={(status) => setFilter((prev) => ({ ...prev, status }))}
      />
      <FilterDateRange
        className=""
        value={{ start_date: filter.start_date, end_date: filter.end_date }}
        onChange={({ start_date, end_date }) =>
          setFilter((prev) => ({ ...prev, start_date, end_date }))
        }
      />
      <FilterSport
        value={filter.sport}
        onChange={(sport) => setFilter((prev) => ({ ...prev, sport }))}
      />
    </div>
  );
};

export default GameFilterBar;
