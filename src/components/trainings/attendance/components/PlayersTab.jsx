import React from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Calendar, TrendingUp, User, Activity } from "lucide-react";

const PlayersTab = ({ playersData, selectedPlayer, onPlayerSelect }) => {
  if (!playersData || playersData.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 border rounded-lg bg-muted/30">
        <p className="text-muted-foreground">No player data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="mb-5 flex items-center gap-3">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
          <User className="h-6 w-6 sm:h-7 sm:w-7 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-foreground">
            Player Attendance
          </h2>
          <p className="text-sm text-muted-foreground">
            Click on a player to view their detailed dashboard
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {playersData.map((player, index) => (
          <div
            key={player.player_id}
            className="relative group cursor-pointer transition-all duration-300 ease-out"
            onClick={() => onPlayerSelect(player)}
          >
            <div
              className={cn(
                "relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-white to-slate-50/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900",
                "border-2 border-primary/20 shadow-lg",
                "group-hover:shadow-2xl group-hover:border-primary/40",
                selectedPlayer?.player_id === player.player_id &&
                  "ring-2 ring-primary/60 border-primary shadow-2xl bg-gradient-to-br from-primary/5 via-white to-primary/5 dark:from-primary/10 dark:via-slate-800 dark:to-primary/10"
              )}
            >
              {/* Top Background Pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-full -translate-y-16 translate-x-16" />

              {/* Card Content */}
              <div className="relative p-6">
                {/* Header with Avatar and Badge */}
                <div className="flex items-start justify-between mb-4">
                  <div className="relative">
                    <Avatar className="h-16 w-16 border-3 border-white dark:border-slate-800 shadow-lg ring-2 ring-primary/20">
                      <AvatarImage
                        src={player?.player_profile}
                        alt={player.player_name}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground font-bold text-lg">
                        {player?.jersey_number ? (
                          <span className="text-sm font-black">
                            #{player.jersey_number}
                          </span>
                        ) : (
                          player.player_name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")
                            .substring(0, 2)
                            .toUpperCase() || "??"
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-gradient-to-r from-primary to-primary/80 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg border-2 border-white dark:border-slate-800">
                      {index + 1}
                    </div>
                  </div>

                  <Badge
                    variant="outline"
                    className={cn(
                      "font-bold px-3 py-1.5 text-sm border-2 shadow-sm",
                      player.attendance_rate >= 80
                        ? "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200 dark:from-green-950 dark:to-emerald-950 dark:text-green-400"
                        : player.attendance_rate >= 60
                        ? "bg-gradient-to-r from-yellow-50 to-amber-50 text-yellow-700 border-yellow-200 dark:from-yellow-950 dark:to-amber-950 dark:text-yellow-400"
                        : "bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-red-200 dark:from-red-950 dark:to-rose-950 dark:text-red-400"
                    )}
                  >
                    {player.attendance_rate.toFixed(1)}%
                  </Badge>
                </div>

                {/* Player Info */}
                <div className="mb-4">
                  <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-1 leading-tight">
                    {player.player_name}
                  </h4>
                  <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
                      <Calendar className="h-3 w-3 text-primary" />
                      <span className="font-medium">
                        {player.total_sessions} sessions
                      </span>
                    </span>
                    <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
                      <TrendingUp className="h-3 w-3 text-primary" />
                      <span className="font-medium">
                        {player.present_count + player.late_count} attended
                      </span>
                    </span>
                  </div>
                </div>                {/* Detailed Stats */}
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-2 bg-primary/8 rounded-xl border border-primary/30">
                      <div className="text-lg font-bold text-primary dark:text-primary-400">
                        {player.present_count}
                      </div>
                      <div className="text-xs text-primary font-medium">
                        Present
                      </div>
                    </div>
                    <div className="text-center p-2 bg-yellow-50 dark:bg-yellow-950/30 rounded-xl border border-yellow-200 dark:border-yellow-800">
                      <div className="text-lg font-bold text-yellow-700 dark:text-yellow-400">
                        {player.late_count}
                      </div>
                      <div className="text-xs text-yellow-600 dark:text-yellow-500 font-medium">
                        Late
                      </div>
                    </div>
                  </div>                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-2 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-800">
                      <div className="text-lg font-bold text-red-700 dark:text-red-400">
                        {player.absent_count}
                      </div>
                      <div className="text-xs text-red-600 dark:text-red-500 font-medium">
                        Absent
                      </div>
                    </div>
                    <div className="text-center p-2 bg-orange-50 dark:bg-orange-950/30 rounded-xl border border-orange-200 dark:border-orange-800">
                      <div className="text-lg font-bold text-orange-700 dark:text-orange-400">
                        {player.excused_count}
                      </div>
                      <div className="text-xs text-orange-600 dark:text-orange-500 font-medium">
                        Excused
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayersTab;
