import React from "react";
import { Calendar, Clock, Target, MapPin, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";

const SessionCard = ({ sessionGroup }) => {
  const { session, metrics: sessionMetrics, attendance_status, completion_status } = sessionGroup;
  const completedCount = sessionMetrics.filter(m => m.status === "completed").length;
  const totalCount = sessionMetrics.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-5 w-5 text-primary" />
              <CardTitle className="text-xl font-semibold text-foreground">
                {session.title}
              </CardTitle>
            </div>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                <span>{format(new Date(session.date), "EEEE, MMMM dd, yyyy")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3" />
                <span>{session.start_time} - {session.end_time}</span>
              </div>
              {session.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-3 w-3" />
                  <span>{session.location}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant={session.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
              {session.status?.toUpperCase()}
            </Badge>
            <div className="text-xs text-muted-foreground text-right">
              {completedCount}/{totalCount} completed
            </div>
            <Progress value={completionPercentage} className="w-20 h-1" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Metrics Grid */}
        <div className="space-y-3">
          <h4 className="font-medium text-foreground flex items-center gap-2">
            <Target className="h-4 w-4" />
            Assigned Metrics ({sessionMetrics.length})
          </h4>
          <div className="grid gap-3">
            {sessionMetrics.map((metric) => (
              <div
                key={metric.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{metric.metric_name}</span>
                    <Badge variant="outline" className="text-xs">
                      {metric.metric_category}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {metric.metric_unit?.name} ({metric.metric_unit?.code})
                    {metric.is_lower_better && " • Lower is better"}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {metric.is_recorded ? (
                    <div className="text-right">
                      <div className="font-medium text-green-600">
                        {metric.recorded_value} {metric.metric_unit?.code}
                      </div>
                      {metric.recorded_at && (
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(metric.recorded_at), "MMM dd, HH:mm")}
                        </div>
                      )}
                      {metric.improvement_percentage !== null && (
                        <div className="flex items-center gap-1 text-xs mt-1">
                          <TrendingUp className={`h-3 w-3 ${metric.improvement_percentage >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                          <span className={metric.improvement_percentage >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {metric.improvement_percentage >= 0 ? '+' : ''}{metric.improvement_percentage.toFixed(1)}%
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">Not recorded</span>
                  )}
                  <Badge 
                    variant={
                      metric.status === "completed" ? "default" :
                      metric.status === "in_progress" ? "secondary" :
                      metric.status === "assigned" ? "outline" :
                      metric.status === "missed" ? "destructive" : "outline"
                    }
                    className="text-xs"
                  >
                    {metric.status?.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Session Actions/Status */}
        {attendance_status && (
          <div className="flex items-center justify-between text-sm pt-2 border-t">
            <span className="text-muted-foreground">Attendance:</span>
            <Badge variant={attendance_status === 'present' ? 'default' : 'secondary'}>
              {attendance_status.toUpperCase()}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SessionCard;
