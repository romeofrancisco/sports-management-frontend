import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { Target, AlertCircle, Users, CheckCircle2, Calendar } from "lucide-react";
import { Badge } from "../../../ui/badge";
import SessionMetricsTab from "./metrics/SessionMetricsTab";
import PlayerMetricsTab from "./metrics/PlayerMetricsTab";

const MetricsConfiguration = ({ session, onSaveSuccess }) => {
  // Get present players count for display
  const presentPlayers =
    session?.player_records?.filter(
      (record) =>
        record.attendance_status === "present" ||
        record.attendance_status === "late"
    ) || [];

  if (!session) return null;  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Enhanced Header */}
      <Card className="bg-gradient-to-br from-card via-card to-card/95 shadow-xl border-2 border-primary/20 transition-all duration-300 hover:shadow-2xl relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/8 to-transparent rounded-full blur-2xl opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-secondary/8 to-transparent rounded-full blur-xl opacity-50"></div>
        
        <CardHeader className="relative z-10 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-lg border border-primary/30">
                <Target className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
                  Configure Metrics
                  <Badge variant="outline" className="bg-primary/10 border-primary/30 text-primary">
                    Training Session
                  </Badge>
                </CardTitle>
                <p className="text-muted-foreground mt-2 max-w-2xl">
                  Configure which metrics should be tracked for this training session.
                  Complete both session-level and player-specific metric configuration to enable comprehensive performance tracking.
                </p>
              </div>
            </div>
            
            {session.date && (
              <div className="flex items-center gap-2 bg-secondary/10 px-4 py-2 rounded-lg border border-secondary/20">
                <Calendar className="h-4 w-4 text-secondary" />
                <span className="text-sm font-medium text-secondary">
                  {new Date(session.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Enhanced Prerequisites Check */}
      <Card className="bg-gradient-to-r from-amber-50/80 via-amber-50/60 to-card/80 backdrop-blur-sm border-2 border-amber-200/60 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-100/50 to-transparent rounded-full blur-2xl opacity-60"></div>
        <CardContent className="pt-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-100 rounded-xl shadow-lg">
              <AlertCircle className="h-5 w-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-amber-800 text-lg flex items-center gap-2">
                Prerequisites Check
                <CheckCircle2 className="h-4 w-4 text-amber-600" />
              </h4>
              <p className="text-amber-700 mt-2 leading-relaxed">
                Make sure you have completed attendance marking before configuring metrics. 
                Only players marked as present or late can have metrics recorded during the training session.
              </p>
              {session?.player_records && (
                <div className="mt-4 flex items-center gap-3">
                  <Badge variant="outline" className="bg-amber-100 border-amber-300 text-amber-700 font-medium">
                    Present Players: {presentPlayers.length} / {session.player_records.length}
                  </Badge>
                  <div className="flex-1 bg-amber-200/50 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-500"
                      style={{ width: `${(presentPlayers.length / session.player_records.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-amber-700">
                    {Math.round((presentPlayers.length / session.player_records.length) * 100)}%
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>      {/* Enhanced Main Content */}
      <div className="space-y-6">
        {/* Session Metrics Section */}
        <Card className="bg-gradient-to-br from-card via-card to-card/95 shadow-xl border-2 border-primary/20 transition-all duration-300 hover:shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/8 to-transparent rounded-full blur-2xl opacity-60"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-secondary/8 to-transparent rounded-full blur-xl opacity-50"></div>
          
          <CardHeader className="relative z-10 pb-4 border-b border-primary/10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl border border-primary/20 shadow-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-xl font-bold text-foreground flex items-center gap-3">
                  Step 1: Configure Session Metrics
                  <Badge variant="outline" className="bg-primary/10 border-primary/30 text-primary text-xs">
                    Global
                  </Badge>
                </CardTitle>
                <p className="text-muted-foreground mt-2 leading-relaxed">
                  Set up metrics that will be available to all players in this session. 
                  These metrics define what performance indicators can be tracked across the entire training session.
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative z-10 p-0">
            <SessionMetricsTab session={session} onSaveSuccess={onSaveSuccess} />
          </CardContent>
        </Card>

        {/* Player-Specific Metrics Section */}
        <Card className="bg-gradient-to-br from-card via-card to-card/95 shadow-xl border-2 border-secondary/20 transition-all duration-300 hover:shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/8 to-transparent rounded-full blur-2xl opacity-60"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/8 to-transparent rounded-full blur-xl opacity-50"></div>
          
          <CardHeader className="relative z-10 pb-4 border-b border-secondary/10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-secondary/10 rounded-xl border border-secondary/20 shadow-lg">
                <Target className="h-5 w-5 text-secondary" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-xl font-bold text-foreground flex items-center gap-3">
                  Step 2: Configure Player-Specific Metrics
                  <Badge variant="outline" className="bg-secondary/10 border-secondary/30 text-secondary text-xs">
                    Individual
                  </Badge>
                </CardTitle>
                <p className="text-muted-foreground mt-2 leading-relaxed">
                  Assign specific metrics to individual players based on their roles, positions, 
                  or specific training focus areas to enable personalized performance tracking.
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative z-10 p-0">
            <PlayerMetricsTab session={session} onSaveSuccess={onSaveSuccess} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default MetricsConfiguration;
