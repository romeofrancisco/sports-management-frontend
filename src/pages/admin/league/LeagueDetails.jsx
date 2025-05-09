import React, { useState } from "react";
import LeagueDetailsHeader from "./components/LeagueDetailsHeader";
import { useLeagueDetails, useLeagueRankings } from "@/hooks/useLeagues";
import PageError from "@/pages/PageError";
import Loading from "@/components/common/FullLoading";
import { useParams } from "react-router";
import LeagueSeasonsTable from "./components/LeagueSeasonsTable";
import LeagueStandings from "./components/LeagueStandings";
import { useSeasons } from "@/hooks/useSeasons";
import LeagueOverview from "./components/LeagueOverview";
import LeagueTeamsGrid from "./components/LeagueTeamsGrid";
import LeagueStatistics from "./components/LeagueStatistics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

const LeagueDetails = () => {
  const { league } = useParams();
  const {
    data: leagueDetails,
    isLoading: isLeagueLoading,
    isError: isLeagueError,
  } = useLeagueDetails(league);
  const {
    data: leagueRankings,
    isLoading: isLeagueRankingsLoading,
    isError: isLeagueRankingsError,
  } = useLeagueRankings(league);
  const {
    data: seasonsData,
    isLoading: isSeasonsLoading,
    isError: isSeasonsError,
  } = useSeasons(league);
  const [activeTab, setActiveTab] = useState("overview");

  // Extract seasons results from the paginated data
  const seasons = seasonsData?.results || [];

  const isLoading =
    isLeagueLoading || isSeasonsLoading || isLeagueRankingsLoading;
  const isError = isLeagueError || isSeasonsError || isLeagueRankingsError;

  if (isLoading) return <Loading />;
  if (isError) return <PageError />;

  const { name, sport } = leagueDetails;
  const activeSeasons = seasons.filter(s => s.status === 'ongoing' || s.status === 'upcoming').slice(0, 3);

  // Handler for changing tabs
  const handleTabChange = (tabValue) => {
    setActiveTab(tabValue);
  };

  return (
    <div className="container mx-auto px-4 pb-8">
      <LeagueDetailsHeader name={name} sport={sport} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="mb-4">
          <TabsTrigger className="text-xs sm:text-sm" value="overview">Overview</TabsTrigger>
          <TabsTrigger className="text-xs sm:text-sm" value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger className="text-xs sm:text-sm" value="teams">Teams</TabsTrigger>
          <TabsTrigger className="text-xs sm:text-sm" value="seasons">Seasons</TabsTrigger>
          <TabsTrigger className="text-xs sm:text-sm" value="statistics">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="space-y-8">
            <LeagueOverview 
              league={league} 
              sport={sport} 
              onTabChange={handleTabChange}
            />
          </div>
        </TabsContent>

        <TabsContent value="leaderboard">
          <Card className="shadow-sm">
            <CardContent className="pt-6">
              <LeagueStandings rankings={leagueRankings} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teams">
          <Card className="shadow-sm">
            <CardContent className="pt-6">
            <LeagueTeamsGrid teams={leagueRankings} className="md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seasons">
          <Card className="shadow-sm">
            <CardContent className="pt-6">
              <LeagueSeasonsTable seasons={seasons} sport={sport} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics">
          {seasons.length > 0 ? (
            <LeagueStatistics
              leagueId={league}
              latestSeasonId={seasons[0]?.id}
              sport={sport}
            />
          ) : (
            <Card className="shadow-sm">
              <CardContent className="py-8">
                <div className="text-center text-muted-foreground">
                  No seasons available to show statistics
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LeagueDetails;
