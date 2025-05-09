import React from "react";
import { useLeagueComprehensiveStats } from "@/hooks/useLeagues";
import Loading from "@/components/common/FullLoading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import StatCard from "@/components/common/StatCard";
import { Award, BarChart2, CheckSquare, Shield, Trophy, TrendingUp, Users, Calendar, Activity, Goal } from "lucide-react";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LeagueComprehensiveStats = ({ leagueId, sport }) => {
  const { data: stats, isLoading } = useLeagueComprehensiveStats(leagueId);

  if (isLoading) return <Loading />;
  if (!stats) return <div>No statistics available</div>;

  // Determine if we're dealing with a set-based sport (volleyball) or point-based sport (basketball)
  const isSetBased = stats.scoring_type === 'sets';

  return (
    <Card className="bg-card rounded-lg shadow-md transition-all duration-200 hover:shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle>League Overview Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Display summary stats with appropriate metrics based on sport type */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title={isSetBased ? "Total Matches" : "Total Games"}
            value={isSetBased ? stats.total_matches : stats.total_games}
            icon={<Goal size={20} className="text-blue-500" />}
          />
          <StatCard
            title={isSetBased ? "Total Sets" : "Seasons"}
            value={isSetBased ? stats.total_sets : stats.seasons_count}
            icon={<Calendar size={20} className="text-green-500" />}
          />
          <StatCard
            title={isSetBased ? "Avg Sets/Match" : "Completed Seasons"}
            value={isSetBased ? stats.avg_sets_per_match : stats.completed_seasons}
            icon={<Trophy size={20} className="text-amber-500" />}
          />
          <StatCard
            title={isSetBased ? "Avg Points/Set" : "Avg Points/Game"}
            value={isSetBased ? stats.avg_points_per_set : stats.avg_points_per_game}
            icon={<Activity size={20} className="text-rose-500" />}
          />
        </div>

        {/* Performance Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
          {/* Team Performance Chart */}
          <Card className="p-4">
            <CardHeader className="pb-2 pt-0">
              <CardTitle className="text-base">
                {isSetBased ? "Top Teams Match Win %" : "Top Teams Win %"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Bar 
                data={getTopTeamsData(stats.teams, isSetBased)} 
                options={{
                  indexAxis: 'y',
                  plugins: {
                    legend: { display: false }
                  },
                  scales: {
                    x: {
                      beginAtZero: true,
                      max: 100,
                      title: { 
                        display: true,
                        text: 'Win %'
                      }
                    }
                  }
                }}
              />
            </CardContent>
          </Card>

          {/* Points Distribution Chart */}
          <Card className="p-4">
            <CardHeader className="pb-2 pt-0">
              <CardTitle className="text-base">
                {isSetBased ? "Top Teams by Point Efficiency" : "Top Teams by Point Differential"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Bar 
                data={getPointsDistributionData(stats.teams, isSetBased)}
                options={{
                  indexAxis: 'y',
                  plugins: {
                    legend: { display: false }
                  },
                  scales: {
                    x: {
                      beginAtZero: isSetBased,
                      title: { 
                        display: true,
                        text: isSetBased ? 'Point Efficiency %' : 'Point Differential'
                      }
                    }
                  }
                }}
              />
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function to generate chart data for top teams
const getTopTeamsData = (teams, isSetBased) => {
  if (!teams || teams.length === 0) {
    return {
      labels: ['No data'],
      datasets: [
        {
          label: 'Win %',
          data: [0],
          backgroundColor: 'rgba(54, 162, 235, 0.7)',
        },
      ],
    };
  }
  
  const topTeams = teams.slice(0, 5);
  
  return {
    labels: topTeams.map(team => team.team_name),
    datasets: [
      {
        label: isSetBased ? 'Match Win %' : 'Win %',
        data: topTeams.map(team => {
          if (isSetBased) {
            return team.match_win_percentage || 0;
          } else {
            return team.win_percentage || 0;
          }
        }),
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };
};

// Helper function to generate points distribution chart data
const getPointsDistributionData = (teams, isSetBased) => {
  if (!teams || teams.length === 0) {
    return {
      labels: ['No data'],
      datasets: [
        {
          label: 'No data',
          data: [0],
          backgroundColor: 'rgba(255, 99, 132, 0.7)',
        },
      ],
    };
  }
  
  const topTeams = teams.slice(0, 5);
  
  return {
    labels: topTeams.map(team => team.team_name),
    datasets: [
      {
        label: isSetBased ? 'Point Efficiency %' : 'Point Differential',
        data: topTeams.map(team => {
          if (isSetBased) {
            return team.point_efficiency || 0;
          } else {
            return team.point_differential || 0;
          }
        }),
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };
};

export default LeagueComprehensiveStats;