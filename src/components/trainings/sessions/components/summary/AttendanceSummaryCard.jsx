import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, CheckCircle, Clock, AlertTriangle, Shield } from "lucide-react";

const AttendanceSummaryCard = ({ attendanceSummary }) => {
  return (
    <div className="animate-in fade-in-50 duration-500 delay-300">
      <Card className="bg-gradient-to-br from-card via-card/95 to-card/90 rounded-xl gap-0 shadow-xl border-2 border-primary/20 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/8 to-transparent rounded-full blur-2xl opacity-60"></div>

        <CardHeader className="pb-4">
          <div className="flex items-start gap-3">
            <div className="p-3 rounded-xl bg-primary shadow-sm">
              <Users className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <CardTitle>Attendance Summary</CardTitle>
              <CardDescription>
                Complete attendance overview and participation rates
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 relative">
          <div className="grid grid-cols-2 gap-4">
            {/* Present Card */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-800/50">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg shadow-sm">
                <CheckCircle className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground font-medium">
                  Present
                </p>
                <p className="text-xl font-bold text-emerald-700 dark:text-emerald-400">
                  {attendanceSummary.present}
                </p>
              </div>
              <div className="text-right">
                <Badge
                  variant="outline"
                  className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 text-xs"
                >
                  {(
                    (attendanceSummary.present /
                      attendanceSummary.total_players) *
                    100
                  ).toFixed(0)}
                  %
                </Badge>
              </div>
            </div>
            {/* Late Card */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-800/50">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg shadow-sm">
                <Clock className="h-4 w-4 text-amber-700 dark:text-amber-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground font-medium">
                  Late
                </p>
                <p className="text-xl font-bold text-amber-700 dark:text-amber-400">
                  {attendanceSummary.late}
                </p>
              </div>
              <div className="text-right">
                <Badge
                  variant="outline"
                  className="bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800 text-xs"
                >
                  {(
                    (attendanceSummary.late / attendanceSummary.total_players) *
                    100
                  ).toFixed(0)}
                  %
                </Badge>
              </div>
            </div>
            {/* Absent Card */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200/50 dark:border-rose-800/50">
              <div className="p-2 bg-rose-100 dark:bg-rose-900/50 rounded-lg shadow-sm">
                <AlertTriangle className="h-4 w-4 text-rose-700 dark:text-rose-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground font-medium">
                  Absent
                </p>
                <p className="text-xl font-bold text-rose-700 dark:text-rose-400">
                  {attendanceSummary.absent}
                </p>
              </div>
              <div className="text-right">
                <Badge
                  variant="outline"
                  className="bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800 text-xs"
                >
                  {(
                    (attendanceSummary.absent /
                      attendanceSummary.total_players) *
                    100
                  ).toFixed(0)}
                  %
                </Badge>
              </div>
            </div>
            {/* Excused Card */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-950/30 border border-slate-200/50 dark:border-slate-800/50">
              <div className="p-2 bg-slate-100 dark:bg-slate-900/50 rounded-lg shadow-sm">
                <Shield className="h-4 w-4 text-slate-700 dark:text-slate-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground font-medium">
                  Excused
                </p>
                <p className="text-xl font-bold text-slate-700 dark:text-slate-400">
                  {attendanceSummary.excused}
                </p>
              </div>
              <div className="text-right">
                <Badge
                  variant="outline"
                  className="bg-slate-50 dark:bg-slate-950/30 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-800 text-xs"
                >
                  {(
                    (attendanceSummary.excused /
                      attendanceSummary.total_players) *
                    100
                  ).toFixed(0)}
                  %
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceSummaryCard;
