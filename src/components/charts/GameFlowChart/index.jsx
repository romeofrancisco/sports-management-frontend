import React, { useRef, useMemo, useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";
import { useParams } from "react-router";
import { useGameFlow } from "@/hooks/useCharts";
import { useTheme } from "@/context/ThemeProvider";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loading from "@/components/common/FullLoading";
import EventInfo from "./EventInfo";
import { verticalLinePlugin } from "./ChartPlugins";
import { createChartData, createChartOptions } from "./ChartConfig";
import { getPeriodEvents, buildChartData } from "./utils";
import { useChartInteractions } from "./useChartInteractions";

// Register ChartJS components
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
);

const GameFlowChart = () => {
  const { theme } = useTheme();
  const { gameId } = useParams();
  const { data: flow, isLoading } = useGameFlow(gameId);
  const [selectedPeriodIndex, setSelectedPeriodIndex] = useState(0);
  const chartRef = useRef(null);
  const containerRef = useRef(null);

  // Theme colors (these don't depend on flow data)
  const gridColor = theme === "dark" ? "#374151" : "#e5e7eb";
  const tickColor = theme === "dark" ? "#d1d5db" : "#4b5563";

  // Add resize observer
  useEffect(() => {
    if (!chartRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      if (chartRef.current) {
        chartRef.current.resize();
      }
    });

    const container = containerRef.current;
    if (container) {
      resizeObserver.observe(container);
    }

    return () => {
      if (container) {
        resizeObserver.unobserve(container);
      }
      resizeObserver.disconnect();
    };
  }, []);

  // Data processing (safe to do with null flow)
  const { game = {}, scoring = { periods: [] }, events = {} } = flow || {};
  const { home: homeTeam = {}, away: awayTeam = {} } = game.teams || {};
  const isSetBased = scoring?.type === "sets";

  // Process chart data (safe with empty data)
  const periodEvents = getPeriodEvents(
    events,
    scoring,
    selectedPeriodIndex,
    isSetBased
  );
  const { labels, homeScores, awayScores } = buildChartData(
    periodEvents,
    scoring
  );

  // Custom hooks (these handle null/empty data safely)
  const { hoverInfo } = useChartInteractions(chartRef, periodEvents, labels, {
    homeScores,
    awayScores,
  });

  // Memoized configurations (safe with empty data)
  const chartData = useMemo(
    () =>
      createChartData(periodEvents, homeScores, awayScores, homeTeam, awayTeam),
    [periodEvents, homeScores, awayScores, homeTeam, awayTeam]
  );

  const chartOptions = useMemo(
    () => createChartOptions(gridColor, tickColor, labels),
    [gridColor, tickColor, labels]
  );

  // Early returns AFTER all hooks
  if (isLoading) return <Loading />;
  if (!flow)
    return (
      <p className="text-center text-muted-foreground">
        No game data available
      </p>
    );

  const endEvent = periodEvents.findLast(
    (e) => e.stat_name === "End of Game" || e.stat_name === "End of Set"
  );

  return (
    <Card className="gap-1 bg-muted/50">
      <CardHeader>
        <CardTitle className="text-xl flex justify-center font-bold items-center gap-2">
          Game Flow
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        <div className="flex flex-col md:flex-row gap-2">
          <div ref={containerRef} className="flex-1 w-full min-w-0 h-[40vh] md:h-[50vh] md:max-h-[18rem]">
            <Line
              ref={chartRef}
              data={chartData}
              options={chartOptions}
              plugins={[verticalLinePlugin]}
            />
          </div>
          <div className="w-full md:w-54 border p-3 rounded-lg shadow-lg bg-muted/50 text-sm md:my-7 min-h-[200px]">
            <EventInfo
              event={hoverInfo?.event || endEvent}
              homeTeam={homeTeam}
              awayTeam={awayTeam}
              isSetBased={isSetBased}
              scoring={scoring}
              selectedPeriodIndex={selectedPeriodIndex}
              onPeriodChange={setSelectedPeriodIndex}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameFlowChart;
