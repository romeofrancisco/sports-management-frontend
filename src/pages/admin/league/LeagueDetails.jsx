import React from "react";
import LeagueDetailsHeader from "./components/LeagueDetailsHeader";
import { useLeagueDetails, useLeagueRankings } from "@/hooks/useLeagues";
import PageError from "@/pages/PageError";
import Loading from "@/components/common/FullLoading";
import { useParams } from "react-router";
import SeasonsTable from "./components/SeasonsTable";
import LeagueStandings from "./components/LeagueStandings";
import { useSeasons } from "@/hooks/useSeasons";

const LeagueDetails = () => {
  const { league } = useParams();
  const { data: leagueDetails, isLoading: isLeagueLoading, isError: isLeagueError } = useLeagueDetails(league);
  const { data: leagueRankings, isLoading: isLeagueRankingsLoading, isError: isLeagueRankingsError } = useLeagueRankings(league);
  const { data: seasons, isLoading: isSeasonsLoading, isError: isSeasonsError } = useSeasons(league);

  const isLoading =
    isLeagueLoading || isSeasonsLoading || isLeagueRankingsLoading;
  const isError = isLeagueError || isSeasonsError || isLeagueRankingsError;

  if (isLoading) return <Loading />;
  if (isError) return <PageError />;

  const { name, sport } = leagueDetails;

  return (
    <div>
      <LeagueDetailsHeader name={name} sport={sport} league={league} />
      <div className="grid lg:grid-cols-2 gap-5">
        <LeagueStandings rankings={leagueRankings} />
        <SeasonsTable seasons={seasons} sport={sport} league={league} />
      </div>
    </div>
  );
};

export default LeagueDetails;
