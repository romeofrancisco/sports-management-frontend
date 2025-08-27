import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Users, Calendar, Clock, MapPin } from "lucide-react";
import { formatShortDate } from "@/utils/formatDate";
import { formatTo12HourTime } from "@/utils/formatTime";

const RecentTrainingSection = ({ overview }) => {
  return (
    <Card className=" border-2 border-primary/20 hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary shadow-lg">
            <Activity className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-gradient">
              Recent Training Sessions
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Latest training activities and attendance
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {overview?.recent_training_sessions?.length > 0 ? (
          <div className="space-y-4">
            {overview.recent_training_sessions
              .slice(0, 3)
              .map((training, index) => {
                const attendanceRate =
                  training.attendance_count && training.total_players
                    ? (training.attendance_count / training.total_players) * 100
                    : 0;

                return (
                  <div
                    key={training.id || index}
                    className="relative overflow-hidden border border-primary/20 rounded-lg p-3 bg-gradient-to-r from-primary/5 to-primary/5 transition-all duration-300 hover:shadow-md hover:scale-[1.01] group"
                  >
                    {/* Primary indicator */}
                    <div className="absolute top-0 right-0 w-2 h-full bg-primary"></div>

                    <div className="space-y-2">
                      {/* Header section with title and time */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground text-sm leading-tight">
                            {training.title}
                          </h4>
                        </div>
                        <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                          <Users className="h-3 w-3 mr-1" />
                          {training.attendance_count}/{training.total_players} (
                          {attendanceRate.toFixed(1)}%)
                        </Badge>
                      </div>

                      {/* Content section */}
                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                        {/* Left column */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3 w-3 text-primary" />
                            <span>{formatShortDate(training.date)}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3 w-3 text-primary" />
                            <span>{training.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Activity className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium">
              No recent training sessions
            </p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Training sessions will appear here after they're completed.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentTrainingSection;
