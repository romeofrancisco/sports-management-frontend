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
 * Points Analysis Chart component
 * Displays points scored vs points conceded for teams
 * @param {Object} data - Chart data with labels and datasets
 * @param {boolean} isSetsScoring - Whether the sport uses sets scoring
 */
const PointsAnalysisChart = ({ data, isSetsScoring }) => {
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          title: function(context) {
            return context[0].label;
          },
          label: function(context) {
            const datasetLabel = context.dataset.label;
            return `${datasetLabel}: ${context.parsed.y}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
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

  const title = isSetsScoring ? 'Points per Set Analysis' : 'Points Scored vs Conceded';
  const hasData = data.labels.length > 0;
  const emptyMessage = "No scoring data available";

  return (
    <ChartCard 
      title={title}
      hasData={hasData}
      emptyMessage={emptyMessage}
    >
      <Bar data={data} options={barOptions} />
    </ChartCard>
  );
};

export default PointsAnalysisChart;
