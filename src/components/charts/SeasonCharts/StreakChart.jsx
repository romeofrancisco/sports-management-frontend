import React from "react";
import { Bar } from "react-chartjs-2";
import ChartCard from "../ChartCard";

const StreakChart = ({ data, isSetsScoring }) => {
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

export default StreakChart;