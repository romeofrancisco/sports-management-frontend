import React, { useState } from "react";
import { useSelector } from "react-redux";
import { 
  useBulkRecordStats, 
  useBulkRecordStatsOptimized,
  useRecordStatFast 
} from "@/hooks/useStats";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Clock, 
  Zap, 
  BarChart3, 
  Users, 
  Plus, 
  Trash2,
  PlayCircle 
} from "lucide-react";
import { toast } from "sonner";

const BulkStatRecording = ({ players, statTypes }) => {
  const { game_id, current_period } = useSelector((state) => state.game);
  const [pendingStats, setPendingStats] = useState([]);
  const [recordingMode, setRecordingMode] = useState("fast"); // 'fast', 'bulk', 'optimized'
  
  // Hooks for different recording methods
  const { mutate: bulkRecord, isPending: isBulkPending } = useBulkRecordStats(game_id);
  const { mutate: bulkRecordOptimized, isPending: isOptimizedPending } = useBulkRecordStatsOptimized(game_id);
  const { mutate: recordFast, isPending: isFastPending } = useRecordStatFast(game_id);

  const addStatToPending = (playerId, playerName, teamId, statTypeId, statTypeName, pointValue = 0) => {
    const newStat = {
      id: Date.now() + Math.random(), // Temporary ID
      player: playerId,
      playerName,
      game: game_id,
      team: teamId,
      stat_type: statTypeId,
      statTypeName,
      period: current_period,
      point_value: pointValue,
      value: 1
    };
    
    setPendingStats(prev => [...prev, newStat]);
    toast.success("Stat Added", {
      description: `${statTypeName} for ${playerName} queued for recording`,
    });
  };

  const removeStatFromPending = (statId) => {
    setPendingStats(prev => prev.filter(stat => stat.id !== statId));
  };

  const clearAllPending = () => {
    setPendingStats([]);
    toast.info("Queue Cleared", {
      description: "All pending stats have been removed",
    });
  };

  const executeRecording = () => {
    if (pendingStats.length === 0) {
      toast.warning("No Stats to Record", {
        description: "Add some stats to the queue first",
      });
      return;
    }

    const statsData = pendingStats.map(stat => ({
      player: stat.player,
      game: stat.game,
      team: stat.team,
      stat_type: stat.stat_type,
      period: stat.period,
      point_value: stat.point_value,
      value: stat.value
    }));

    switch (recordingMode) {
      case "fast":
        // Record stats one by one using fast method
        statsData.forEach((stat, index) => {
          setTimeout(() => {
            recordFast(stat);
          }, index * 50); // Small delay to prevent overwhelming
        });
        break;
        
      case "bulk":
        bulkRecord(statsData);
        break;
        
      case "optimized":
        if (statsData.length < 20) {
          toast.warning("Use Regular Bulk", {
            description: "Optimized method is for 20+ stats. Using regular bulk instead.",
          });
          bulkRecord(statsData);
        } else {
          bulkRecordOptimized(statsData);
        }
        break;
    }

    // Clear pending stats after recording
    setPendingStats([]);
  };

  const getRecordingModeInfo = () => {
    switch (recordingMode) {
      case "fast":
        return {
          icon: Zap,
          title: "Fast Recording",
          description: "Optimized single stat recording with minimal database queries",
          color: "text-blue-500",
          bgColor: "bg-blue-50"
        };
      case "bulk":
        return {
          icon: BarChart3,
          title: "Bulk Recording",
          description: "Batch processing for multiple stats (up to 100 stats)",
          color: "text-green-500",
          bgColor: "bg-green-50"
        };
      case "optimized":
        return {
          icon: PlayCircle,
          title: "Optimized Bulk",
          description: "Ultra-fast raw SQL recording for 20+ stats",
          color: "text-purple-500",
          bgColor: "bg-purple-50"
        };
    }
  };

  const modeInfo = getRecordingModeInfo();
  const ModeIcon = modeInfo.icon;
  const isRecording = isBulkPending || isOptimizedPending || isFastPending;

  return (
    <div className="space-y-6">
      {/* Recording Mode Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ModeIcon className={`h-5 w-5 ${modeInfo.color}`} />
            Performance Recording Mode
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            {["fast", "bulk", "optimized"].map((mode) => (
              <Button
                key={mode}
                variant={recordingMode === mode ? "default" : "outline"}
                size="sm"
                onClick={() => setRecordingMode(mode)}
                className="capitalize"
              >
                {mode === "optimized" ? "Optimized Bulk" : mode}
              </Button>
            ))}
          </div>
          <div className={`p-3 rounded-lg ${modeInfo.bgColor}`}>
            <p className="text-sm text-gray-700">
              <strong className={modeInfo.color}>{modeInfo.title}:</strong> {modeInfo.description}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Add Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Quick Add Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">            {players?.slice(0, 4).map((player) => (
              <div key={player.id} className="space-y-2">
                <h4 className="font-medium">{player.first_name} {player.last_name}</h4>
                <div className="flex flex-wrap gap-1">
                  {statTypes?.slice(0, 4).map((statType) => (
                    <Button
                      key={statType.id}
                      size="sm"
                      variant="outline"
                      onClick={() => addStatToPending(
                        player.id,
                        `${player.first_name} ${player.last_name}`,
                        player.team,
                        statType.id,
                        statType.name,
                        statType.point_value || 0
                      )}
                      className="text-xs"
                    >
                      {statType.name}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pending Stats Queue */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Pending Stats Queue
              <Badge variant="secondary">{pendingStats.length}</Badge>
            </div>
            {pendingStats.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllPending}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
                Clear All
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingStats.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No stats in queue</p>
              <p className="text-sm">Add stats using the buttons above</p>
            </div>
          ) : (
            <div className="space-y-2">
              {pendingStats.map((stat) => (
                <div
                  key={stat.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{stat.statTypeName}</Badge>
                    <span className="font-medium">{stat.playerName}</span>
                    <span className="text-sm text-gray-500">Period {stat.period}</span>
                    {stat.point_value > 0 && (
                      <Badge variant="secondary">+{stat.point_value} pts</Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeStatFromPending(stat.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recording Controls */}
      {pendingStats.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Ready to record {pendingStats.length} stats</p>
                <p className="text-sm text-gray-500">
                  Using {modeInfo.title.toLowerCase()} method
                </p>
              </div>
              <Button
                onClick={executeRecording}
                disabled={isRecording}
                className="flex items-center gap-2"
              >
                {isRecording ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Recording...
                  </>
                ) : (
                  <>
                    <ModeIcon className="h-4 w-4" />
                    Record Stats
                  </>
                )}
              </Button>
            </div>
            
            {recordingMode === "optimized" && pendingStats.length < 20 && (
              <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Optimized mode is recommended for 20+ stats. 
                  Regular bulk mode will be used instead.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Separator />

      {/* Performance Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Performance Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <Zap className="h-4 w-4 text-blue-500 mt-0.5" />
            <div>
              <strong>Fast Recording:</strong> Best for individual stats during live gameplay
            </div>
          </div>
          <div className="flex items-start gap-2">
            <BarChart3 className="h-4 w-4 text-green-500 mt-0.5" />
            <div>
              <strong>Bulk Recording:</strong> Ideal for 2-100 stats at once (period breaks)
            </div>
          </div>
          <div className="flex items-start gap-2">
            <PlayCircle className="h-4 w-4 text-purple-500 mt-0.5" />
            <div>
              <strong>Optimized Bulk:</strong> Maximum performance for 20+ stats (data imports, corrections)
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BulkStatRecording;
