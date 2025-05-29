import React from "react";
import { useParams, useNavigate } from "react-router";
import { useTeamDetails } from "@/hooks/useTeams";
import Loading from "@/components/common/FullLoading";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  ArrowLeft, 
  Users, 
  Trophy, 
  Target, 
  Calendar,
  MapPin,
  Edit,
  Settings,
  TrendingUp,
  Award
} from "lucide-react";
import { getDivisionLabel } from "@/constants/team";

const TeamDetails = () => {
  const { team } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useTeamDetails(team);

  if (isLoading) return <Loading />;

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/2 to-secondary/2 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Team not found</h2>
          <p className="text-muted-foreground mb-4">The requested team could not be found.</p>
          <Button onClick={() => navigate('/teams')} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Teams
          </Button>
        </div>
      </div>
    );
  }

  const teamColor = data.color || "#3B82F6";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/2 to-secondary/2">
      <div className="p-4 md:p-6 space-y-8">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-card via-secondary/8 to-primary/8 rounded-xl p-4 md:p-6 shadow-xl border-2 border-primary/20 transition-all duration-300 hover:shadow-2xl animate-in fade-in-50 duration-500 relative overflow-hidden">
          {/* Enhanced background effects */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-secondary/15 to-transparent rounded-full blur-3xl opacity-70"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-primary/15 to-transparent rounded-full blur-2xl opacity-60"></div>

          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6">
              {/* Back Button */}
              <Button 
                onClick={() => navigate('/teams')} 
                variant="outline"
                size="sm"
                className="self-start bg-card/80 backdrop-blur-md border-2 border-primary/30 hover:bg-primary/10"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Teams
              </Button>

              {/* Team Logo */}
              <div className="flex-shrink-0 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg blur-sm opacity-60"></div>
                <div className="relative bg-card p-3 rounded-xl shadow-lg border-2 border-secondary/30">
                  <Avatar className="h-12 w-12 md:h-16 md:w-16">
                    <AvatarImage src={data.logo} alt={data.name} />
                    <AvatarFallback 
                      className="font-bold text-white text-lg md:text-2xl"
                      style={{ backgroundColor: teamColor }}
                    >
                      {data.name[0]}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
              
              <div className="sm:border-l-2 sm:border-primary/40 sm:pl-4 md:pl-6">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {data.name}
                  </h1>
                  {data.abbreviation && (
                    <Badge 
                      className="font-bold"
                      style={{ 
                        backgroundColor: `${teamColor}20`,
                        color: teamColor,
                        borderColor: `${teamColor}50`
                      }}
                    >
                      {data.abbreviation}
                    </Badge>
                  )}
                </div>
                <p className="text-foreground mt-1 md:mt-2 text-sm sm:text-base md:text-lg font-semibold">
                  {data.sport_name} Team
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {getDivisionLabel(data.division)}
                  </Badge>
                  {data.coach_name && (
                    <span className="text-muted-foreground text-xs sm:text-sm font-medium">
                      Coach: {data.coach_name}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 lg:gap-6 mt-4 lg:mt-0">
              <Button
                onClick={() => navigate(`/teams/${team}/edit`)}
                className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg border border-primary/30 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                size="sm"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Team
              </Button>
              
              {/* Enhanced Status Indicator */}
              <div className="flex items-center gap-2 md:gap-3 bg-card/80 backdrop-blur-md rounded-full px-3 md:px-4 py-2 border-2 border-secondary/30 shadow-lg">
                <div className="h-2.5 w-2.5 md:h-3 md:w-3 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 animate-pulse shadow-sm"></div>
                <span className="text-xs md:text-sm font-semibold text-foreground whitespace-nowrap">
                  Team Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Team Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in-50 duration-500 delay-100">
          <Card className="bg-gradient-to-br from-card via-card to-card/95 shadow-lg border border-primary/20 transition-all duration-300 hover:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Players
              </CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {data.player_count || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Active team members
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card via-card to-card/95 shadow-lg border border-primary/20 transition-all duration-300 hover:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Games Played
              </CardTitle>
              <Trophy className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {data.games_played || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                This season
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card via-card to-card/95 shadow-lg border border-primary/20 transition-all duration-300 hover:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Win Rate
              </CardTitle>
              <Award className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {data.win_rate ? `${data.win_rate}%` : "0%"}
              </div>
              <p className="text-xs text-muted-foreground">
                Season performance
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card via-card to-card/95 shadow-lg border border-primary/20 transition-all duration-300 hover:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Training Sessions
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {data.training_sessions || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Completed this month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Team Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Team Details */}
          <Card className="bg-gradient-to-br from-card via-card to-card/95 shadow-xl border-2 border-primary/20 transition-all duration-300 hover:shadow-2xl animate-in fade-in-50 duration-500 delay-200">
            <CardHeader>
              <CardTitle className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Team Information
              </CardTitle>
              <CardDescription>
                Detailed information about the team
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.description && (
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">{data.description}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">Division</h4>
                  <Badge variant="outline">{getDivisionLabel(data.division)}</Badge>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">Sport</h4>
                  <Badge variant="outline">{data.sport_name}</Badge>
                </div>
              </div>

              {data.founded_date && (
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">Founded</h4>
                  <p className="text-sm text-muted-foreground">{new Date(data.founded_date).toLocaleDateString()}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-gradient-to-br from-card via-card to-card/95 shadow-xl border-2 border-primary/20 transition-all duration-300 hover:shadow-2xl animate-in fade-in-50 duration-500 delay-300">
            <CardHeader>
              <CardTitle className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Quick Actions
              </CardTitle>
              <CardDescription>
                Manage team activities and settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate(`/teams/${team}/players`)}
              >
                <Users className="mr-2 h-4 w-4" />
                Manage Players
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate(`/teams/${team}/schedule`)}
              >
                <Calendar className="mr-2 h-4 w-4" />
                View Schedule
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate(`/teams/${team}/training`)}
              >
                <Target className="mr-2 h-4 w-4" />
                Training Sessions
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate(`/teams/${team}/settings`)}
              >
                <Settings className="mr-2 h-4 w-4" />
                Team Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TeamDetails;
