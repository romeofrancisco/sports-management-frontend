import React from "react";
import StatCard from "@/components/common/StatCard";
import { useLeagueStatistics } from "@/hooks/useLeagues";
import { Trophy, Users, Calendar, Goal, Award, Flag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const LeagueOverview = ({ league }) => {
  const { data: statistics, isLoading } = useLeagueStatistics(league);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-2 w-16" />
                  <Skeleton className="h-8 w-20" />
                </div>
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!statistics) return null;

  const { teams_count, seasons_count, active_seasons, games_count, current_season } = statistics;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <StatCard 
        title="Total Teams" 
        value={teams_count} 
        icon={<Users size={20} />} 
      />
      <StatCard 
        title="Total Seasons" 
        value={seasons_count} 
        icon={<Flag size={20} />} 
        description={`${active_seasons} active`}
      />
      <StatCard 
        title="Total Games" 
        value={games_count} 
        icon={<Goal size={20} />} 
      />
      <StatCard 
        title="Current Season" 
        value={current_season ? current_season.name || current_season.year : "None"} 
        icon={<Calendar size={20} />} 
        description={current_season ? `Status: ${current_season.status}` : "No active season"}
      />
    </div>
  );
};

export default LeagueOverview;