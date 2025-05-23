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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

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
  selectedMetricDetails 
}) => {  if (!chartData || chartData.length === 0 || !multiPlayerData?.results) {
    return (
      <div className="h-[400px] flex items-center justify-center text-muted-foreground">
        No data available for the selected metric and date range
      </div>
    );
  }
  
  // Custom title for Overall metric
  const chartTitle = selectedMetricDetails?.name === "Overall Performance" 
    ? "Overall Player Progress" 
    : "Player Progress Comparison";

  return (
    <div className="h-[400px] mt-4">
      <Line
        data={{
          labels: chartData.map((point) => point.date),
          datasets: Object.entries(multiPlayerData.results).map(([playerId, playerData]) => {
            return {
              label: playerData.player_name,
              data: chartData.map((point) => point[playerId]),
              borderColor: playerColors[playerId],
              backgroundColor: `${playerColors[playerId]}20`,
              borderWidth: 1.5,
              pointRadius: 2,
              pointHoverRadius: 8,
              tension: 0.3,
              spanGaps: true,
            };
          }),
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: selectedMetricDetails?.is_lower_better ? false : true,
              title: {
                display: true,
                text: selectedMetricDetails?.unit || "Value",
              },
              ticks: {
                font: {
                  size: 12,
                },
              },
            },
            x: {
              ticks: {
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
              callbacks: {
                label: function (context) {
                  return `${context.dataset.label}: ${context.parsed.y} ${selectedMetricDetails?.unit || ""}`;
                },
              },
            },
          },
        }}
      />
    </div>
  );
};

export default PlayerProgressMultiChart;
