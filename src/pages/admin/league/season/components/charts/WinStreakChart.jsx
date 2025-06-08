import React from "react";
import { Bar } from "react-chartjs-2";
import ChartCard from "@/components/charts/ChartCard";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

/**
 * Win Streak Chart component
 * Displays the longest win streaks for teams
 * @param {Object} data - Chart data with labels and datasets
 * @param {boolean} isSetsScoring - Whether the sport uses sets scoring
 */
const WinStreakChart = ({ data, isSetsScoring }) => {
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Hide legend as we have only one dataset
      },
      tooltip: {
        callbacks: {
          title: function(context) {
            return context[0].label;
          },
          label: function(context) {
            const value = context.parsed.y;
            const label = isSetsScoring ? 'sets' : 'games';
            return `Longest streak: ${value} ${label}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0, // Only show integers
          stepSize: 1
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
  };

  const title = isSetsScoring ? 'Longest Sets Win Streaks' : 'Longest Win Streaks';
  const hasData = data.labels.length > 0;
  const emptyMessage = "No streak data available";

  return (
    <ChartCard 
      title={title}
      hasData={hasData}
      emptyMessage={emptyMessage}
      className="lg:col-span-2"
    >
      <Bar data={data} options={barOptions} />
    </ChartCard>
  );
};

export default WinStreakChart;
