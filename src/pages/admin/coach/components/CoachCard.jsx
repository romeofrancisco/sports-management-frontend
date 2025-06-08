import {
    Avatar,
    AvatarImage,
    AvatarFallback,
  } from "@/components/ui/avatar";
  import {
    Card,
    CardHeader,
    CardContent,
  } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Trophy, Mail, User, Target } from "lucide-react";
import CoachActions from "./CoachActions";
  
const CoachCard = ({ coach, onDelete, onUpdate }) => {
  const totalPlayers = coach.teams?.reduce((total, team) => total + team.player_count, 0) || 0;
  const teamCount = coach.teams?.length || 0;

  return (
    <Card className="w-full max-w-sm h-[400px] flex flex-col bg-gradient-to-br from-card via-card/90 to-primary/5 border-2 border-primary/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-primary/30 group overflow-hidden relative">
      {/* Background Effects */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-secondary/10 to-transparent rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
      
      <CardHeader className="relative pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-sm opacity-60"></div>
              <Avatar className="h-12 w-12 relative border-2 border-primary/20 shadow-lg">
                <AvatarImage src={coach.profile} alt={coach.full_name} className="object-cover" />
                <AvatarFallback className="bg-gradient-to-br from-primary/10 to-secondary/10 text-primary font-semibold border border-primary/20">
                  {coach.first_name[0]}{coach.last_name[0]}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate">
                {coach.full_name}
              </h3>
              <div className="flex items-center gap-1 mt-1">
                <Mail className="h-3 w-3 text-muted-foreground" />
                <p className="text-xs text-muted-foreground truncate">{coach.email}</p>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <User className="h-3 w-3 text-muted-foreground" />
                <Badge variant="outline" className="h-4 px-1.5 text-xs bg-primary/5 border-primary/20 text-primary capitalize">
                  {coach.sex}
                </Badge>
              </div>
            </div>
          </div>
          <CoachActions coach={coach} onDelete={onDelete} onUpdate={onUpdate} />
        </div>
      </CardHeader>

      <CardContent className="relative pt-0 space-y-3 flex-1 flex flex-col">        {/* Stats Row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 bg-card/60 backdrop-blur-sm rounded-lg px-2 py-1 border border-primary/10">
            <Trophy className="h-3.5 w-3.5 text-primary/70" />
            <span className="text-xs font-medium text-muted-foreground">Teams:</span>
            <span className="text-xs font-bold text-primary">{teamCount}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-card/60 backdrop-blur-sm rounded-lg px-2 py-1 border border-primary/10">
            <Users className="h-3.5 w-3.5 text-secondary/70" />
            <span className="text-xs font-medium text-muted-foreground">Players:</span>
            <span className="text-xs font-bold text-secondary">{totalPlayers}</span>
          </div>
        </div>

        {/* Sports */}
        {coach.sports && coach.sports.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <Target className="h-3.5 w-3.5 text-muted-foreground" />
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Qualified Sports</p>
            </div>
            <div className="flex flex-wrap gap-1">
              {coach.sports.map((sport) => (
                <Badge 
                  key={sport.id} 
                  variant="secondary" 
                  className="h-5 px-2 text-xs bg-primary/10 border-primary/20 text-primary hover:bg-primary/20 transition-colors"
                >
                  {sport.name}
                </Badge>
              ))}
            </div>
          </div>
        )}        {/* Teams List */}
        {coach.teams && coach.teams.length > 0 && (
          <div className="space-y-2 flex-1 flex flex-col">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Coaching Teams</p>
            <div className="space-y-1.5 flex-1 overflow-y-auto">
              {coach.teams.slice(0, 3).map((team) => (
                <div key={team.id} className="flex items-center gap-2 p-1.5 bg-card/40 backdrop-blur-sm rounded-md border border-primary/5">
                  {team.logo ? (
                    <img src={team.logo} alt={team.name} className="h-5 w-5 rounded-sm object-cover border border-primary/10" />
                  ) : (
                    <div 
                      className="h-5 w-5 rounded-sm border border-primary/20 flex items-center justify-center text-[8px] font-bold text-white shadow-sm"
                      style={{ backgroundColor: team.color || '#6b7280' }}
                    >
                      {team.abbreviation || team.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{team.name}</p>
                    <p className="text-[10px] text-muted-foreground">{team.sport_name} • {team.player_count} players</p>
                  </div>
                </div>
              ))}
              {coach.teams.length > 3 && (
                <div className="text-xs text-muted-foreground text-center py-1">
                  +{coach.teams.length - 3} more teams
                </div>
              )}
            </div>
          </div>
        )}

        {/* No Teams Message */}
        {(!coach.teams || coach.teams.length === 0) && (
          <div className="text-center py-3 flex-1 flex flex-col justify-center">
            <Trophy className="h-6 w-6 text-muted-foreground/50 mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">No teams assigned</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
  
  export default CoachCard;
  