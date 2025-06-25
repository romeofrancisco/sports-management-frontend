import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { useNavigate } from "react-router";

const PlayerRecentSessions = ({ recentSessions }) => {
  const navigate = useNavigate();
  console.log("Recent Sessions:", recentSessions);

  return (
    <Card className="relative overflow-hidden w-full border-2 border-primary/20">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-accent/10 to-transparent pointer-events-none" />
      <CardHeader className="relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-3 rounded-lg bg-primary shadow-lg">
            <Activity className="size-5 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="flex items-center gap-2">
              Recent Sessions
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Latest attendance records
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="space-y-3">
          {recentSessions && recentSessions.length > 0 ? (
            recentSessions.slice(0, 4).map((session, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border-2 border-primary/20 rounded-xl hover:shadow transition-all"
                onClick={() => navigate(`/trainings/sessions/${session.session_id}/summary`)}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {session.session_title}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    {format(parseISO(session.date), "MMM dd, yyyy")}
                  </p>
                </div>
                <div className="ml-4">
                  <Badge
                    variant={
                      session.status === "present" ? "default" : "secondary"
                    }
                    className={cn(
                      "font-medium px-3 py-1.5 text-xs border-0",
                      session.status === "present" &&
                        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200",
                      session.status === "absent" &&
                        "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200",
                      session.status === "late" &&
                        "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200",
                      session.status === "excused" &&
                        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
                    )}
                  >
                    <div className="flex items-center gap-1.5">
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full",
                          session.status === "present" && "bg-green-500",
                          session.status === "absent" && "bg-red-500",
                          session.status === "late" && "bg-orange-500",
                          session.status === "excused" && "bg-blue-500"
                        )}
                      ></div>
                      <span className="capitalize">
                        {session.status || "Pending"}
                      </span>
                    </div>
                  </Badge>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
                <Activity className="h-8 w-8 text-accent" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-slate-500 dark:text-slate-400 font-medium">
                  No recent sessions found
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Sessions will appear here once they are scheduled
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};  

export default PlayerRecentSessions;
