import React from "react";
import { Bar } from "react-chartjs-2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {isSetsScoring ? 'Points per Set Differential' : 'Point Differential'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.labels.length > 0 ? (
          <div style={{ height: '300px' }}>
            <Bar data={data} options={horizontalBarOptions} />
          </div>
        ) : (
          <div className="flex items-center justify-center h-[300px]">
            <p className="text-muted-foreground">No differential data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DifferentialChart;