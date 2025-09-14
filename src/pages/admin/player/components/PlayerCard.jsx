import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Trophy,
  User,
  Target,
  GraduationCap,
  BookOpen,
} from "lucide-react";
import { getCourseLabel, getYearLevelLabel } from "@/constants/player";
import PlayerActions from "./PlayerActions";

const PlayerCard = ({ player, onView, onEdit, onDelete, onReactivate }) => {
  // Get player's first position for display
  const primaryPosition = player.positions?.[0]?.abbreviation || "N/A";
  const allPositions =
    player.positions?.map((pos) => pos.abbreviation).join(", ") || "N/A";
  return (
    <Card className={`relative overflow-hidden border-2 rounded-xl transition-all duration-300 hover:shadow-lg group bg-card border-border shadow-sm hover:border-primary/30 ${
      !player.is_active ? 'opacity-70 border-gray-300' : ''
    }`}>
      {/* University color indicator  */}
      <div className="absolute bg-primary top-0 right-0 w-3 h-full" />

      {/* Hover effects with primary color */}
      <div className="absolute top-2 right-5 w-6 h-6 bg-primary/10 rounded-full blur-sm opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>

      <CardHeader className="relative p-5 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1">
            {/* Avatar with university colors */}
            <div className="relative">
              <Avatar
                className={`h-12 w-12 ring-2 ring-offset-2 ring-offset-card transition-all duration-300 group-hover:ring-primary/30 ${
                  player.sex === "female"
                    ? "ring-secondary/30"
                    : "ring-primary/30"
                }`}
              >
                <AvatarImage
                  src={player.profile}
                  alt={`${player.first_name} ${player.last_name}`}
                />
                <AvatarFallback
                  className={`font-bold ${
                    player.sex === "female"
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  {player.first_name?.[0]}
                  {player.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              {/* Active/Inactive status indicator */}
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card shadow-sm ${
                !player.is_active 
                  ? 'bg-gradient-to-r from-red-400 to-red-500' 
                  : 'bg-gradient-to-r from-emerald-400 to-emerald-500'
              }`}></div>
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors duration-300">
                {player.first_name} {player.last_name}
              </CardTitle>
              {/* Jersey number and sport badge with university colors */}
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant="secondary"
                  className="text-xs bg-primary/20 text-primary border-primary/40 px-2 py-0.5"
                >
                  #{player.jersey_number}
                </Badge>
                {player.sport?.name && (
                  <Badge
                    variant="secondary"
                    className="text-xs bg-secondary/20 text-secondary border-secondary/40"
                  >
                    {player.sport.name}
                  </Badge>
                )}
                {/* Player active/inactive status badge */}
                <Badge 
                  variant={player.is_active ? "default" : "destructive"}
                  className={`text-xs font-medium px-2 py-0.5 ${
                    player.is_active 
                      ? 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' 
                      : 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
                  }`}
                >
                  {player.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>

              {/* Player details */}
              <div className="flex flex-col gap-2 mt-2">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div
                    className="flex items-center gap-1"
                    title={`Position: ${allPositions}`}
                  >
                    <Target className="h-3 w-3" />
                    <span className="font-medium">{primaryPosition}</span>
                  </div>
                  {player.team?.name && (
                    <div
                      className="flex items-center gap-1"
                      title={`Team: ${player.team.name}`}
                    >
                      <Users className="h-3 w-3" />
                      <span className="truncate max-w-20">
                        {player.team.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="ml-2">
            <PlayerActions
              player={player}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
              onReactivate={onReactivate}
            />
          </div>
        </div>
        {/* Academic Information */}
        <div className="pt-2 border-t border-border/50 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1">
              <GraduationCap className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground font-medium">
                Year Level
              </span>
            </div>
            <span
              className={`text-xs font-medium px-2 py-1 rounded-md ${
                player.sex === "female"
                  ? "bg-secondary/15 text-secondary"
                  : "bg-primary/15 text-primary"
              }`}
            >
              {getYearLevelLabel(player.year_level)}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1">
              <BookOpen className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground font-medium">Course</span>
            </div>
            <span
              className={`text-xs font-medium px-2 py-1 rounded-md truncate max-w-24 ${
                player.sex === "female"
                  ? "bg-secondary/15 text-secondary"
                  : "bg-primary/15 text-primary"
              }`}
              title={getCourseLabel(player.course)}
            >
              {getCourseLabel(player.course)}
            </span>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default PlayerCard;
