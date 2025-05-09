import React from "react";
import { Bar } from "react-chartjs-2";
import ChartCard from "../ChartCard";

const DifferentialChart = ({ data, isSetsScoring }) => {
  const horizontalBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y', // This makes the bars horizontal instead of vertical
    plugins: {
      legend: {
        display: false, // Hide legend since color indicates positive/negative
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.raw;
            return `${value > 0 ? '+' : ''}${value}`;
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      y: {
        ticks: {
          autoSkip: false,
          font: {
            size: 11
          }
        }
      }
    },
  };

  const title = isSetsScoring ? 'Points per Set Differential' : 'Point Differential';
  const hasData = data.labels.length > 0;
  const emptyMessage = "No differential data available";

  return (
    <ChartCard 
      title={title}
      hasData={hasData}
      emptyMessage={emptyMessage}
    >
      <Bar data={data} options={horizontalBarOptions} />
    </ChartCard>
  );
};

export default DifferentialChart;