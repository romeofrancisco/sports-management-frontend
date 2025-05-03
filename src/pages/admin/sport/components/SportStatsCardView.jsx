import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CircleCheck, CircleX } from "lucide-react";
import { Button } from "@/components/ui/button";

const SportStatsCardView = ({ stats, filter, handleEditStat, handleDeleteStat }) => {
  if (!stats) return null;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map(stat => (
        <Card key={stat.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="mb-3">
              <h3 className="font-semibold text-lg">{stat.name}</h3>
              <div className="text-xs text-muted-foreground">Code: {stat.code}</div>
              {filter.is_record && (
                <>
                  <div className="text-xs">Display: {stat.display_name || "N/A"}</div>
                  <div className="text-xs">Points: {stat.point_value}</div>
                </>
              )}
              {!filter.is_record && (
                <div className="text-xs mt-2">
                  <div className="font-semibold">Formula:</div>
                  <div className="bg-muted/50 p-1 rounded text-muted-foreground">
                    {stat.expression || "N/A"}
                  </div>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
              <div className="flex items-center gap-1">
                {stat.is_player_stat ? (
                  <CircleCheck size={16} className="text-green-700" />
                ) : (
                  <CircleX size={16} className="text-red-700" />
                )}
                Player Stat
              </div>
              <div className="flex items-center gap-1">
                {stat.is_team_stat ? (
                  <CircleCheck size={16} className="text-green-700" />
                ) : (
                  <CircleX size={16} className="text-red-700" />
                )}
                Team Stat
              </div>
              <div className="flex items-center gap-1">
                {stat.is_box_score ? (
                  <CircleCheck size={16} className="text-green-700" />
                ) : (
                  <CircleX size={16} className="text-red-700" />
                )}
                Boxscore
              </div>
              <div className="flex items-center gap-1">
                {stat.is_record ? (
                  <CircleCheck size={16} className="text-green-700" />
                ) : (
                  <CircleX size={16} className="text-red-700" />
                )}
                Recording
              </div>
            </div>
            
            <div className="flex justify-end gap-2 border-t pt-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => handleEditStat(stat)}
              >
                Edit
              </Button>
              <Button 
                size="sm" 
                variant="destructive" 
                onClick={() => handleDeleteStat(stat)}
              >
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SportStatsCardView;