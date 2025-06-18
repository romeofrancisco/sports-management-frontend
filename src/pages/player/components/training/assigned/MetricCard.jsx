import React from "react";
import { 
  Target, CheckCircle, XCircle, AlertCircle, Clock, 
  Calendar, MapPin, User, TrendingUp, Star 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

const MetricCard = ({ metric }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "assigned":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "missed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "in_progress":
        return <Clock className="h-4 w-4 text-blue-600" />;
      case "assigned":
        return <Target className="h-4 w-4 text-orange-600" />;
      case "missed":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg font-semibold text-foreground">
                {metric.metric_name}
              </CardTitle>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="outline" className="text-xs">
                {metric.metric_category || "General"}
              </Badge>
              <span>•</span>
              <span>{metric.metric_unit?.name || "No unit"} ({metric.metric_unit?.code || "N/A"})</span>
              {metric.is_lower_better && (
                <>
                  <span>•</span>
                  <span className="text-blue-600">Lower is better</span>
                </>
              )}
            </div>
            {metric.metric_description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {metric.metric_description}
              </p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge 
              className={`text-xs ${getStatusColor(metric.status)}`}
              variant="outline"
            >
              {getStatusIcon(metric.status)}
              <span className="ml-1">
                {metric.status?.replace('_', ' ').toUpperCase() || "UNKNOWN"}
              </span>
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Training Session Info */}
        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-medium text-foreground">{metric.session_title}</span>
            <Badge variant={metric.session_status === 'completed' ? 'default' : 'secondary'} className="text-xs">
              {metric.session_status?.toUpperCase()}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-foreground">
                {format(new Date(metric.session_date), "EEEE, MMMM dd, yyyy")}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-foreground">
                {metric.session_start_time} - {metric.session_end_time}
              </span>
            </div>

            {metric.session_location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-foreground">{metric.session_location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Recorded Value */}
        <div className="space-y-2">
          <span className="text-sm font-medium text-foreground">Recorded Value:</span>
          {metric.is_recorded ? (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-lg font-bold text-green-800">
                    {metric.recorded_value} {metric.metric_unit?.code || ""}
                  </span>
                  {metric.recorded_at && (
                    <div className="text-xs text-green-600 mt-1">
                      Recorded on {format(new Date(metric.recorded_at), "MMM dd, yyyy 'at' HH:mm")}
                    </div>
                  )}
                  {metric.recorded_by && (
                    <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                      <User className="h-3 w-3" />
                      Recorded by {metric.recorded_by}
                    </div>
                  )}
                </div>
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              {metric.notes && (
                <div className="mt-2 text-sm text-green-700">
                  <strong>Notes:</strong> {metric.notes}
                </div>
              )}
            </div>
          ) : (
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">No value recorded yet</span>
                {metric.status === 'missed' ? (
                  <XCircle className="h-6 w-6 text-red-500" />
                ) : (
                  <AlertCircle className="h-6 w-6 text-gray-400" />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Improvement Data */}
        {metric.is_recorded && (metric.improvement_from_last !== null || metric.improvement_percentage !== null) && (
          <div className="space-y-2">
            <span className="text-sm font-medium text-foreground">Performance Change:</span>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex items-center justify-between">
                <div>
                  {metric.improvement_percentage !== null && (
                    <div className="flex items-center gap-2">
                      <TrendingUp className={`h-4 w-4 ${metric.improvement_percentage >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                      <span className={`font-medium ${metric.improvement_percentage >= 0 ? 'text-green-800' : 'text-red-800'}`}>
                        {metric.improvement_percentage >= 0 ? '+' : ''}{metric.improvement_percentage.toFixed(2)}%
                      </span>
                    </div>
                  )}
                  {metric.improvement_from_last !== null && (
                    <div className="text-xs text-blue-600 mt-1">
                      {metric.is_lower_better ? 
                        (metric.improvement_from_last < 0 ? 'Improved by' : 'Slower by') :
                        (metric.improvement_from_last > 0 ? 'Improved by' : 'Decreased by')
                      } {Math.abs(metric.improvement_from_last).toFixed(2)} {metric.metric_unit?.code || ''}
                    </div>
                  )}
                </div>
                {metric.improvement_percentage !== null && (
                  <div className={`text-xs px-2 py-1 rounded ${
                    metric.improvement_percentage >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {metric.improvement_percentage >= 0 ? 'Better' : 'Worse'}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Attendance Status */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Attendance:</span>
          <Badge variant={metric.attendance_status === 'present' ? 'default' : 'secondary'}>
            {metric.attendance_status?.toUpperCase() || 'PENDING'}
          </Badge>
        </div>

        {/* Action Messages */}
        {metric.status === "missed" && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-800 font-medium">Training Missed</span>
            </div>
            <p className="text-xs text-red-700 mt-1">
              {metric.status_reason || "This metric was not recorded because the training session was missed or you were absent."}
            </p>
          </div>
        )}

        {metric.can_record && metric.status === "pending" && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-800 font-medium">Ready to Record</span>
            </div>
            <p className="text-xs text-blue-700 mt-1">
              {metric.status_reason || "This metric is ready to be recorded during the training session."}
            </p>
          </div>
        )}

        {metric.status === "completed" && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-800 font-medium">Metric Completed</span>
            </div>
            <p className="text-xs text-green-700 mt-1">
              {metric.status_reason || "Great job! This metric has been successfully recorded."}
            </p>
          </div>
        )}

        {/* Priority and Weight Info */}
        {(metric.weight || metric.metric_priority) && (
          <div className="flex items-center justify-between text-sm">
            {metric.weight && (
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-yellow-500" />
                <span className="text-muted-foreground">Weight: {metric.weight}</span>
              </div>
            )}
            {metric.metric_priority && (
              <Badge variant={
                metric.metric_priority === 'high' ? 'destructive' :
                metric.metric_priority === 'medium' ? 'secondary' : 'outline'
              } className="text-xs">
                {metric.metric_priority?.toUpperCase()} PRIORITY
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;
