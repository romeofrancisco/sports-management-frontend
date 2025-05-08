import React from "react";
import { Bar } from "react-chartjs-2";
import ChartCard from "../ChartCard";

const PointsChart = ({ data, isSetsScoring }) => {
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

  const title = isSetsScoring ? 'Points per Set' : 'Points Scored vs Conceded';
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

export default PointsChart;