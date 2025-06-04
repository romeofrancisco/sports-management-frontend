import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  Clock, 
  Target, 
  TrendingUp, 
  Users, 
  CheckCircle,
  AlertCircle,
  Activity
} from "lucide-react";

const TrainingAnalyticsCard = ({ trainingData = {} }) => {
  const {
    total_sessions = 0,
    completed_sessions = 0,
    upcoming_sessions = 0,
    average_attendance = 0,
    training_effectiveness = 0,
    improvement_rate = 0,
    recent_sessions = [],
    performance_metrics = {}
  } = trainingData;

  const completionRate = total_sessions > 0 ? (completed_sessions / total_sessions) * 100 : 0;
  
  const getEffectivenessStatus = () => {
    if (training_effectiveness >= 80) return { label: "Excellent", color: "text-green-600 border-green-600" };
    if (training_effectiveness >= 60) return { label: "Good", color: "text-blue-600 border-blue-600" };
    if (training_effectiveness >= 40) return { label: "Average", color: "text-yellow-600 border-yellow-600" };
    return { label: "Needs Improvement", color: "text-red-600 border-red-600" };
  };

  const getAttendanceStatus = () => {
    if (average_attendance >= 90) return { label: "Excellent", color: "text-green-600" };
    if (average_attendance >= 75) return { label: "Good", color: "text-blue-600" };
    if (average_attendance >= 60) return { label: "Fair", color: "text-yellow-600" };
    return { label: "Poor", color: "text-red-600" };
  };

  const effectivenessStatus = getEffectivenessStatus();
  const attendanceStatus = getAttendanceStatus();

  return (
    <Card className="bg-gradient-to-br from-card via-card to-card/95 shadow-xl border-2 border-primary/20 transition-all duration-500 hover:shadow-2xl hover:border-primary/30">
      <CardHeader>
        <CardTitle className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Training Analytics
        </CardTitle>
        <CardDescription>
          Training session performance and insights
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Session Overview */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <Calendar className="h-5 w-5 text-blue-600 mx-auto mb-1" />
            <p className="text-sm font-medium text-blue-700 dark:text-blue-400">Total</p>
            <p className="text-lg font-bold text-blue-800 dark:text-blue-300">{total_sessions}</p>
          </div>
          
          <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
            <CheckCircle className="h-5 w-5 text-green-600 mx-auto mb-1" />
            <p className="text-sm font-medium text-green-700 dark:text-green-400">Completed</p>
            <p className="text-lg font-bold text-green-800 dark:text-green-300">{completed_sessions}</p>
          </div>
          
          <div className="text-center p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
            <Clock className="h-5 w-5 text-orange-600 mx-auto mb-1" />
            <p className="text-sm font-medium text-orange-700 dark:text-orange-400">Upcoming</p>
            <p className="text-lg font-bold text-orange-800 dark:text-orange-300">{upcoming_sessions}</p>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Completion Rate</span>
            </div>
            <span className="text-sm font-bold">{Math.round(completionRate)}%</span>
          </div>
          <Progress value={completionRate} className="h-2" />
        </div>

        {/* Average Attendance */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-secondary" />
              <span className="text-sm font-medium">Average Attendance</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">{average_attendance}%</span>
              <Badge variant="outline" className={attendanceStatus.color}>
                {attendanceStatus.label}
              </Badge>
            </div>
          </div>
          <Progress value={average_attendance} className="h-2" />
        </div>

        {/* Training Effectiveness */}
        <div className="p-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Training Effectiveness</span>
            </div>
            <Badge variant="outline" className={effectivenessStatus.color}>
              {effectivenessStatus.label}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Performance Score</span>
            <span className="text-sm font-bold">{training_effectiveness}%</span>
          </div>
          <Progress value={training_effectiveness} className="h-2 mt-2" />
        </div>

        {/* Improvement Rate */}
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium">Improvement Rate</span>
          </div>
          <div className="text-right">
            <span className="text-sm font-bold text-green-600">+{improvement_rate}%</span>
            <p className="text-xs text-muted-foreground">vs last month</p>
          </div>
        </div>

        {/* Recent Sessions */}
        {recent_sessions.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Recent Sessions
            </h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {recent_sessions.slice(0, 3).map((session, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                  <div>
                    <p className="text-xs font-medium">
                      {session.title || `Training Session ${index + 1}`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {session.date || 'Recent'} • {session.duration || '90 min'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {session.status === 'completed' && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                    {session.status === 'upcoming' && (
                      <Clock className="h-4 w-4 text-orange-500" />
                    )}
                    {session.status === 'cancelled' && (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-xs font-medium">
                      {session.attendance || 0}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Performance Metrics Summary */}
        {Object.keys(performance_metrics).length > 0 && (
          <div className="pt-3 border-t border-border">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-muted-foreground">Avg Duration: </span>
                <span className="font-medium">{performance_metrics.avg_duration || 'N/A'}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Success Rate: </span>
                <span className="font-medium">{performance_metrics.success_rate || 0}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {total_sessions === 0 && (
          <div className="text-center py-6">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No training data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrainingAnalyticsCard;