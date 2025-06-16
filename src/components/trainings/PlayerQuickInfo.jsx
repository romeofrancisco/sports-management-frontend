import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Trophy, 
  Target, 
  GraduationCap, 
  Ruler, 
  Weight,
  Calendar,
  TrendingUp,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

const PlayerQuickInfo = ({
  player,
  showProgress = false,
  showStatus = false,
  status = null, // "completed", "pending", "incomplete"
  metricsCount = 0,
  completedMetrics = 0,
  className,
  ...props
}) => {  // Extract player information safely
  const playerInfo = {
    firstName: player?.first_name || player?.user?.first_name || "",
    lastName: player?.last_name || player?.user?.last_name || "",
    fullName: player?.full_name || player?.player_name || 
      `${player?.first_name || player?.user?.first_name || ""} ${player?.last_name || player?.user?.last_name || ""}`.trim(),
    jerseyNumber: player?.jersey_number,
    position: player?.position || (player?.positions && player?.positions[0]?.name),
    teamName: player?.team_name || player?.team?.name,
    yearLevel: player?.year_level,
    course: player?.course,
    height: player?.height,
    weight: player?.weight,
    attendanceRate: player?.attendance_rate,
    totalSessions: player?.total_sessions || player?.training_count,
    // Metrics recording context
    metricsAssigned: player?.metrics_assigned || player?.metricsAssigned || 0,
    selectedMetrics: player?.selectedMetrics || player?.selected_metrics || 0,
    removingMetrics: player?.removingMetrics || player?.pending_removal || 0,
  };

  const getYearLevelDisplay = (yearLevel) => {
    const yearLevelMap = {
      'grade_7': 'Gr 7', 'grade_8': 'Gr 8', 'grade_9': 'Gr 9',
      'grade_10': 'Gr 10', 'grade_11': 'Gr 11', 'grade_12': 'Gr 12',
      '1st_year_college': '1Y', '2nd_year_college': '2Y',
      '3rd_year_college': '3Y', '4th_year_college': '4Y',
    };
    return yearLevelMap[yearLevel] || yearLevel;
  };

  const getCourseDisplay = (course) => {
    const courseMap = {
      'stem': 'STEM', 'gas': 'GAS', 'humss': 'HUMSS', 'abm': 'ABM',
      'bs_cs': 'BS CS', 'bs_ba': 'BS BA',
    };
    return courseMap[course] || course;
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "completed":
        return {
          icon: <CheckCircle2 className="h-4 w-4" />,
          badge: "bg-green-100 text-green-800 border-green-200",
          text: "Completed"
        };
      case "incomplete":
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          badge: "bg-amber-100 text-amber-800 border-amber-200",
          text: "Incomplete"
        };
      case "pending":
      default:
        return {
          icon: <User className="h-4 w-4" />,
          badge: "bg-blue-100 text-blue-800 border-blue-200",
          text: "Pending"
        };
    }
  };

  const statusConfig = getStatusConfig(status);
  const progressPercentage = metricsCount > 0 ? (completedMetrics / metricsCount) * 100 : 0;

  return (
    <Card className={cn(
      "bg-gradient-to-br from-card to-card/95 border-2 transition-all duration-200 hover:shadow-md",
      status === "completed" ? "border-green-200 hover:border-green-300" : 
      status === "incomplete" ? "border-amber-200 hover:border-amber-300" :
      "border-primary/20 hover:border-primary/30",
      className
    )} {...props}>
      <CardContent className="p-4">        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative">
            <Avatar className="h-12 w-12 border-2 border-primary/20">
              <AvatarImage 
                src={playerInfo?.profile || playerInfo?.user?.profile} 
                alt={playerInfo.fullName} 
              />
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-bold text-base">
                {playerInfo?.jerseyNumber ? (
                  <span className="text-sm">#{playerInfo.jerseyNumber}</span>
                ) : playerInfo?.profile ? (
                  <User className="h-6 w-6" />
                ) : (
                  playerInfo.fullName?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || '??'
                )}
              </AvatarFallback>
            </Avatar>
            {showStatus && status === "completed" && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-background">
                <CheckCircle2 className="h-3 w-3 text-white" />
              </div>
            )}
          </div>

          {/* Player Info */}
          <div className="flex-1 min-w-0 space-y-3">
            {/* Name and Status */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-foreground text-lg truncate">
                  {playerInfo.fullName}
                </h4>
                {showStatus && (
                  <Badge className={cn("text-xs flex items-center gap-1", statusConfig.badge)}>
                    {statusConfig.icon}
                    {statusConfig.text}
                  </Badge>
                )}
              </div>

              {/* Position and Team */}
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                {playerInfo.position && (
                  <span className="flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    {playerInfo.position}
                  </span>
                )}
                {playerInfo.teamName && (
                  <span className="flex items-center gap-1">
                    <Trophy className="h-3 w-3" />
                    {playerInfo.teamName}
                  </span>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            {showProgress && metricsCount > 0 && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{completedMetrics}/{metricsCount} metrics</span>
                </div>
                <div className="w-full bg-secondary/20 rounded-full h-2">
                  <div 
                    className={cn(
                      "h-2 rounded-full transition-all duration-300",
                      progressPercentage === 100 ? "bg-green-500" :
                      progressPercentage > 50 ? "bg-primary" : 
                      "bg-amber-500"
                    )}
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            )}            {/* Additional Info Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              {/* Academic Info */}
              {(playerInfo.yearLevel || playerInfo.course) && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <GraduationCap className="h-3 w-3" />
                  <span>
                    {getYearLevelDisplay(playerInfo.yearLevel)}
                    {playerInfo.course && ` • ${getCourseDisplay(playerInfo.course)}`}
                  </span>
                </div>
              )}

              {/* Physical Stats */}
              {(playerInfo.height || playerInfo.weight) && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    {playerInfo.height && (
                      <>
                        <Ruler className="h-3 w-3" />
                        <span>{playerInfo.height}cm</span>
                      </>
                    )}
                    {playerInfo.weight && (
                      <>
                        <Weight className="h-3 w-3 ml-1" />
                        <span>{playerInfo.weight}kg</span>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Training Stats */}
              {playerInfo.attendanceRate !== undefined && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{playerInfo.attendanceRate.toFixed(1)}% attendance</span>
                </div>
              )}

              {playerInfo.totalSessions && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <TrendingUp className="h-3 w-3" />
                  <span>{playerInfo.totalSessions} sessions</span>
                </div>
              )}

              {/* Metrics Assignment Info */}
              {(playerInfo.metricsAssigned > 0 || playerInfo.selectedMetrics > 0 || playerInfo.removingMetrics > 0) && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Target className="h-3 w-3" />
                  <span>
                    {playerInfo.metricsAssigned} metrics
                    {playerInfo.selectedMetrics > 0 && (
                      <span className="text-blue-600 ml-1">
                        (+{playerInfo.selectedMetrics})
                      </span>
                    )}
                    {playerInfo.removingMetrics > 0 && (
                      <span className="text-red-600 ml-1">
                        (-{playerInfo.removingMetrics})
                      </span>
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerQuickInfo;
