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

const GameFlowChart = ({ game }) => {
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
  const { game: gameData = {}, scoring = { periods: [] }, events = {} } = flow || {};
  const { home: homeTeam = {}, away: awayTeam = {} } = gameData.teams || {};
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

  const endEvent = periodEvents.findLast(
    (e) => e.stat_name === "End of Game" || e.stat_name === "End of Set"
  );

  return (
    <Card className="gap-1 max-w-screen lg:max-w-none">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2 border-b border-dashed pb-2">
          Game Flow
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        <div className="flex flex-col gap-2">
          <div ref={containerRef} className="flex-1 w-full h-[20rem] min-w-0">
            <Line
              ref={chartRef}
              data={chartData}
              options={chartOptions}
              plugins={[verticalLinePlugin]}
              height={300}
            />
          </div>
          <div className="w-full border p-3 rounded-lg shadow-lg text-sm min-h-[160px]">
            <EventInfo
              event={hoverInfo?.event || endEvent}
              game={game}
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
