import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Trophy, 
  Play, 
  Edit, 
  Trash2,
  Eye,
  FileText
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const GameCard = ({ game, onEdit, onDelete, onView, onStartGame, onStartingLineup, filterStatus }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "scheduled":
        return "bg-primary/15 text-primary border-primary/30";
      case "in_progress":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "completed":
        return "bg-secondary/15 text-secondary border-secondary/30";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "postponed":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "scheduled":
        return "secondary";
      case "live":
      case "in_progress":
        return "default";
      case "completed":
        return "outline";
      case "cancelled":
      case "postponed":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusBadgeClasses = (status) => {
    switch (status?.toLowerCase()) {
      case "scheduled":
        return "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100";
      case "live":
      case "in_progress":
        return "bg-green-50 text-green-700 border-green-200 hover:bg-green-100";
      case "completed":
        return "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100";
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200 hover:bg-red-100";
      case "postponed":
        return "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "scheduled":
        return <Clock className="w-3 h-3 mr-1" />;
      case "live":
      case "in_progress":
        return <Play className="w-3 h-3 mr-1" />;
      case "completed":
        return <Trophy className="w-3 h-3 mr-1" />;
      case "cancelled":
        return <Trash2 className="w-3 h-3 mr-1" />;
      case "postponed":
        return <Calendar className="w-3 h-3 mr-1" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return dateString;
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    try {
      return format(new Date(dateString), "hh:mm a");
    } catch {
      return "";
    }
  };  const getScoreDisplay = () => {
    if (game.status === "completed" || game.status === "in_progress") {
      // Check if it's a sets-based sport (volleyball)
      if (game.sport_slug === "volleyball" && game.score_summary?.total) {
        return `${game.score_summary.total.home || 0} - ${game.score_summary.total.away || 0}`;
      }
      // Points-based sports (basketball, etc.)
      return `${game.home_team_score || 0} - ${game.away_team_score || 0}`;
    }
    return null;
  };

  const getSportScoreLabel = () => {
    if (game.status === "completed") {
      if (game.sport_slug === "volleyball") {
        return "Sets Won";
      } else if (game.sport_slug === "basketball") {
        return "Final Score";
      }
      return "Final Score";
    } else if (game.status === "in_progress") {
      if (game.sport_slug === "volleyball") {
        return "Sets Won";
      } else if (game.sport_slug === "basketball") {
        return "Current Score";
      }
      return "Current Score";
    }
    return "Score";
  };
  const getDetailedScoreDisplay = () => {
    if (!game.score_summary?.periods || game.status === "scheduled") return null;
    
    const completedPeriods = game.score_summary.periods.filter(period => period.completed);
    if (completedPeriods.length === 0) return null;

    // Get team data
    const homeTeam = game.home_team || {};
    const awayTeam = game.away_team || {};
    const homeTotal = game.score_summary?.total?.home || game.home_team_score || 0;
    const awayTotal = game.score_summary?.total?.away || game.away_team_score || 0;
    
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="border-b border-border/30">
              <th className="text-left py-2 px-3 font-medium text-muted-foreground"></th>
              {completedPeriods.map((period, index) => (
                <th key={index} className="text-center py-2 px-2 font-medium text-muted-foreground">
                  {game.sport_slug === "volleyball" ? `S${period.label}` : `Q${period.label}`}
                </th>
              ))}
              <th className="text-center py-2 px-3 font-medium text-muted-foreground">T</th>
            </tr>
          </thead>
          <tbody>
            {/* Home Team Row */}
            <tr className="border-b border-border/20">
              <td className="text-left py-2 px-3 font-medium truncate max-w-[60px]" title={homeTeam.name}>
                {homeTeam.abbreviation || homeTeam.name?.substring(0, 3).toUpperCase() || "HOME"}
              </td>
              {completedPeriods.map((period, index) => (
                <td 
                  key={index} 
                  className={`text-center py-2 px-2 font-medium ${
                    period.home > period.away ? "text-primary font-bold" : "text-muted-foreground"
                  }`}
                >
                  {period.home}
                </td>
              ))}
              <td className="text-center py-2 px-3 font-bold text-primary">
                {homeTotal}
              </td>
            </tr>
            {/* Away Team Row */}
            <tr>
              <td className="text-left py-2 px-3 font-medium truncate max-w-[60px]" title={awayTeam.name}>
                {awayTeam.abbreviation || awayTeam.name?.substring(0, 3).toUpperCase() || "AWAY"}
              </td>
              {completedPeriods.map((period, index) => (
                <td 
                  key={index} 
                  className={`text-center py-2 px-2 font-medium ${
                    period.away > period.home ? "text-secondary font-bold" : "text-muted-foreground"
                  }`}
                >
                  {period.away}
                </td>
              ))}
              <td className="text-center py-2 px-3 font-bold text-secondary">
                {awayTotal}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  const isScheduled = game.status === "scheduled";
  const isInProgress = game.status === "in_progress";
  const isCompleted = game.status === "completed";  return (
    <Card className="h-full relative overflow-hidden bg-gradient-to-br from-card via-card to-card/95 shadow-xl border-2 border-primary/20">
      {/* Enhanced background effects */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/8 to-transparent rounded-full blur-2xl opacity-60"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-secondary/8 to-transparent rounded-full blur-xl opacity-40"></div>
      
      <CardHeader className="pb-3 relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 flex-1">            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-primary/80 shadow-lg border border-primary/30">
              <Trophy className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">              <h3 className="font-bold text-sm truncate bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {game.league?.name || "Exhibition Game"}
              </h3>
              {game.season?.name && (
                <p className="text-xs text-muted-foreground font-medium">
                  {game.season?.name} {game.season?.year}
                </p>
              )}
            </div>
          </div>          <Badge 
            variant="outline" 
            className={cn("text-xs font-bold shadow-sm backdrop-blur-sm", getStatusColor(game.status))}
          >
            {game.status?.replace("_", " ").toUpperCase() || "SCHEDULED"}
          </Badge>
        </div>
      </CardHeader>      <CardContent className="space-y-4 relative z-10">        {/* Teams - Horizontal Layout */}        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-card/80 via-card/60 to-card/80 backdrop-blur-sm rounded-xl border border-primary/10 shadow-sm">
          {/* Home Team */}
          <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
            <div className="relative">
              {game.home_team?.logo ? (
                <img 
                  src={game.home_team.logo} 
                  alt={game.home_team.name}
                  className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-lg shadow-sm border border-white/20"
                />
              ) : (                <div 
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center text-sm font-bold text-white shadow-lg border border-white/30"
                  style={{ backgroundColor: game.home_team?.color || '#6B7280' }}
                >
                  {game.home_team?.name?.charAt(0) || 'H'}
                </div>
              )}
              {/* Team status indicator */}
              <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-primary to-primary/80 rounded-full border-2 border-card shadow-sm"></div>
            </div>
            <div className="flex-1 min-w-0">              <p className="font-bold text-sm truncate">
                {game.home_team?.name || "Home Team"}
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-primary/10 text-primary border-primary/20">
                  HOME
                </Badge>
              </div>
            </div>
            {isCompleted && (
              <div className="text-xl sm:text-2xl font-bold text-primary ml-2">
                {game.home_team_score || 0}
              </div>
            )}
          </div>

          {/* VS Divider */}
          <div className="flex sm:flex-col items-center gap-1 px-2 sm:px-4">
            <div className="relative">              <div className="text-sm font-bold text-muted-foreground px-3 py-1.5 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border border-border/50 rounded-full shadow-sm backdrop-blur-sm">
                VS
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full opacity-0"></div>
            </div>
            {/* Game time/date below VS */}
            <div className="text-xs text-muted-foreground font-medium text-center whitespace-nowrap">
              {formatTime(game.date)}
            </div>
          </div>

          {/* Away Team */}
          <div className="flex items-center gap-3 flex-1 w-full sm:w-auto flex-row-reverse sm:flex-row-reverse">
            <div className="relative">
              {game.away_team?.logo ? (
                <img 
                  src={game.away_team.logo} 
                  alt={game.away_team.name}
                  className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-lg shadow-sm border border-white/20"
                />
              ) : (                <div 
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center text-sm font-bold text-white shadow-lg border border-white/30"
                  style={{ backgroundColor: game.away_team?.color || '#6B7280' }}
                >
                  {game.away_team?.name?.charAt(0) || 'A'}
                </div>
              )}
              {/* Team status indicator */}
              <div className="absolute -bottom-1 -left-1 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-secondary to-secondary/80 rounded-full border-2 border-card shadow-sm"></div>
            </div>
            <div className="flex-1 min-w-0 text-right">              <p className="font-bold text-sm truncate">
                {game.away_team?.name || "Away Team"}
              </p>
              <div className="flex items-center justify-end gap-2">
                <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-secondary/10 text-secondary border-secondary/20">
                  AWAY
                </Badge>
              </div>
            </div>
            {isCompleted && (
              <div className="text-xl sm:text-2xl font-bold text-secondary mr-2">
                {game.away_team_score || 0}
              </div>
            )}
          </div>
        </div>{/* Game Details - Horizontal Layout */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-card/50 via-card/30 to-card/50 backdrop-blur-sm rounded-xl border border-border/30 shadow-sm">
          <div className="flex flex-wrap items-center gap-3 sm:gap-6 w-full sm:w-auto">
            <div className="text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Date</p>
              <p className="text-sm font-bold">{formatDate(game.date)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Venue</p>
              <p className="text-sm font-bold truncate max-w-[80px] sm:max-w-[100px]" title={game.venue}>
                {game.venue || "TBD"}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">League</p>
              <Badge variant="outline" className="text-xs border-primary/20 text-primary bg-primary/5">
                {game.league?.name || "N/A"}
              </Badge>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Season</p>
              <p className="text-sm font-bold">{game.season?.name || "N/A"}</p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="text-center w-full sm:w-auto">
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">Status</p>
            <Badge 
              variant={getStatusVariant(game.status)} 
              className={`px-3 py-1 font-medium text-xs shadow-sm ${getStatusBadgeClasses(game.status)}`}
            >
              {getStatusIcon(game.status)}
              {game.status}
            </Badge>
          </div>
        </div>        {/* Enhanced Score Display for Completed/In Progress Games */}
        {(isCompleted || isInProgress) && getScoreDisplay() && (
          <div className="space-y-3">
            <div className="text-center p-3 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 rounded-xl border border-primary/20 shadow-sm backdrop-blur-sm">
              <p className="text-xs text-muted-foreground font-medium mb-1">
                {getSportScoreLabel()}
              </p>
              <p className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {getScoreDisplay()}
              </p>
            </div>            {/* Detailed Score Breakdown */}
            {getDetailedScoreDisplay() && (
              <div className="bg-card/30 rounded-lg border border-border/30 p-3">
                <p className="text-xs text-muted-foreground font-medium text-center mb-3">
                  {game.sport_slug === "volleyball" ? "Set Breakdown" : "Quarter Breakdown"}
                </p>
                {getDetailedScoreDisplay()}
              </div>
            )}
          </div>
        )}{/* Enhanced Action Buttons - Horizontal Layout */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-2 pt-3 border-t border-border/30">
          <div className="flex gap-1">            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView(game)}
              className="h-8 w-8 p-0"
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(game)}
              className="h-8 w-8 p-0"
              title="Edit Game"
            >
              <Edit className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(game)}
              className="h-8 w-8 p-0"
              title="Delete Game"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Conditional action buttons based on status */}
          <div className="flex gap-1 w-full sm:w-auto justify-end">
            {game.status === 'Scheduled' && (
              <>                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onStartingLineup(game)}
                  className="text-xs px-2 sm:px-3 py-1 h-8"
                >
                  <Users className="w-3 h-3 mr-1" />
                  <span className="hidden sm:inline">Lineup</span>
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => onStartGame(game)}
                  className="text-xs px-2 sm:px-3 py-1 h-8 bg-gradient-to-r from-primary to-primary/80 shadow-sm"
                >
                  <Play className="w-3 h-3 mr-1" />
                  Start
                </Button>
              </>
            )}

            {game.status === 'Live' && (              <Button
                variant="outline"
                size="sm"
                onClick={() => onStartingLineup(game)}
                className="text-xs px-2 sm:px-3 py-1 h-8"
              >
                <Users className="w-3 h-3 mr-1" />
                <span className="hidden sm:inline">Manage</span>
              </Button>
            )}

            {game.status === 'Completed' && (              <Button
                variant="outline"
                size="sm"
                onClick={() => onView(game)}
                className="text-xs px-2 sm:px-3 py-1 h-8"
              >
                <FileText className="w-3 h-3 mr-1" />
                <span className="hidden sm:inline">Boxscore</span>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameCard;
