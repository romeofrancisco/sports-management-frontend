import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, UserCheck, TrendingUp } from "lucide-react";

const PerformanceOverview = ({ analytics }) => {
  return (
    <Card className="bg-gradient-to-br from-card via-card to-card/95 shadow-xl border-2 border-primary/20 transition-all duration-500 hover:shadow-2xl hover:border-primary/30 relative overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/10 to-transparent rounded-full blur-2xl opacity-70"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-xl opacity-60"></div>

      <CardHeader className="relative">
        <CardTitle className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Performance Overview
        </CardTitle>
        <CardDescription>
          Current season performance metrics
        </CardDescription>
      </CardHeader>
      <CardContent className="relative space-y-4">        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Games Won</span>
          </div>          <span className="text-sm font-bold text-foreground">
            {analytics?.total_wins || 0}
          </span>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-secondary" />
            <span className="text-sm font-medium">Avg Attendance</span>
          </div>
          <span className="text-sm font-bold text-foreground">{analytics?.average_attendance || 0}%</span>
        </div>        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium">Win Rate</span>
          </div>
          <span className="text-sm font-bold text-foreground">{analytics?.win_rate || 0}%</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceOverview;
