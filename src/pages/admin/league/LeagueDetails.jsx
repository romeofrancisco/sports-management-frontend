import React, { useState } from "react";
import LeagueDetailsHeader from "./components/LeagueDetailsHeader";
import { useLeagueDetails, useLeagueRankings } from "@/hooks/useLeagues";
import PageError from "@/pages/PageError";
import Loading from "@/components/common/FullLoading";
import { useParams } from "react-router";
import SeasonsTable from "./season/components/SeasonsTable";
import LeagueStandings from "./components/LeagueStandings";
import { useSeasons } from "@/hooks/useSeasons";
import LeagueOverview from "./components/LeagueOverview";
import LeagueTeamsGrid from "./components/LeagueTeamsGrid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const LeagueDetails = () => {
  const { league } = useParams();
  const { data: leagueDetails, isLoading: isLeagueLoading, isError: isLeagueError } = useLeagueDetails(league);
  const { data: leagueRankings, isLoading: isLeagueRankingsLoading, isError: isLeagueRankingsError } = useLeagueRankings(league);
  const { data: seasonsData, isLoading: isSeasonsLoading, isError: isSeasonsError } = useSeasons(league);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Extract seasons results from the paginated data
  const seasons = seasonsData?.results || [];

  const isLoading =
    isLeagueLoading || isSeasonsLoading || isLeagueRankingsLoading;
  const isError = isLeagueError || isSeasonsError || isLeagueRankingsError;

  if (isLoading) return <Loading />;
  if (isError) return <PageError />;

  const { name, sport } = leagueDetails;

  return (
    <div className="container mx-auto px-4">
      <LeagueDetailsHeader name={name} sport={sport} />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="standings">Standings</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="seasons">Seasons</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <LeagueOverview />
          
          <div className="grid lg:grid-cols-2 gap-6 mt-6">
            <Card className="bg-card rounded-lg shadow-md transition-all duration-200 hover:shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">League Standings</CardTitle>
              </CardHeader>
              <CardContent>
                <LeagueStandings rankings={leagueRankings} />
              </CardContent>
            </Card>
            
            <Card className="bg-card rounded-lg shadow-md transition-all duration-200 hover:shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Recent Seasons</CardTitle>
              </CardHeader>
              <CardContent>
                <SeasonsTable 
                  seasons={seasons?.slice(0, 5)} 
                  sport={sport} 
                  compact={true}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="standings">
          <Card className="bg-card rounded-lg shadow-md transition-all duration-200 hover:shadow-lg">
            <CardContent className="pt-6">
              <LeagueStandings rankings={leagueRankings} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="teams">
          <Card className="bg-card rounded-lg shadow-md transition-all duration-200 hover:shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle>League Teams</CardTitle>
            </CardHeader>
            <CardContent>
              <LeagueTeamsGrid teams={leagueRankings} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="seasons">
          <Card className="bg-card rounded-lg shadow-md transition-all duration-200 hover:shadow-lg">
            <CardContent className="pt-6">
              <SeasonsTable seasons={seasons} sport={sport} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LeagueDetails;
