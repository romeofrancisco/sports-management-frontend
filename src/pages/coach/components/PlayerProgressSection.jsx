import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, Target, User, Calendar } from "lucide-react";
import { 
  getPlayerPerformanceScore, 
  getPerformanceTrend, 
  getPerformanceBadgeVariant 
} from "../utils/performanceHelpers";

/**
 * Enhanced Player Progress section component
 */
const PlayerProgressSection = ({ playerProgress }) => {  const renderTrendIcon = (trend) => {
    switch (trend) {
      case "improving":
        return <TrendingUp className="h-4 w-4 text-secondary" />;
      case "declining":
        return <TrendingDown className="h-4 w-4 text-primary" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const renderTrendText = (trend) => {
    switch (trend) {
      case "improving":
        return <span className="text-secondary font-bold">Improving</span>;
      case "declining":
        return <span className="text-primary font-bold">Declining</span>;
      default:
        return <span className="text-muted-foreground font-medium">Stable</span>;
    }
  };

  const getPerformanceColor = (score) => {
    if (score >= 80) return { 
      bg: 'bg-gradient-to-br from-secondary/5 via-secondary/3 to-transparent', 
      border: 'border-secondary/30', 
      gradient: 'from-secondary via-secondary/90 to-secondary/80',
      shadow: 'shadow-secondary/20'
    };
    if (score >= 60) return { 
      bg: 'bg-gradient-to-br from-yellow-50 via-yellow-25 to-transparent', 
      border: 'border-yellow-300', 
      gradient: 'from-yellow-400 via-yellow-500 to-yellow-600',
      shadow: 'shadow-yellow-200'
    };
    return { 
      bg: 'bg-gradient-to-br from-primary/5 via-primary/3 to-transparent', 
      border: 'border-primary/30', 
      gradient: 'from-primary via-primary/90 to-primary/80',
      shadow: 'shadow-primary/20'
    };
  };
  return (
    <Card className="bg-gradient-to-br from-card via-card to-card/95 shadow-xl border-2 border-primary/20 transition-all duration-300 hover:shadow-2xl hover:border-primary/30 relative overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-secondary/8 to-transparent rounded-full blur-3xl opacity-60"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-primary/8 to-transparent rounded-full blur-2xl opacity-50"></div>
      
      <CardHeader className="pb-4 relative">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg border border-primary/30 transition-all duration-300 hover:scale-110 hover:shadow-xl">
            <Target className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Player Progress Overview
            </CardTitle>
            <CardDescription className="text-muted-foreground font-medium">
              Performance tracking and development insights
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {playerProgress?.player_progress?.length > 0 ? (
          <div className="space-y-4">
            {playerProgress.player_progress
              .slice(0, 8)
              .map((player, index) => {
                const performanceScore = getPlayerPerformanceScore(player);
                const trend = getPerformanceTrend(player);                const colors = performanceScore ? getPerformanceColor(performanceScore) : { 
                  bg: 'bg-gradient-to-br from-muted/20 to-muted/10', 
                  border: 'border-border', 
                  gradient: 'from-muted-foreground to-muted-foreground/80',
                  shadow: 'shadow-muted/10'
                };
                
                return (
                  <div
                    key={index}
                    className={`relative overflow-hidden border-2 rounded-xl p-5 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group ${colors.bg} ${colors.border} ${colors.shadow}`}
                  >
                    {/* Enhanced performance indicator */}
                    <div className={`absolute top-0 right-0 w-3 h-full bg-gradient-to-b ${colors.gradient} shadow-md`}></div>
                    {/* Additional hover effects */}
                    <div className="absolute top-2 right-5 w-6 h-6 bg-gradient-to-br from-secondary/15 to-transparent rounded-full blur-sm opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
                    
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-slate-500" />
                            <h4 className="font-semibold text-foreground">
                              {player.player_name}
                            </h4>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{player.total_sessions} sessions</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Target className="h-3 w-3" />
                              <span>{player.attendance_rate?.toFixed(1) || 0}% attendance</span>
                            </div>
                            {player.recent_metrics_count > 0 && (
                              <div className="flex items-center gap-1 md:col-span-2">
                                <TrendingUp className="h-3 w-3" />
                                <span>{player.recent_metrics_count} metrics recorded</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-right space-y-2">
                          {performanceScore !== null ? (
                            <Badge 
                              variant={getPerformanceBadgeVariant(performanceScore)}
                              className="font-medium"
                            >
                              {performanceScore}/100
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-slate-500">
                              No data
                            </Badge>
                          )}
                          
                          <div className="flex items-center gap-1 text-xs justify-end">
                            {renderTrendIcon(trend)}
                            {renderTrendText(trend)}
                          </div>
                        </div>
                      </div>
                        {/* Enhanced performance bar */}
                      {performanceScore !== null && (
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground font-medium">Performance Score</span>
                            <span className="text-xs text-foreground font-bold">{performanceScore}%</span>
                          </div>
                          <div className="w-full bg-muted/60 rounded-full h-2.5 shadow-inner border border-border/30">
                            <div 
                              className={`h-2.5 rounded-full transition-all duration-700 bg-gradient-to-r ${colors.gradient} shadow-sm`}
                              style={{ width: `${performanceScore}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                      
                      <div className="text-xs text-muted-foreground/70">
                        Last training: {player.last_training_date || "No recent training"}
                      </div>
                    </div>
                  </div>
                );
              })}
              {playerProgress.player_progress.length > 8 && (
              <div className="text-center pt-4">
                <button className="text-sm text-primary hover:text-secondary font-bold transition-all duration-300 hover:scale-105 px-4 py-2 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 hover:from-primary/20 hover:to-secondary/20 border border-primary/20 hover:border-secondary/30">
                  View all {playerProgress.player_progress.length} players →
                </button>
              </div>
            )}
          </div>        ) : (
          <div className="text-center py-16 relative">
            {/* Enhanced background effects for empty state */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 rounded-lg opacity-50"></div>
            <div className="relative">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mb-6 shadow-lg border-2 border-primary/20">
                <Target className="h-10 w-10 text-primary" />
              </div>
              <p className="text-foreground font-bold text-lg mb-2">No player progress data available</p>
              <p className="text-muted-foreground font-medium max-w-sm mx-auto">
                Player performance data will appear here as training sessions are completed and metrics are recorded
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlayerProgressSection;
