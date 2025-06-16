import React from "react";
import { Card, CardContent } from "../../../../ui/card";
import { Button } from "../../../../ui/button";
import { Badge } from "../../../../ui/badge";
import SimpleCheckbox from "../../../../ui/simple-checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../ui/avatar";
import { Trophy, Target, Zap, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const PlayerMetricsCard = ({
  record,
  playerAssignedMetrics,
  sessionMetricIds,
  filteredMetrics,
  selectedPlayerMetrics,
  metricsToRemove,
  handleTogglePlayerMetric,
  handleAssignToPlayers,
  handleAssignPlayerMetrics
}) => {
  const player = record.player;
  const playerId = player?.id;
  const playerMetrics = playerAssignedMetrics.get(playerId) || [];
  const metricsToRemoveCount = (metricsToRemove[playerId] || []).length;
  const effectiveMetricsCount = playerMetrics.length - metricsToRemoveCount;
  return (    <Card key={playerId} className="p-4 hover:shadow-md transition-shadow border-2 border-primary/10">
      <div className="flex items-center justify-between mb-4">        {/* Enhanced Player Profile Display */}
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-primary/20">
              <AvatarImage 
                src={player?.profile || player?.user?.profile} 
                alt={`${player?.first_name} ${player?.last_name}`} 
              />
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-bold text-sm">
                {player?.jersey_number ? (
                  <span className="text-xs">#{player.jersey_number}</span>
                ) : player?.profile ? (
                  <User className="h-5 w-5" />
                ) : (
                  `${player?.first_name?.[0] || ''}${player?.last_name?.[0] || ''}`.toUpperCase()
                )}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-foreground truncate">
                  {player?.first_name} {player?.last_name}
                </h4>
                {player?.jersey_number && (
                  <Badge variant="outline" className="text-xs">
                    #{player.jersey_number}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{effectiveMetricsCount} metrics assigned</span>
                {metricsToRemoveCount > 0 && (
                  <span className="text-red-600">-{metricsToRemoveCount} removing</span>
                )}
                {player?.position && (
                  <span>• {player.position}</span>
                )}
              </div>
            </div>
          </div>
        </div><Button
          size="sm"
          variant="outline"
          onClick={() => {
            // Quick assign all session metrics to this player
            if (sessionMetricIds.length > 0) {
              handleAssignToPlayers(sessionMetricIds, [playerId]);
            } else {
              toast.info("No session metrics available. Configure session metrics first.");
            }
          }}
          disabled={sessionMetricIds.length === 0}
          className="flex items-center gap-2 hover:bg-primary/5"
        >
          <Zap className="h-4 w-4" />
          Quick Assign
        </Button>
      </div>      {/* Player's assigned metrics */}
      {playerMetrics.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-medium mb-2">Assigned Metrics:</p>
          <div className="flex flex-wrap gap-1">
            {playerMetrics.map((metric) => {
              const isMarkedForRemoval = (metricsToRemove[playerId] || []).includes(metric.id);
              return (
                <Badge 
                  key={metric.id} 
                  variant={isMarkedForRemoval ? "destructive" : "secondary"} 
                  className={cn(
                    "text-xs",
                    isMarkedForRemoval && "line-through"
                  )}
                >
                  {metric.name}
                  {isMarkedForRemoval && " (removing)"}
                </Badge>
              );
            })}
          </div>
        </div>
      )}

      {/* Custom metric assignment */}
      <div className="space-y-2">
        <p className="text-xs font-medium">Select Metrics to Assign:</p>
        <div className="max-h-32 overflow-y-auto space-y-1">          {filteredMetrics.slice(0, 8).map((metric) => {
            const isAlreadyAssigned = playerMetrics.some(pm => pm.id === metric.id);
            const isSelected = (selectedPlayerMetrics[playerId] || []).includes(metric.id);
            const isMarkedForRemoval = (metricsToRemove[playerId] || []).includes(metric.id);
            
            // Calculate checkbox state: 
            // - If assigned and not marked for removal: checked
            // - If not assigned but selected: checked  
            // - Otherwise: unchecked
            const isChecked = isAlreadyAssigned ? !isMarkedForRemoval : isSelected;
            
            return (
              <div key={metric.id} className={cn(
                "flex items-center space-x-2 text-xs p-2 rounded border",
                isAlreadyAssigned && !isMarkedForRemoval && "bg-green-50 border-green-200",
                isMarkedForRemoval && "bg-red-50 border-red-200",
                isSelected && !isAlreadyAssigned && "bg-blue-50 border-blue-200"
              )}>
                <SimpleCheckbox
                  checked={isChecked}
                  onChange={() => handleTogglePlayerMetric(playerId, metric.id)}
                  disabled={false}
                />
                <span className={cn(
                  "flex-1 truncate",
                  isAlreadyAssigned && !isMarkedForRemoval && "text-green-700 font-medium",
                  isMarkedForRemoval && "text-red-700 line-through"
                )}>
                  {metric.name}
                  {isAlreadyAssigned && !isMarkedForRemoval && (
                    <Badge variant="outline" className="ml-1 text-xs text-green-600">
                      Assigned
                    </Badge>
                  )}
                  {isMarkedForRemoval && (
                    <Badge variant="destructive" className="ml-1 text-xs">
                      Removing
                    </Badge>
                  )}
                </span>
              </div>
            );
          })}
        </div>        
        {/* Assign button for selected metrics */}
        {((selectedPlayerMetrics[playerId] || []).length > 0 || (metricsToRemove[playerId] || []).length > 0) && (
          <Button
            size="sm"
            className="w-full mt-2"
            onClick={() => handleAssignPlayerMetrics(playerId)}
          >
            {(() => {
              const toAssign = (selectedPlayerMetrics[playerId] || []).length;
              const toRemove = (metricsToRemove[playerId] || []).length;
              
              if (toAssign > 0 && toRemove > 0) {
                return `Assign ${toAssign} & Remove ${toRemove} Metrics`;
              } else if (toAssign > 0) {
                return `Assign ${toAssign} Selected Metrics`;
              } else if (toRemove > 0) {
                return `Remove ${toRemove} Metrics`;
              }
              return "Update Metrics";
            })()}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default PlayerMetricsCard;
