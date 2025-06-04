import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

const PerformanceMetricsCard = ({ metrics = {} }) => {
  const {
    performance_score = 0,
    improvement_rate = 0,
    consistency_rating = 0,
    trend = "stable"
  } = metrics;

  const getTrendIcon = (trendType) => {
    switch (trendType) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

  const getTrendColor = (trendType) => {
    switch (trendType) {
      case "up":
        return "text-green-600 border-green-600";
      case "down":
        return "text-red-600 border-red-600";
      default:
        return "text-blue-600 border-blue-600";
    }
  };

  return (
    <Card className="bg-gradient-to-br from-card via-card to-card/95 shadow-xl border-2 border-primary/20 transition-all duration-500 hover:shadow-2xl hover:border-primary/30">
      <CardHeader>
        <CardTitle className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Performance Metrics
        </CardTitle>
        <CardDescription>
          Team performance indicators and trends
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Performance Score</span>
            <span className="text-sm font-bold">{performance_score}%</span>
          </div>
          <Progress value={performance_score} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Improvement Rate</span>
            <span className="text-sm font-bold">{improvement_rate}%</span>
          </div>
          <Progress value={Math.abs(improvement_rate)} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Consistency</span>
            <span className="text-sm font-bold">{consistency_rating}%</span>
          </div>
          <Progress value={consistency_rating} className="h-2" />
        </div>

        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            {getTrendIcon(trend)}
            <span className="text-sm font-medium">Trend</span>
          </div>
          <Badge variant="outline" className={getTrendColor(trend)}>
            {trend.charAt(0).toUpperCase() + trend.slice(1)}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceMetricsCard;