import React, { useState } from "react";
import { usePlayerProgress, useTrainingMetrics } from "@/hooks/useTrainings";
import { usePlayers } from "@/hooks/usePlayers";
import { useTeams } from "@/hooks/useTeams";
import { Loader2, LineChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PlayerProgressChart from "@/components/charts/PlayerProgressChart/PlayerProgressChart";
import TeamMetricsPage from "./TeamMetricsPage";

const PlayerMetricsPage = () => {
  const [filters, setFilters] = useState({
    player: "",
    team: "",
    metric: "",
    dateRange: "90days" // Options: 30days, 90days, all
  });

  const { data: players, isLoading: playersLoading } = usePlayers();
  const { data: teams, isLoading: teamsLoading } = useTeams();
  const { metrics, isLoading: metricsLoading } = useTrainingMetrics();

  const dateRangeFilter = React.useMemo(() => {
    if (filters.dateRange === "30days") {
      const date = new Date();
      date.setDate(date.getDate() - 30);
      return { start_date: format(date, "yyyy-MM-dd") };
    } else if (filters.dateRange === "90days") {
      const date = new Date();
      date.setDate(date.getDate() - 90);
      return { start_date: format(date, "yyyy-MM-dd") };
    }
    return {};
  }, [filters.dateRange]);

  const progressFilters = React.useMemo(() => {
    const appliedFilters = { ...dateRangeFilter };
    if (filters.player) appliedFilters.player = filters.player;
    if (filters.team) appliedFilters.team = filters.team;
    if (filters.metric) appliedFilters.metric = filters.metric;
    return appliedFilters;
  }, [filters, dateRangeFilter]);

  const { 
    playerProgress, 
    chartData, 
    isLoading: progressLoading 
  } = usePlayerProgress(progressFilters);

  const isLoading = playersLoading || teamsLoading || metricsLoading || progressLoading;  const handleFilterChange = (key, value) => {
    if (value === 'all_players' || value === 'all_teams' || value === 'all_metrics') {
      setFilters(prev => ({ ...prev, [key]: '' }));
    } else {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
  };

  const dateRangeOptions = [
    { value: "30days", label: "Last 30 Days" },
    { value: "90days", label: "Last 90 Days" },
    { value: "all", label: "All Time" }
  ];

  return (
    <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold">Training Analytics</h1>
        <p className="text-muted-foreground">
          Monitor and track player improvements through training
        </p>

      <Tabs defaultValue="players" className="w-full mt-6">
        <TabsList className="mb-4">
          <TabsTrigger value="players">Player Metrics</TabsTrigger>
          <TabsTrigger value="teams">Team Metrics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="players">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <Select
                value={filters.player}
                onValueChange={(value) => handleFilterChange("player", value)}
              >                <SelectTrigger>
                  <SelectValue placeholder="All Players" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_players">All Players</SelectItem>
                  {players?.map(player => (
                    <SelectItem key={player.id} value={player.id}>
                      {player.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select
                value={filters.team}
                onValueChange={(value) => handleFilterChange("team", value)}
              >                <SelectTrigger>
                  <SelectValue placeholder="All Teams" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_teams">All Teams</SelectItem>
                  {teams?.map(team => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select
                value={filters.metric}
                onValueChange={(value) => handleFilterChange("metric", value)}
              >                <SelectTrigger>
                  <SelectValue placeholder="All Metrics" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_metrics">All Metrics</SelectItem>
                  {metrics?.map(metric => (
                    <SelectItem key={metric.id} value={metric.id}>
                      {metric.name} ({metric.metric_unit?.code || '-'})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select
                value={filters.dateRange}
                onValueChange={(value) => handleFilterChange("dateRange", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  {dateRangeOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : chartData.length === 0 ? (
            <div className="text-center py-12 bg-muted/50 rounded-lg">
              <LineChart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No player metrics data found with the current filters.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Try adjusting your filters or recording more player metrics.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Main Progress Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Player Progress Over Time</CardTitle>
                  <CardDescription>
                    Track improvements in training metrics
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-[400px]">
                    <PlayerProgressChart chartData={chartData} />
                  </div>
                </CardContent>
              </Card>
              
              {/* Individual Player Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {playerProgress.map(player => (
                  <Card key={player.player_id}>
                    <CardHeader>
                      <CardTitle>{player.player_name}</CardTitle>
                      <CardDescription>{player.team_name}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {player.metrics_data?.map(metric => (
                          <div key={metric.metric_id} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="font-medium">{metric.metric_name}</div>
                              <div className="flex items-center">
                                <span className="font-semibold">
                                  {metric.latest_value} {metric.metric_unit?.code || ''}
                                </span>
                                {metric.improvement !== 0 && (
                                  <span className={`ml-2 text-xs ${
                                    (metric.is_lower_better && metric.improvement < 0) || 
                                    (!metric.is_lower_better && metric.improvement > 0) 
                                      ? 'text-green-500' 
                                      : 'text-red-500'
                                  }`}>
                                    {metric.improvement > 0 ? '+' : ''}{metric.improvement}%
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <div className="bg-muted h-2 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary"
                                style={{ 
                                  width: `${Math.min(Math.max(
                                    (metric.latest_value / metric.max_value) * 100, 
                                    0), 100)}%` 
                                }}
                              />
                            </div>
                            
                            <div className="flex justify-between text-xs text-muted-foreground">                              <span>Best: {metric.best_value} {metric.metric_unit?.code || '-'}</span>
                              <span>Average: {metric.average_value} {metric.metric_unit?.code || '-'}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="teams">
          <TeamMetricsPage />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PlayerMetricsPage;
