import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Users, Calendar, Clock } from "lucide-react";
import { formatShortDate } from "@/utils/formatDate";

const TeamRecentTrainingSection = ({ trainings }) => {
  return (
    <Card className="bg-gradient-to-br from-card via-card to-card/95 shadow-xl border-2 border-primary/20 transition-all duration-300 hover:shadow-2xl hover:border-primary/30 relative overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/10 to-transparent rounded-full blur-2xl opacity-70"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-xl opacity-60"></div>

      <CardHeader className="pb-4 relative">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg border border-primary/30 transition-all duration-300 hover:scale-110 hover:shadow-xl">
            <Activity className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold text-gradient">
              Recent Training Sessions
            </CardTitle>
            <CardDescription className="text-muted-foreground font-medium">
              Latest training activities and attendance
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {trainings?.length > 0 ? (
          <div className="space-y-4">
            {trainings.slice(0, 3).map((training, index) => {
              const attendanceRate = training.attendance_count && training.total_players
                ? (training.attendance_count / training.total_players) * 100
                : 0;
              
              return (
                <div
                  key={training.id || index}
                  className="relative overflow-hidden border-2 border-primary/20 rounded-xl p-4 bg-gradient-to-r from-card via-primary/5 to-secondary/5 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-primary/40 group"
                >
                  {/* Enhanced attendance indicator */}
                  <div
                    className={`absolute top-0 right-0 w-3 h-full ${
                      attendanceRate >= 80
                        ? "bg-gradient-to-b from-green-500 to-green-600 shadow-lg"
                        : attendanceRate >= 60
                        ? "bg-gradient-to-b from-yellow-500 to-yellow-600 shadow-md"
                        : attendanceRate > 0
                        ? "bg-gradient-to-b from-red-500 to-red-600 shadow-lg"
                        : "bg-gradient-to-b from-gray-400 to-gray-500 shadow-md"
                    }`}
                  ></div>
                  
                  {/* Additional background effects */}
                  <div className="absolute top-2 right-4 w-8 h-8 bg-gradient-to-br from-secondary/20 to-transparent rounded-full blur-sm opacity-50 group-hover:opacity-70 transition-opacity"></div>
                  
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-foreground text-sm">
                          {training.title || training.name}
                        </h4>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatShortDate(training.date)}</span>
                          </div>
                          {training.duration && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{training.duration}min</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        {training.attendance_count !== undefined && training.total_players !== undefined && (
                          <>
                            <div className="text-sm font-bold text-foreground">
                              {training.attendance_count}/{training.total_players}
                            </div>
                            <Badge
                              className={`text-xs font-bold px-3 py-1.5 rounded-full border-2 transition-all duration-300 ${
                                attendanceRate >= 80
                                  ? "text-green-800 bg-gradient-to-r from-green-100 to-green-200 border-green-300 shadow-md"
                                  : attendanceRate >= 60
                                  ? "text-yellow-800 bg-gradient-to-r from-yellow-100 to-yellow-200 border-yellow-300 shadow-sm"
                                  : attendanceRate > 0
                                  ? "text-red-800 bg-gradient-to-r from-red-100 to-red-200 border-red-300 shadow-md"
                                  : "text-gray-800 bg-gradient-to-r from-gray-100 to-gray-200 border-gray-300 shadow-sm"
                              }`}
                            >
                              {attendanceRate.toFixed(1)}%
                            </Badge>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {/* Enhanced attendance progress bar */}
                    {attendanceRate > 0 && (
                      <div className="space-y-2">
                        <div className="w-full bg-muted/60 rounded-full h-2 shadow-inner border border-border/30">
                          <div
                            className={`h-2 rounded-full transition-all duration-700 shadow-sm ${
                              attendanceRate >= 80
                                ? "bg-gradient-to-r from-green-400 via-green-500 to-green-600 shadow-green-400/30"
                                : attendanceRate >= 60
                                ? "bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 shadow-yellow-400/30"
                                : "bg-gradient-to-r from-red-400 via-red-500 to-red-600 shadow-red-400/30"
                            }`}
                            style={{ width: `${attendanceRate}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    {training.type && (
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {training.type}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {trainings.length > 4 && (
              <div className="text-center pt-4">
                <button className="text-sm text-primary hover:text-secondary font-bold transition-all duration-300 hover:scale-105 px-4 py-2 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 hover:from-primary/20 hover:to-secondary/20 border border-primary/20 hover:border-secondary/30">
                  View all sessions →
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16 relative">
            {/* Enhanced background effects for empty state */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 rounded-lg opacity-50"></div>
            <div className="relative">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mb-6 shadow-lg border-2 border-primary/20">
                <Activity className="h-10 w-10 text-primary" />
              </div>
              <p className="text-foreground font-bold text-lg mb-2">
                No recent training sessions
              </p>
              <p className="text-muted-foreground font-medium max-w-sm mx-auto">
                Training sessions will appear here after they're completed.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TeamRecentTrainingSection;
