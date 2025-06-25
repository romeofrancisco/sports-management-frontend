import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Doughnut, Bar } from "react-chartjs-2";
import { BarChart, Activity, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const PlayerAttendanceCharts = ({
  attendanceDistribution,
  distributionChartOptions,
  currentChartData,
  currentChartOptions,
  chartType,
  setChartType,
}) => (
  <div className="space-y-6">
    <div className="grid gap-6 lg:grid-cols-5">
      {/* Progress/Trends Chart */}
      <Card className="relative overflow-hidden w-full col-span-5 lg:col-span-3">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent" />
        <CardHeader className="relative z-10 flex gap-2 flex-row sm:items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-3 rounded-lg bg-primary shadow-lg">
              <Activity className="size-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                Attendance Trends
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Track attendance patterns
              </CardDescription>
            </div>
          </div>
          <div className="flex gap-2 mt-2 sm:mt-0">
            <Button
              variant={chartType === "summary" ? "default" : "outline"}
              size="sm"
              onClick={() => setChartType("summary")}
              className={cn(
                "flex items-center gap-2",
                chartType === "summary"
                  ? "bg-primary/90 hover:bg-primary text-primary-foreground"
                  : "hover:bg-primary/60 hover:text-primary-foreground"
              )}
            >
              <BarChart className="h-3 w-3" />
              <span className="hidden sm:inline">Summary</span>
            </Button>
            <Button
              variant={chartType === "timeline" ? "default" : "outline"}
              size="sm"
              onClick={() => setChartType("timeline")}
              className={cn(
                "flex items-center gap-2",
                chartType === "timeline"
                  ? "bg-secondary/90 hover:bg-secondary text-secondary-foreground"
                  : "hover:bg-secondary/60 k:hover:text-secondary-foreground"
              )}
            >
              <Activity className="h-3 w-3" />
              <span className="hidden sm:inline">Timeline</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="flex flex-col gap-4">
            {currentChartData ? (
              <div className="h-80">
                <Bar data={currentChartData} options={currentChartOptions} />
              </div>
            ) : (
              <div className="h-80 flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                  <BarChart3 className="h-8 w-8 text-slate-400 dark:text-slate-500" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-slate-500 dark:text-slate-400 font-medium">
                    No recent session data available
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    Data will appear once sessions are recorded
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      {/* Attendance Distribution Chart */}
      <Card className="relative overflow-hidden w-full col-span-5 lg:col-span-2">
        <CardHeader className="relative z-10">
          <div className="flex items-center gap-2">
            <div className="p-3 rounded-lg bg-primary shadow-lg">
              <BarChart className="size-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                Attendance Distribution
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Personal attendance breakdown
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="h-80 w-full flex items-center justify-center">
            <Doughnut
              data={attendanceDistribution}
              options={distributionChartOptions}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default PlayerAttendanceCharts;
