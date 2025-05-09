import React from "react";
import { Bar } from "react-chartjs-2";
import ChartCard from "../ChartCard";

const WinsChart = ({ data, isSetsScoring }) => {
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const title = isSetsScoring ? 'First Half vs Second Half Sets Won' : 'First Half vs Second Half Wins';
  const hasData = data.labels.length > 0;
  const emptyMessage = "No win data available";

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

export default WinsChart;