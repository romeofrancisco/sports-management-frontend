import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, Trophy } from "lucide-react";

/**
 * Enhanced My Teams section component
 */
const MyTeamsSection = ({ overview }) => {
  return (
    <Card className="bg-card shadow-lg border-2 border-secondary/20 hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary shadow-lg">
            <Users className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-gradient">
              My Teams
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Teams you are currently coaching
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {overview?.team_attendance?.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
            {overview.team_attendance.map((team, index) => (
              <div
                key={team.team_id || index}
                className="relative overflow-hidden border-2 border-secondary/20 rounded-xl p-4 bg-gradient-to-r from-secondary/5 to-primary/5 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group"
              >
                {/* Enhanced background effects */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl opacity-60"></div>

                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-foreground text-base">
                    {team.team_name}
                  </h3>
                  <Badge
                    variant="outline"
                    className={`font-semibold ${
                      team.attendance_rate >= 80
                        ? "border-secondary/40 text-secondary bg-secondary/15"
                        : team.attendance_rate >= 60
                        ? "border-yellow-400/40 text-yellow-600 bg-yellow-50"
                        : "border-primary/40 text-primary bg-primary/15"
                    }`}
                  >
                    {team.attendance_rate?.toFixed(1)}% attendance
                  </Badge>
                </div>

                <div className="flex gap-4">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{team.total_players} Players</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{team.total_sessions} Sessions</span>
                  </div>
                </div>
                {/* Enhanced progress bar for attendance */}
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-muted-foreground font-medium">
                      Attendance Rate
                    </span>
                  </div>
                  <div className="w-full bg-black/10 dark:bg-white/10 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-2.5 rounded-full transition-all duration-700 shadow-sm bg-gradient-to-r from-primary to-secondary"
                      style={{ width: `${team.attendance_rate}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-secondary" />
            </div>
            <p className="text-muted-foreground font-medium">
              No teams assigned yet
            </p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Teams will appear here once you're assigned as a coach
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MyTeamsSection;
