import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import TeamStreakIndicator from "@/components/common/TeamStreakIndicator";
import { Award, TrendingUp, Trophy } from "lucide-react";

const TeamCard = ({ 
  team, 
  stats = {}, 
  formData = [], 
  onClick 
}) => {
  const { team_id, team_name, team_logo, championships = 0, win_ratio = 0 } = team;
  
  return (
    <Card 
      className={`overflow-hidden transition-all duration-200 hover:shadow-md ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src={team_logo} 
              alt={team_name} 
              className="w-16 h-16 rounded-full object-contain border p-1"
            />
            {championships > 0 && (
              <div className="absolute -top-1 -right-1 bg-amber-500 rounded-full p-0.5 text-white">
                <Award size={14} />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-base">{team_name}</h3>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <span>Win rate:</span> 
              <span className={win_ratio > 0.5 ? "text-emerald-600 font-medium" : "text-rose-600 font-medium"}>
                {(win_ratio * 100).toFixed(1)}%
              </span>
            </div>
            {championships > 0 && (
              <div className="text-xs mt-1 text-amber-500 flex items-center gap-1">
                <Trophy size={12} />
                <span>{championships} championship{championships > 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-3 pt-2 border-t">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Recent streak:</span>
            <TeamStreakIndicator results={formData} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamCard;