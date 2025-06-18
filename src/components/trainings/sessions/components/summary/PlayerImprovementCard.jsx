import React from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  CheckCircle, 
  Clock, 
  UserX, 
  AlertTriangle, 
  Users,
  TrendingUp,
  TrendingDown
} from "lucide-react";

const PlayerImprovementCard = ({ player }) => {
  if (!player) return null;

  const getAttendanceConfig = (status) => {
    const configs = {
      present: { icon: CheckCircle, variant: "default" },
      late: { icon: Clock, variant: "secondary" },
      absent: { icon: UserX, variant: "destructive" },
      excused: { icon: AlertTriangle, variant: "outline" },
      pending: { icon: Users, variant: "secondary" }
    };
    return configs[status] || configs.pending;
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const statusConfig = getAttendanceConfig(player.attendance_status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      {/* Player Header */}
      <div className="flex items-start gap-3 mb-4">
        <Avatar className="w-12 h-12 border-2 border-gray-200">
          <AvatarImage src={player.profile_image} alt={player.name} />
          <AvatarFallback className="bg-gray-100 text-gray-700 font-semibold">
            {getInitials(player.name)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 text-lg mb-1">
            {player.name}
          </h4>
          <Badge variant={statusConfig.variant} className="text-xs">
            <StatusIcon className="h-3 w-3 mr-1" />
            {player.attendance_status.charAt(0).toUpperCase() + player.attendance_status.slice(1)}
          </Badge>
        </div>
      </div>

      {/* Metrics Section */}
      {player.metrics && player.metrics.length > 0 ? (
        <div className="space-y-3">
          <h5 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
            Performance Metrics
          </h5>
          <div className="space-y-2">
            {player.metrics.map((metric, index) => (
              <div key={index} className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900 text-sm">
                    {metric.metric_name}
                  </span>
                  {metric.improvement_percentage !== null && (
                    <div className={`flex items-center gap-1 text-xs font-semibold ${
                      metric.improvement_percentage > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {metric.improvement_percentage > 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {Math.abs(metric.improvement_percentage).toFixed(1)}%
                    </div>
                  )}
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Current: {metric.current_value} {metric.unit}</span>
                  {metric.previous_value && (
                    <span>Previous: {metric.previous_value} {metric.unit}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">No metrics recorded</p>
        </div>
      )}

      {/* Notes Section */}
      {player.notes && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h5 className="text-sm font-semibold text-gray-600 mb-2">Notes</h5>
          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
            {player.notes}
          </p>
        </div>
      )}
    </div>
  );
};

export default PlayerImprovementCard;
