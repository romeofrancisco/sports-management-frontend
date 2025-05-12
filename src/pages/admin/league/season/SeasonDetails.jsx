import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import {
  useSeasonDetails,
  useSeasonStandings,
  useSeasons,
} from "@/hooks/useSeasons";
import { useLeagueDetails } from "@/hooks/useLeagues";
import SeasonDetailsHeader from "./components/SeasonDetailsHeader";
import SeasonOverview from "./components/SeasonOverview";
import SeasonStandings from "./components/SeasonStandings";
import { SeasonGames } from "./components/SeasonGames";
import { SeasonTeams } from "./components/SeasonTeams";
import { SeasonStats } from "./components/SeasonStats";
import BracketView from "./components/BracketView";
import PageError from "@/pages/PageError";
import Loading from "@/components/common/FullLoading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SeasonDetails = () => {
  const { league, season } = useParams();
  const [activeTab, setActiveTab] = useState("overview");

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
      <SeasonDetailsHeader
        season={seasonDetails}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        defaultValue="overview"
        className="w-full"
      >
        <div className="flex items-center justify-center sm:justify-start">
          <TabsList className="self-center mt-5 mb-3">
            <TabsTrigger className="text-xs md:text-sm" value="overview">
              Overview
            </TabsTrigger>
            <TabsTrigger className="text-xs md:text-sm" value="standings">
              Standings
            </TabsTrigger>
            <TabsTrigger className="text-xs md:text-sm" value="games">
              Games
            </TabsTrigger>
            <TabsTrigger className="text-xs md:text-sm" value="teams">
              Teams
            </TabsTrigger>
            <TabsTrigger className="text-xs md:text-sm" value="stats">
              Stats
            </TabsTrigger>
            {seasonDetails.has_bracket && (
              <TabsTrigger className="text-xs md:text-sm" value="bracket">
                Bracket
              </TabsTrigger>
            )}
          </TabsList>
        </div>

        <TabsContent value="overview">
          <SeasonOverview seasonDetails={seasonDetails} />
        </TabsContent>

        <TabsContent value="standings">
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

        {seasonDetails.has_bracket && (
          <TabsContent value="bracket">
            <BracketView season={seasonDetails} leagueId={league} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default SeasonDetails;
