import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import PageError from "../PageError";
import LeagueDetailsHeader from "./components/league/LeagueDetailsHeader";
import { useSeasons, useSeasonStandings } from "@/hooks/useSeasons";
import Loading from "@/components/common/Loading";
import { useLeagueDetails } from "@/hooks/useLeagues";
import SeasonStandings from "./components/league/SeasonStandings";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import GenerateBracketModal from "@/components/modals/GenerateBracketModal";
import { useModal } from "@/hooks/useModal";
import { useSeasonDetails } from "@/hooks/useSeasons";
import { useNavigate } from "react-router";

const SelectSeason = ({ seasons, selectedSeason, setSelectedSeason }) => {
  useEffect(() => {
    if (!selectedSeason && seasons.length > 0) {
      setSelectedSeason(seasons[0].id); // Default to the first season
    }
  }, [seasons, selectedSeason, setSelectedSeason]);

  return (
    <Select
      value={selectedSeason}
      onValueChange={(value) => setSelectedSeason(value)}
    >
      <SelectTrigger className="min-w-[5rem] md:min-w-[10rem] text-xs md:text-sm justify-evenly row-span-2 col-start-2 md:py-5">
        <Label className="text-muted-foreground text-xs md:text-sm">
          Season:
        </Label>
        <SelectValue placeholder="Select Season" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Seasons</SelectLabel>
          {seasons?.map((season) => (
            <SelectItem
              key={season.id}
              value={season.id}
              className="text-xs md:text-sm"
            >
              {season.year}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

const GenerateOrViewBracket = ({ selectedSeason, league }) => {
  const { isOpen, closeModal, openModal } = useModal();
  const { data: season } = useSeasonDetails(league, selectedSeason);
  const navigate = useNavigate();
  return (
    <div className="ml-auto">
      {season?.has_bracket ? (
        <Button
          variant="outline"
          onClick={() => navigate(`/leagues/${league}/bracket/${season.id}`)}
          className="ml-auto row-span-2 col-start-2 md:py-5"
        >
          View Bracket
        </Button>
      ) : (
        <Button
          variant="outline"
          className="ml-auto row-span-2 col-start-2 md:py-5"
          size="sm"
          onClick={openModal}
        >
          Generate Bracket
        </Button>
      )}
      <GenerateBracketModal
        isOpen={isOpen}
        onClose={closeModal}
        season={selectedSeason}
        league={league}
      />
    </div>
  );
};

const LeagueDetails = () => {
  const { league } = useParams();
  const [selectedSeason, setSelectedSeason] = useState(null);
  const {
    data: leagueDetails,
    isLoading: isLeagueLoading,
    isError: isLeagueError,
  } = useLeagueDetails(league);
  const {
    data: seasons,
    isLoading: isSeasonsLoading,
    isSeasonsError,
  } = useSeasons(league);
  const {
    data: seasonStandings,
    isLoading: isSeasonStandingsLoading,
    isError: isSeasonStandingsError,
  } = useSeasonStandings(league, selectedSeason);

  const isLoading =
    isLeagueLoading || isSeasonsLoading || isSeasonStandingsLoading;
  const isError = isLeagueError || isSeasonsError || isSeasonStandingsError;

  if (isLoading) return <Loading />;
  if (isError) return <PageError />;

  const { name, sport } = leagueDetails;

  return (
    <div className="flex flex-col">
      <LeagueDetailsHeader name={name} />
      <div className="flex items-center gap-2">
        <GenerateOrViewBracket
          selectedSeason={selectedSeason}
          league={league}
        />
        <SelectSeason
          seasons={seasons}
          selectedSeason={selectedSeason}
          setSelectedSeason={setSelectedSeason}
        />
      </div>
      <SeasonStandings standings={seasonStandings} sport={sport} />
    </div>
  );
};

export default LeagueDetails;
