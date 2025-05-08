import React from "react";
import { Bar } from "react-chartjs-2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {isSetsScoring ? 'Points per Set' : 'Points Scored vs Conceded'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.labels.length > 0 ? (
          <div style={{ height: '300px' }}>
            <Bar data={data} options={barOptions} />
          </div>
        ) : (
          <div className="flex items-center justify-center h-[300px]">
            <p className="text-muted-foreground">No scoring data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PointsChart;