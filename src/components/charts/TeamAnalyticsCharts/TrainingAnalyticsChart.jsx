import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Target, ChartColumn } from "lucide-react";
import { COLORS } from "./constants";
import { getDefaultChartOptions, getChartTheme } from "./utils";

export const TrainingAnalyticsChart = ({
  data,
  title = "Training Analytics",
}) => {
  if (!data || data.length === 0) {
    return (
      <Card className="border-2 border-primary/20">
        <CardHeader className="relative">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg border border-primary/30 transition-all duration-300 hover:scale-110 hover:shadow-xl">
              <Target className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {title}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Weekly training sessions and attendance rates
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <ChartColumn className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium">
              No training data
            </p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Training analytics will appear here after sessions are completed.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = {
    labels: data.map((item) => item.week),
    datasets: [
      {
        label: "Training Sessions",
        data: data.map((item) => item.sessions),
        backgroundColor: `${COLORS.primary}80`,
        borderColor: COLORS.primary,
        borderWidth: 2,
        borderRadius: 4,
        borderSkipped: false,
      },
      {
        label: "Attendance Rate %",
        data: data.map((item) => item.attendance_rate),
        backgroundColor: `${COLORS.secondary}80`,
        borderColor: COLORS.secondary,
        borderWidth: 2,
        borderRadius: 4,
        borderSkipped: false,
        yAxisID: "y1",
      },
    ],
  };

  const chartOptions = {
    ...getDefaultChartOptions(),
    scales: {
      ...getDefaultChartOptions().scales,
      y: {
        ...getDefaultChartOptions().scales.y,
        type: "linear",
        display: true,
        position: "left",
        title: {
          display: true,
          text: "Training Sessions",
          color: getChartTheme().textColor,
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        min: 0,
        max: 100,
        title: {
          display: true,
          text: "Attendance Rate (%)",
          color: getChartTheme().textColor,
        },
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: getChartTheme().textColor,
        },
      },
    },
    plugins: {
      ...getDefaultChartOptions().plugins,
      legend: {
        display: true,
        position: "bottom",
        labels: {
          color: getChartTheme().textColor,
          usePointStyle: true,
          padding: 20,
        },
      },
    },
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="relative">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg border border-primary/30 transition-all duration-300 hover:scale-110 hover:shadow-xl">
            <Target className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {title}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Weekly training sessions and attendance rates
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </CardContent>
    </Card>
  );
};
