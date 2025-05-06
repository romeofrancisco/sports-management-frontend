import React from "react";
import { useParams } from "react-router";
import PageError from "@/pages/PageError";
import SeasonDetailsHeader from "./components/SeasonDetailsHeader";
import { useSeasonDetails, useSeasonStandings } from "@/hooks/useSeasons";
import Loading from "@/components/common/FullLoading";
import { useLeagueDetails } from "@/hooks/useLeagues";
import SeasonStandings from "./components/SeasonStandings";
import SeasonOverview from "./components/SeasonOverview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SeasonGames } from "./components/SeasonGames";
import { SeasonTeams } from "./components/SeasonTeams";
import { SeasonStats } from "./components/SeasonStats";

const SeasonDetails = () => {
  const { league, season } = useParams();
  const {
    data: leagueDetails,
    isLoading: isLeagueLoading,
    isError: isLeagueError,
  } = useLeagueDetails(league);
  const {
    data: seasonDetails,
    isLoading: isSeasonLoading,
    isError: isSeasonError,
  } = useSeasonDetails(league, season);
  const {
    data: seasonStandings,
    isLoading: isSeasonStandingsLoading,
    isError: isSeasonStandingsError,
  } = useSeasonStandings(league, season);

  const isLoading =
    isLeagueLoading || isSeasonStandingsLoading || isSeasonLoading;
  const isError = isLeagueError || isSeasonStandingsError || isSeasonError;

  if (isLoading) return <Loading />;
  if (isError) return <PageError />;

  const { sport } = leagueDetails;

  return (
    <div className="flex flex-col">
      <SeasonDetailsHeader season={seasonDetails} />

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">
            Overview
          </TabsTrigger>
          <TabsTrigger value="games">
            Games
          </TabsTrigger>
          <TabsTrigger value="teams">
            Teams
          </TabsTrigger>
          <TabsTrigger value="stats">
            Stats
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <SeasonOverview seasonDetails={seasonDetails} />
          <SeasonStandings standings={seasonStandings} sport={sport} />
        </TabsContent>

        <TabsContent value="games">
          <SeasonGames seasonId={season} leagueId={league} />
        </TabsContent>

        <TabsContent value="teams">
          <SeasonTeams seasonId={season} leagueId={league} />
        </TabsContent>

        <TabsContent value="stats">
          <SeasonStats seasonId={season} leagueId={league} sport={sport} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SeasonDetails;
