import React from "react";
import { useParams } from "react-router";
import PageError from "@/pages/PageError";
import SeasonDetailsHeader from "./components/SeasonDetailsHeader";
import { useSeasonDetails, useSeasonStandings } from "@/hooks/useSeasons";
import Loading from "@/components/common/FullLoading";
import { useLeagueDetails } from "@/hooks/useLeagues";
import SeasonStandings from "./components/SeasonStandings";

const SeasonDetails = () => {
  const { league, season } = useParams();
  const { data: leagueDetails, isLoading: isLeagueLoading, isError: isLeagueError } = useLeagueDetails(league);
  const { data: seasonDetails, isLoading: isSeasonLoading, isError: isSeasonError } = useSeasonDetails(league, season);
  const { data: seasonStandings, isLoading: isSeasonStandingsLoading, isError: isSeasonStandingsError } = useSeasonStandings(league, season);

  const isLoading = isLeagueLoading || isSeasonStandingsLoading ||isSeasonLoading
  const isError = isLeagueError || isSeasonStandingsError || isSeasonError

  if (isLoading) return <Loading />;
  if (isError) return <PageError />;

  const { name, sport } = leagueDetails;

  return (
    <div className="flex flex-col">
      <SeasonDetailsHeader season={seasonDetails} />
      <SeasonStandings standings={seasonStandings} sport={sport} />
    </div>
  );
};

export default SeasonDetails;
