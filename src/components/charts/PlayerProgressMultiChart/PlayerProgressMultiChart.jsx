import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { ChartSpline } from "lucide-react";

import { formatShortDate } from "@/utils/formatDate";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  ChartLegend,
  Filler
);

// Vertical line plugin for hover (like ProgressChart)
const verticalLinePlugin = {
  id: "verticalLine",
  afterDraw(chart) {
    if (chart.hoverIndex !== undefined) {
      const ctx = chart.ctx;
      const topY = chart.scales.y.top;
      const bottomY = chart.scales.y.bottom;

      // Get the x position from the scale using the data index
      const xPosition = chart.scales.x.getPixelForValue(chart.hoverIndex);

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(xPosition, topY);
      ctx.lineTo(xPosition, bottomY);
      ctx.lineWidth = 1;
      ctx.strokeStyle =
        getComputedStyle(document.documentElement).getPropertyValue(
          "--primary"
        ) || "#8B0000";
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.restore();
    }
  },
};

/**
 * PlayerProgressMultiChart component for displaying progress comparison between multiple players
 *
 * @param {Object} props - Component props
 * @param {Array} props.chartData - Processed chart data
 * @param {Object} props.playerColors - Object mapping player IDs to colors
 * @param {Object} props.multiPlayerData - Raw multi-player data from API
 * @param {Object} props.selectedMetricDetails - Details about the selected metric
 * @returns {JSX.Element} - Rendered chart component
 */
const PlayerProgressMultiChart = ({
  chartData,
  playerColors,
  multiPlayerData,
  selectedMetricDetails,
}) => {
  if (!chartData || chartData.length === 0 || !multiPlayerData?.results) {
    return (
      <div className="text-center py-12 h-[370px] flex flex-col items-center justify-center border-2 border-dashed rounded-md">
        <div className="p-4 bg-muted rounded-full mb-4 mx-auto w-fit">
          <ChartSpline className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-muted-foreground mb-2">
          No Performance Data to Compare
        </h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
          The selected players don't have enough training session data for the chosen metric. 
          Players need at least 2 recorded sessions to generate comparison charts.
        </p>
      </div>
    );
  }

  // Calculate max value from all datasets to add padding
  const maxValue = Math.max(
    ...Object.entries(multiPlayerData.results).flatMap(
      ([playerId, playerData]) => chartData.map((point) => point[playerId] || 0)
    )
  );

  // Add 20% padding to the max value for better spacing
  const suggestedMax = Math.ceil(maxValue * 1.2);

  return (
    <div className="h-[400px]">
      <Line
        data={{
          labels: chartData.map((point) => point.date),
          datasets: Object.entries(multiPlayerData.results).map(
            ([playerId, playerData]) => {
              return {
                label: playerData.player_name,
                data: chartData.map((point) => point[playerId]),
                borderColor: playerColors[playerId],
                backgroundColor: `${playerColors[playerId]}20`,
                borderWidth: 1.5,
                pointRadius: 0,
                pointHoverRadius: 5,
                tension: 0.3,
                spanGaps: true,
              };
            }
          ),
        }}
        plugins={[verticalLinePlugin]}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            intersect: false,
            mode: "index",
          },
          scales: {
            y: {
              beginAtZero: selectedMetricDetails?.is_lower_better
                ? false
                : true,
              max: suggestedMax,
              title: {
                display: true,
                text: selectedMetricDetails?.name || "Value",
              },
              ticks: {
                font: {
                  size: 12,
                },
              },
            },
            x: {
              ticks: {
                display: false,
                font: {
                  size: 12,
                },
              },
            },
          },
          plugins: {
            legend: {
              position: "top",
            },
            tooltip: {
              mode: "index",
              intersect: false,
              callbacks: {
                title: function (context) {
                  return `Date: ${formatShortDate(context[0].label)}`;
                },
                label: function (context) {
                  // Show all players' improvement at this x (date)
                  const value = context.parsed.y;
                  const unit =
                    selectedMetricDetails?.metric_unit_data?.code || "%";
                  return `${context.dataset.label} ${value.toFixed(2)} ${unit}`;
                },
              },
            },
          },
          onHover: (event, activeElements, chart) => {
            if (activeElements.length > 0) {
              const dataIndex = activeElements[0].index;
              // Only update if the hover position has actually changed
              if (chart.hoverIndex !== dataIndex) {
                chart.hoverIndex = dataIndex;
                chart.draw();
              }
            }
          },
          onHoverLeave: (event, activeElements, chart) => {
            if (chart.hoverIndex !== undefined) {
              chart.hoverIndex = undefined;
              chart.draw();
            }
          },
        }}
      />
    </div>
  );
};

export default PlayerProgressMultiChart;
