import React, { useRef, useEffect, useMemo, useState } from "react";
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
import Loading from "../common/FullLoading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "../ui/separator";
import { useTheme } from "@/context/ThemeProvider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
);

const verticalLinePlugin = {
  id: "verticalLine",
  afterDraw(chart) {
    const tooltip = chart.tooltip;
    const xAxis = chart.scales.x;

    if (tooltip?._active?.length) {
      const ctx = chart.ctx;
      const index = tooltip._active[0].index;
      const x = xAxis.getPixelForTick(index);
      const topY = chart.scales.y.top;
      const bottomY = chart.scales.y.bottom;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x, topY);
      ctx.lineTo(x, bottomY);
      ctx.lineWidth = 1;
      ctx.strokeStyle = "#888";
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.restore();
    }
  },
};

const GameFlowChart = () => {
  const { theme } = useTheme();
  const { gameId } = useParams();
  const { data: flow, isLoading } = useGameFlow(gameId);
  const [hoverInfo, setHoverInfo] = useState(null);
  const [selectedPeriodIndex, setSelectedPeriodIndex] = useState(0);
  const chartRef = useRef(null);
  const hoverInfoRef = useRef(null);

  const { game = {}, scoring = { periods: [] }, events = {} } = flow || {};
  const { home: homeTeam = {}, away: awayTeam = {} } = game.teams || {};
  const isSetBased = scoring?.type === "sets";

  const getPeriodEvents = () => {
    if (isSetBased) {
      const currentPeriod = scoring.periods[selectedPeriodIndex];
      return events[currentPeriod?.number] || [];
    }
    return Array.isArray(events) ? events : Object.values(events).flat();
  };

  const periodEvents = getPeriodEvents();

  const buildChartData = () => {
    const labels = [];
    const homeScores = [];
    const awayScores = [];
    let homeTotal = 0;
    let awayTotal = 0;

    periodEvents.forEach((event) => {
      if (event.team_side === "home") homeTotal += event.point_value || 0;
      else awayTotal += event.point_value || 0;

      labels.push("");
      homeScores.push(homeTotal);
      awayScores.push(awayTotal);
    });

    scoring.periods?.reduce((start, period) => {
      const count = period.events_count || 0;
      const mid = start + Math.floor(count / 2);
      if (labels[mid] !== undefined) labels[mid] = period.label;
      return start + count;
    }, 0);

    return { labels, homeScores, awayScores };
  };

  const { labels, homeScores, awayScores } = buildChartData();

  const chartData = useMemo(
    () => ({
      labels: periodEvents.map((_, i) => i),
      datasets: [
        {
          label: homeTeam?.name || "Home",
          data: homeScores,
          borderColor: homeTeam?.color || "#1d4ed8",
          backgroundColor: homeTeam?.color || "#1d4ed8",
          tension: 0.3,
          pointRadius: 0,
          pointHoverRadius: 4,
        },
        {
          label: awayTeam?.name || "Away",
          data: awayScores,
          borderColor: awayTeam?.color || "#dc2626",
          backgroundColor: awayTeam?.color || "#dc2626",
          tension: 0.3,
          pointRadius: 0,
          pointHoverRadius: 4,
        },
      ],
    }),
    [periodEvents, homeScores, awayScores, homeTeam, awayTeam]
  );

  const gridColor = theme === "dark" ? "#374151" : "#e5e7eb";
  const tickColor = theme === "dark" ? "#d1d5db" : "#4b5563";

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      interaction: { mode: "index", intersect: false },
      animation: false,
      plugins: {
        tooltip: { enabled: false },
        legend: { position: "top" },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: gridColor },
          ticks: { color: tickColor },
          position: "right",
        },
        x: {
          ticks: {
            callback: (_, i) => labels[i] || "",
            color: tickColor,
            autoSkip: false,
            maxRotation: 0,
            minRotation: 0,
          },
          grid: {
            drawTicks: true,
            drawOnChartArea: true,
            color: (ctx) =>
              labels[ctx.tick.value] ? gridColor : "transparent",
          },
        },
      },
    }),
    [gridColor, tickColor, labels]
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      const chart = chartRef.current;
      if (!chart?.canvas) return;

      const handleHover = (e) => {
        const points = chart.getElementsAtEventForMode(
          e,
          "index",
          { intersect: false },
          false
        );
        if (points?.length) {
          const index = points[0].index;
          const event = periodEvents[index];

          if (
            !hoverInfoRef.current ||
            hoverInfoRef.current.event?.id !== event?.id
          ) {
            const newHover = {
              point: labels[index],
              homeScore: homeScores[index],
              awayScore: awayScores[index],
              event,
            };
            setHoverInfo(newHover);
            hoverInfoRef.current = newHover;
          }
        } else {
          setHoverInfo(null);
          hoverInfoRef.current = null;
        }
      };

      const canvas = chart.canvas;
      canvas.addEventListener("mousemove", handleHover);
      canvas.addEventListener("touchmove", handleHover, { passive: true });
      canvas.addEventListener("mouseleave", () => {
        setHoverInfo(null);
        hoverInfoRef.current = null;
      });

      return () => {
        canvas.removeEventListener("mousemove", handleHover);
        canvas.removeEventListener("touchmove", handleHover);
        canvas.removeEventListener("mouseleave", () => {});
      };
    }, 0);

    return () => clearTimeout(timeout);
  }, [periodEvents, labels, homeScores, awayScores]);

  const renderPeriodSelector = () =>
    isSetBased && (
      <Select
        value={selectedPeriodIndex.toString()}
        onValueChange={(val) => setSelectedPeriodIndex(Number(val))}
      >
        <SelectTrigger size="xs" className="text-xs h-8">
          <SelectValue placeholder="Select period" />
        </SelectTrigger>
        <SelectContent>
          {scoring.periods.map((p, i) => (
            <SelectItem key={p.number} value={i.toString()} className="text-xs">
              {p.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );

  const endEvent = periodEvents.findLast(
    (e) => e.stat_name === "End of Game" || e.stat_name === "End of Set"
  );

  const renderEventInfo = (event) => (
    <>
      <div className="flex items-center justify-between">
        <p>
          <span className={event.team_side === "home" ? "font-bold" : ""}>
            {homeTeam.abbreviation} {event.current_score.home}
          </span>{" "}
          -{" "}
          <span className={event.team_side === "away" ? "font-bold" : ""}>
            {awayTeam.abbreviation} {event.current_score.away}
          </span>
        </p>
        {renderPeriodSelector()}
      </div>
      <Separator className="min-h-px my-4" />
      <div>
        <p className="text-xs font-medium mb-2">{event.period_label}</p>
        {event.id ? (
          <p className="text-xs text-muted-foreground">
            {event.team} – {event.player} makes {event.stat_name.toLowerCase()}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">{event.stat_name}</p>
        )}
      </div>
    </>
  );

  if (isLoading) return <Loading />;
  if (!flow)
    return (
      <p className="text-center text-muted-foreground">
        No game data available
      </p>
    );

  return (
    <Card className="mt-5 gap-1 bg-muted/50">
      <CardHeader>
        <CardTitle className="text-xl flex justify-center font-bold items-center gap-2">
          Game Flow
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex-1 w-full min-w-0">
            <Line
              ref={chartRef}
              data={chartData}
              options={chartOptions}
              plugins={[verticalLinePlugin]}
              height={150}
            />
          </div>
          <div className="w-full md:w-64 border p-3 rounded-lg shadow-lg bg-muted/50 text-sm md:my-7">
            {hoverInfo?.event ? (
              renderEventInfo(hoverInfo.event)
            ) : endEvent ? (
              renderEventInfo(endEvent)
            ) : (
              <p className="text-muted-foreground">No game events available</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameFlowChart;
