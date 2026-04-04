import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  BarChart3,
  TrendingUp,
  Activity,
  Award,
  Target,
  Zap,
} from "lucide-react";
import PlayerProgressMultiChart from "@/components/charts/PlayerProgressMultiChart/PlayerProgressMultiChart";
import PlayerImprovements from "@/components/charts/PlayerProgressMultiChart/PlayerImprovements";
import MultiChartHeader from "@/components/charts/PlayerProgressMultiChart/MultiChartHeader";
import { useMultiPlayerChartData } from "@/hooks/useMultiPlayerChartData";
import { useTeamOverview } from "@/hooks/useTeamOverview";
import ChartCard from "@/components/charts/ChartCard";
import useChartSummaryModal from "@/hooks/useChartSummaryModal";
import ChartSummaryModal from "@/components/charts/ChartSummaryModal";

const PlayerProgressMultiView = ({
  players = [],
  teamSlug = null,
  dateRange = null,
  setDateRange = null,
  dateRangeParams = null,
  onDateChange,
}) => {
  const [selectedMetric, setSelectedMetric] = useState("overall");
  const {
    isOpen,
    setIsOpen,
    title,
    summaryLines,
    analysis,
    error,
    isLoading: summaryLoading,
    openSummary,
  } = useChartSummaryModal({
    fetchSummary: async (chartType) => ({
      data: {
        title:
          chartType === "comparison"
            ? "Player Progress Comparison"
            : "Player Improvements Analysis",
        analysis: {
          insights: [
            "This chart compares progression trends across selected players.",
            "Use trend spread to identify who needs support and who can be benchmark examples.",
          ],
          recommendations: [
            "Assign targeted development tasks for players lagging behind the group median.",
            "Review this view after each cycle to track intervention effectiveness.",
          ],
          possible_outcomes: [
            "More balanced improvement across the squad.",
            "Faster correction of individual performance gaps.",
          ],
        },
      },
    }),
  });

  // Use our custom hook to get all chart data and related info
  const {
    metrics,
    chartData,
    playerColors,
    multiPlayerData,
    selectedMetricDetails,
    isLoading,
    metricsLoading,
  } = useMultiPlayerChartData({
    players,
    teamSlug,
    selectedMetric,
    dateRange: dateRange || dateRangeParams,
  });

  // TeamOverviewCards component
  const TeamOverviewCards = ({ overview, isLoading }) => {
    if (isLoading) {
      return (
        <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <Card key={i} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                <div className="w-10 h-10 bg-muted animate-pulse rounded-lg" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-12 bg-muted animate-pulse rounded mb-1" />
                <div className="h-3 w-20 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    // Show placeholder cards when no data is available
    if (!overview) {
      const placeholderCards = [
        {
          title: "Total Players",
          value: players?.length || 0,
          description: teamSlug ? "Team Players" : "Selected Players",
          icon: (
            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
          ),
          color: "from-primary via-primary/90 to-primary/80",
          bgColor: "bg-primary/8",
          borderColor: "border-primary/30",
          iconBg: "bg-primary",
          textAccent: "text-primary",
        },
        {
          title: "Recent Progress",
          value: "N/A",
          description: "Last 3 months",
          icon: (
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
          ),
          color: "from-primary via-primary/90 to-primary/80",
          bgColor: "bg-primary/8",
          borderColor: "border-primary/30",
          iconBg: "bg-primary",
          textAccent: "text-primary",
        },
        {
          title: "Overall Progress",
          value: "N/A",
          description: "All time average",
          icon: <Target className="h-4 w-4 sm:h-5 sm:w-5 text-white" />,
          color: "from-primary via-primary/90 to-primary/80",
          bgColor: "bg-primary/8",
          borderColor: "border-primary/30",
          iconBg: "bg-primary",
          textAccent: "text-primary",
        },
        {
          title: "Best Player",
          value: "N/A",
          description: "No data",
          icon: <Award className="h-4 w-4 sm:h-5 sm:w-5 text-white" />,
          color: "from-primary via-primary/90 to-primary/80",
          bgColor: "bg-primary/8",
          borderColor: "border-primary/30",
          iconBg: "bg-primary",
          textAccent: "text-primary",
        },
      ];

      return (
        <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
          {placeholderCards.map((stat, idx) => (
            <Card
              key={stat.title || idx}
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
                stat.bgColor || ""
              } ${stat.borderColor || ""} border`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${
                  stat.color || ""
                } opacity-5`}
              />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div
                  className={`p-1.5 sm:p-2 rounded-lg ${
                    stat.iconBg || ""
                  } shadow-lg transition-transform duration-300 hover:scale-110`}
                >
                  {stat.icon}
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div
                  className={`text-xl sm:text-2xl font-bold ${
                    stat.textAccent || ""
                  } mb-1`}
                >
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground font-medium">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    const overviewCards = [
      {
        title: "Total Team Players",
        value: overview.number_of_players || 0,
        description: `${overview.team_name || "Team"}`,
        icon: (
          <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
        ),
        color: "from-primary via-primary/90 to-primary/80",
        bgColor: "bg-primary/8",
        borderColor: "border-primary/30",
        iconBg: "bg-primary",
        textAccent: "text-primary",
      },
      {
        title: "Recent Team Progress",
        value: overview.recent_team_improvement?.percentage
          ? `${overview.recent_team_improvement.percentage > 0 ? "+" : ""}${
              overview.recent_team_improvement.percentage
            }%`
          : "N/A",
        description: "Last 3 months",
        icon: (
          <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
        ),
        color: "from-primary via-primary/90 to-primary/80",
        bgColor: "bg-primary/8",
        borderColor: "border-primary/30",
        iconBg: "bg-primary",
        textAccent: "text-primary",
      },
      {
        title: "Overall Team Progress",
        value: overview.overall_team_improvement?.percentage
          ? `${overview.overall_team_improvement.percentage > 0 ? "+" : ""}${
              overview.overall_team_improvement.percentage
            }%`
          : "N/A",
        description: "All time average",
        icon: <Target className="h-4 w-4 sm:h-5 sm:w-5 text-white" />,
        color: "from-primary via-primary/90 to-primary/80",
        bgColor: "bg-primary/8",
        borderColor: "border-primary/30",
        iconBg: "bg-primary",
        textAccent: "text-primary",
      },
      {
        title: "Best Team Player",
        value: overview.best_player?.player_name
          ? overview.best_player.player_name
          : "N/A",
        description:
          overview.best_player &&
          overview.best_player.overall_improvement_percentage != null
            ? `With ${
                overview.best_player.overall_improvement_percentage > 0
                  ? "+"
                  : ""
              }${overview.best_player.overall_improvement_percentage.toFixed(
                2
              )}% in last 3 months`
            : "No data",
        icon: <Award className="h-4 w-4 sm:h-5 sm:w-5 text-white" />,
        color: "from-primary via-primary/90 to-primary/80",
        bgColor: "bg-primary/8",
        borderColor: "border-primary/30",
        iconBg: "bg-primary",
        textAccent: "text-primary",
      },
    ];

    return (
      <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
        {overviewCards.map((stat, idx) => (
          <Card
            key={stat.title || idx}
            className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
              stat.bgColor || ""
            } ${stat.borderColor || ""} border`}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${
                stat.color || ""
              } opacity-5`}
            />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div
                className={`p-1.5 sm:p-2 rounded-lg ${
                  stat.iconBg || ""
                } shadow-lg transition-transform duration-300 hover:scale-110`}
              >
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div
                className={`text-xl sm:text-2xl font-bold ${
                  stat.textAccent || ""
                } mb-1`}
              >
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground font-medium">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  // Get team overview data
  const {
    data: overviewData,
    isLoading: overviewLoading,
    error: overviewError,
  } = useTeamOverview({
    teamSlug,
    metricId: selectedMetric,
    playerIds: players?.map((p) => p.user_id),
  });

  if (!isLoading && !metricsLoading && (!metrics || metrics.length === 0)) {
    return (
      <ChartCard
        title="No Metrics Available"
        description="No performance metrics have been defined yet. Set up training metrics to start comparing player progress across your team."
        icon={BarChart3}
        hasData={false}
        emptyMessage="Set up training metrics to start comparing player progress across your team"
        className="border-primary/20 bg-gradient-to-br from-primary/5 via-primary/3 to-primary/5"
      />
    );
  }

  // Enhanced No players selected message
  if (
    !isLoading &&
    multiPlayerData &&
    (!multiPlayerData.results ||
      Object.keys(multiPlayerData.results).length === 0) &&
    !teamSlug
  ) {
    return (
      <ChartCard
        title="Ready to Compare Players"
        description="Select multiple players from the list above to compare their performance and progress over time."
        icon={Users}
        hasData={false}
        emptyMessage="Choose 2+ players to begin comparing their performance"
        className="border-primary/20 bg-gradient-to-br from-primary/5 via-primary/3 to-primary/5"
        action={
          <Badge
            variant="outline"
            className="bg-gradient-to-r from-primary/10 to-primary/10 border-primary/30 text-primary px-4 py-2 text-sm font-semibold shadow-sm"
          >
            <Activity className="h-4 w-4 mr-2" />
            Choose 2+ players to begin
          </Badge>
        }
      />
    );
  }
  return (
    <div className="space-y-8">
      {/* Team Overview Section */}
      {(teamSlug || (players && players.length > 0)) && (
        <TeamOverviewCards
          overview={overviewData}
          isLoading={overviewLoading}
        />
      )}

      {/* Chart Section with Header */}
      <ChartCard
        title="Player Progress Comparison"
        description="Compare performance metrics across multiple players in your team"
        icon={BarChart3}
        className="border-primary/20"
        height={400}
        onClick={() =>
          openSummary({
            chartType: "comparison",
            fallbackTitle: "Player Progress Comparison",
          })
        }
        action={
          <MultiChartHeader
            metrics={metrics}
            selectedMetric={selectedMetric}
            setSelectedMetric={setSelectedMetric}
            dateRange={dateRange}
            onDateChange={setDateRange}
          />
        }
      >
        {isLoading ? (
          <div className="space-y-4 p-4">
            {/* Chart skeleton */}
            <div className="h-80 bg-muted animate-pulse rounded-lg" />

            {/* Legend skeleton */}
            <div className="flex flex-wrap gap-3 justify-center">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-muted animate-pulse rounded-full" />
                  <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <PlayerProgressMultiChart
            chartData={chartData}
            playerColors={playerColors}
            multiPlayerData={multiPlayerData}
            selectedMetricDetails={selectedMetricDetails}
          />
        )}
      </ChartCard>

      {/* Improvements Section */}
      <ChartCard
        title="Player Improvements Analysis"
        description="Detailed improvement metrics and trends for selected players"
        icon={TrendingUp}
        height={"auto"}
        className="border-primary/20"
        onClick={() =>
          openSummary({
            chartType: "improvements",
            fallbackTitle: "Player Improvements Analysis",
          })
        }
        action={
          isLoading ? (
            <div className="flex items-center gap-2">
              <div className="h-6 w-16 bg-muted animate-pulse rounded-full" />
              <div className="h-6 w-20 bg-muted animate-pulse rounded-full" />
            </div>
          ) : chartData.length > 0 ? (
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {Object.keys(multiPlayerData.results).length} Players
              </Badge>
              <Badge> {selectedMetricDetails?.name || "Metric"}</Badge>
            </div>
          ) : null
        }
      >
        {isLoading ? (
          <div className="space-y-6 p-4">
            {/* Player improvement cards skeleton */}
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted animate-pulse rounded-full" />
                    <div className="space-y-2">
                      <div className="h-5 w-32 bg-muted animate-pulse rounded" />
                      <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                    </div>
                  </div>
                  <div className="h-6 w-16 bg-muted animate-pulse rounded-full" />
                </div>

                {/* Progress bars skeleton */}
                <div className="space-y-3">
                  {Array.from({ length: 2 }, (_, j) => (
                    <div key={j} className="space-y-2">
                      <div className="flex justify-between">
                        <div className="h-3 w-20 bg-muted animate-pulse rounded" />
                        <div className="h-3 w-12 bg-muted animate-pulse rounded" />
                      </div>
                      <div className="w-full h-2 bg-muted animate-pulse rounded-full" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <PlayerImprovements
            multiPlayerData={multiPlayerData}
            selectedMetric={selectedMetric}
            selectedMetricDetails={selectedMetricDetails}
            playerColors={playerColors}
            isLoading={isLoading}
          />
        )}
      </ChartCard>

      <ChartSummaryModal
        open={isOpen}
        onOpenChange={setIsOpen}
        title={title}
        isLoading={summaryLoading}
        error={error}
        analysis={analysis}
        summaryLines={summaryLines}
      />
    </div>
  );
};

export default PlayerProgressMultiView;
