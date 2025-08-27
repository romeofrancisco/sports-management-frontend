import React from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { COLORS } from "./constants";

export const TeamStatsBreakdownChart = ({
  data,
  title = "Team Statistics",
}) => {
  if (!data || data.length === 0) {
    return (
      <Card className="border-2 border-primary/20">
        <CardHeader className="pb-4 relative">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg border border-primary/30 transition-all duration-300 hover:scale-110 hover:shadow-xl">
              <Trophy className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {title}
              </CardTitle>
              <CardDescription className="text-muted-foreground font-medium">
                Statistical breakdown of team performance
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-muted-foreground">No statistics data available</p>
        </CardContent>
      </Card>
    );
  }

  const chartData = {
    labels: data.map((item) => item.name),
    datasets: [
      {
        data: data.map((item) => item.value),
        backgroundColor: [
          `${COLORS.primary}80`,
          `${COLORS.secondary}80`,
          `${COLORS.primary}60`,
          `${COLORS.secondary}60`,
        ].slice(0, data.length),
        borderColor: [
          COLORS.primary,
          COLORS.secondary,
          COLORS.primary,
          COLORS.secondary,
        ].slice(0, data.length),
        borderWidth: 2,
        hoverBackgroundColor: [
          `${COLORS.primary}CC`,
          `${COLORS.secondary}CC`,
          `${COLORS.primary}AA`,
          `${COLORS.secondary}AA`,
        ].slice(0, data.length),
        hoverBorderWidth: 3,
      },
    ],
  };
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "rgba(255, 255, 255, 0.2)",
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function (context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="relative">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg border border-primary/30 transition-all duration-300 hover:scale-110 hover:shadow-xl">
            <Trophy className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {title}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Wins and losses distribution
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <Doughnut data={chartData} options={chartOptions} />
        </div>
      </CardContent>
    </Card>
  );
};
