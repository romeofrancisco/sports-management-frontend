import React from "react";
import { Users, CheckCircle, Target, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const QuickStatsOverview = ({ attendanceSummary, metricsSummary, playerImprovements }) => {
  return (
    <div className="animate-in fade-in-50 duration-500 delay-100">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="relative overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-card via-card/95 to-primary/5">
          <CardContent className="p-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-primary to-primary/80 rounded-lg shadow-lg">
                <Users className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">
                  Total Players
                </p>
                <p className="text-2xl font-bold text-primary">
                  {attendanceSummary.total_players}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-2 border-secondary/20 bg-gradient-to-br from-card via-card/95 to-secondary/5">
          <CardContent className="p-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-secondary to-secondary/80 rounded-lg shadow-lg">
                <CheckCircle className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">
                  Attendance Rate
                </p>
                <p className="text-2xl font-bold text-secondary">
                  {attendanceSummary.attendance_rate}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-card via-card/95 to-primary/5">
          <CardContent className="p-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-primary to-primary/80 rounded-lg shadow-lg">
                <Target className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">
                  Metrics Recorded
                </p>
                <p className="text-2xl font-bold text-primary">
                  {metricsSummary.total_metrics_recorded}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-2 border-secondary/20 bg-gradient-to-br from-card via-card/95 to-secondary/5">
          <CardContent className="p-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-secondary to-secondary/80 rounded-lg shadow-lg">
                <TrendingUp className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">
                  Players Improved
                </p>
                <p className="text-2xl font-bold text-secondary">
                  {playerImprovements
                    ? playerImprovements.filter(
                        (p) => p.overall_improvement_percentage > 0
                      ).length
                    : 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuickStatsOverview;
