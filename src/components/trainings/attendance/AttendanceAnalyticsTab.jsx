import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
} from "chart.js";
import { format, subDays } from "date-fns";
import { useTeams } from "@/hooks/useTeams";
import {
  useAttendanceOverview,
  useAttendanceTrends,
  useAttendanceHeatmap,
  usePlayerAttendanceAnalytics,
  usePlayerAttendanceDetail,
} from "@/hooks/useAttendanceAnalytics";
import { AlertCircle } from "lucide-react";
import { OverviewTab, PlayersTabContainer, FiltersSection } from "./components";
import {
  TabLayout,
  TabHeader,
  TabContent,
  TabCard,
} from "@/components/common/TabLayout";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title
);

const AttendanceAnalyticsTab = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  // Filter states
  const [selectedTeam, setSelectedTeam] = useState("all");
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [trendPeriod, setTrendPeriod] = useState("daily");

  // Create filter object for queries
  const filters = {
    team_id: selectedTeam === "all" ? undefined : selectedTeam,
    start_date: dateRange.from
      ? format(dateRange.from, "yyyy-MM-dd")
      : undefined,
    end_date: dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : undefined,
  };

  const trendsFilters = {
    ...filters,
    period: trendPeriod,
  };
  // Tanstack Query hooks
  const { data: teamsResponse = {}, isLoading: teamsLoading } = useTeams();
  const teams = teamsResponse.results || [];
  const {
    data: overviewData,
    isLoading: overviewLoading,
    error: overviewError,
  } = useAttendanceOverview(filters);
  const {
    data: trendsData,
    isLoading: trendsLoading,
    error: trendsError,
  } = useAttendanceTrends(trendsFilters);
  const {
    data: heatmapData,
    isLoading: heatmapLoading,
    error: heatmapError,
  } = useAttendanceHeatmap(filters);
  const {
    data: playersData,
    isLoading: playersLoading,
    error: playersError,
  } = usePlayerAttendanceAnalytics(filters);
  const {
    data: playerDetailData,
    isLoading: playerDetailLoading,
    error: playerDetailError,
  } = usePlayerAttendanceDetail(selectedPlayer?.player_id, filters, {
    enabled: !!selectedPlayer,
  });

  // Combined loading and error states
  const isLoading =
    teamsLoading ||
    overviewLoading ||
    trendsLoading ||
    heatmapLoading ||
    playersLoading;
  const error = overviewError || trendsError || heatmapError || playersError;

  // Event handlers
  const handlePlayerSelect = (player) => {
    setSelectedPlayer(player);
  };

  const handlePlayerBack = () => {
    setSelectedPlayer(null);
  };

  const handleTeamChange = (teamId) => {
    setSelectedTeam(teamId);
  };
  const handleDateRangeChange = (newDateRange) => {
    setDateRange(newDateRange);
  };
  return (
    <TabLayout>
      <TabHeader
        title="Attendance Analytics"
        description="Monitor and analyze training session attendance patterns with comprehensive insights and detailed player statistics"
      />
      <TabContent>
        {/* Filters Section */}
        <TabCard className="mb-6">
          <FiltersSection
            selectedTeam={selectedTeam}
            onTeamChange={handleTeamChange}
            dateRange={dateRange}
            onDateRangeChange={handleDateRangeChange}
            teams={teams}
            teamsLoading={teamsLoading}
          />
        </TabCard>
        {error && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error?.message || "Failed to load attendance analytics data"}
            </AlertDescription>
          </Alert>
        )}        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-6">
            <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
            <div className="text-center space-y-2">
              <p className="font-medium">Loading attendance data...</p>
              <p className="text-muted-foreground text-sm">
                Please wait while we process your analytics
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-card">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="border-b">
                <TabsList className="grid w-full grid-cols-2 bg-transparent h-16 gap-2 p-2">
                  <TabsTrigger
                    value="overview"
                    className="text-sm lg:text-base font-medium rounded-lg flex items-center gap-2"
                  >
                    <span>📊</span>
                    <span className="hidden sm:inline">Overview</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="players"
                    className="text-sm lg:text-base font-medium rounded-lg flex items-center gap-2"
                  >
                    <span>👥</span>
                    <span className="hidden sm:inline">Players</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="p-4 sm:p-6">
                <TabsContent value="overview" className="mt-0">
                  <OverviewTab
                    overviewData={overviewData}
                    trendsData={trendsData}
                  />
                </TabsContent>
                <TabsContent value="players" className="mt-0">
                  <PlayersTabContainer
                    selectedPlayer={selectedPlayer}
                    playersData={playersData}
                    playerDetailData={playerDetailData}
                    playerDetailLoading={playerDetailLoading}
                    playerDetailError={playerDetailError}
                    onPlayerSelect={handlePlayerSelect}
                    onPlayerBack={handlePlayerBack}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        )}
      </TabContent>
    </TabLayout>
  );
};

export default AttendanceAnalyticsTab;
