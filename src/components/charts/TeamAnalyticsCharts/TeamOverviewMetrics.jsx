import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Trophy, Users } from 'lucide-react';
import { useTeamGames, useTeamTrainingSessions } from '@/hooks/useTeams';
import { formatEventDate } from './utils';

export const TeamOverviewMetrics = ({ overviewMetrics, analytics, teamSlug }) => {
  // Early return if no teamSlug is provided
  if (!teamSlug) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Upcoming Team Events
          </CardTitle>
          <CardDescription>View upcoming games and training sessions</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[200px]">
          <p className="text-muted-foreground">Team not selected</p>
        </CardContent>
      </Card>
    );
  }

  // Get today's date for filtering upcoming events
  const today = new Date();
  const todayString = today.toISOString().split('T')[0]; // Format as YYYY-MM-DD

  // Use TanStack Query hooks for data fetching
  const {
    data: gamesData,
    isLoading: gamesLoading,
    error: gamesError
  } = useTeamGames(teamSlug, { upcoming: true, limit: 5 });

  const {
    data: trainingsData,
    isLoading: trainingsLoading,
    error: trainingsError
  } = useTeamTrainingSessions(teamSlug, {
    start_date: todayString,
    limit: 5,
    sort_by: 'date'
  });

  // Process and validate the data
  const upcomingGames = React.useMemo(() => {
    if (!gamesData?.results) return [];
    
    return gamesData.results.filter(game => {
      return game && game.id && game.home_team && game.away_team && 
             typeof game.home_team === 'object' && typeof game.away_team === 'object';
    });
  }, [gamesData]);

  const upcomingTrainings = React.useMemo(() => {
    if (!trainingsData?.results) return [];
    
    const validTrainings = trainingsData.results.filter(training => {
      if (!training || !training.id || !training.date) return false;
      
      // Double-check that the training date is in the future or today
      const trainingDate = new Date(training.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset to start of day for comparison
      
      return trainingDate >= today;
    });
    
    // Sort trainings by date (ascending)
    return validTrainings.sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [trainingsData]);

  // Determine loading and error states
  const loading = gamesLoading || trainingsLoading;
  const error = gamesError || trainingsError;

  // Loading state
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Upcoming Team Events
          </CardTitle>
          <CardDescription>View upcoming games and training sessions</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[200px]">
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-sm text-muted-foreground">Loading team events...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Upcoming Team Events
          </CardTitle>
          <CardDescription>View upcoming games and training sessions</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[200px] text-destructive">
          <p>Failed to load upcoming events</p>
        </CardContent>
      </Card>
    );
  }

  // Empty state - no games or trainings
  if (upcomingGames.length === 0 && upcomingTrainings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Upcoming Team Events
          </CardTitle>
          <CardDescription>View upcoming games and training sessions</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[200px]">
          <p className="text-muted-foreground">No upcoming events scheduled</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Upcoming Team Events
        </CardTitle>
        <CardDescription>
          Next games and training sessions for your team
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upcoming Games */}
        <div>
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Trophy className="h-4 w-4 text-secondary" />
            Upcoming Games
          </h4>
          
          {upcomingGames.length > 0 ? (
            <div className="space-y-3">
              {upcomingGames.map((game) => game && (
                <div key={game.id || `game-${Math.random()}`} className="p-3 border rounded-md bg-card hover:bg-accent/50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">
                        {game.home_team?.name || 'Home Team'} vs {game.away_team?.name || 'Away Team'}
                      </p>
                      <p className="text-sm text-muted-foreground">{formatEventDate(game.scheduled_date)}</p>
                    </div>
                    <Badge variant={(game.home_team && game.team_id && game.home_team.id === game.team_id) ? "default" : "outline"}>
                      {(game.home_team && game.team_id && game.home_team.id === game.team_id) ? "Home" : "Away"}
                    </Badge>
                  </div>
                  {game.venue && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Venue: {game.venue}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 bg-muted/50 rounded text-center">
              <p className="text-sm text-muted-foreground">No upcoming games scheduled</p>
            </div>
          )}
        </div>
        
        {/* Upcoming Training Sessions */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            Upcoming Training Sessions
          </h4>
          
          {upcomingTrainings.length > 0 ? (
            <div className="space-y-3">
              {upcomingTrainings.map((training) => training && (
                <div key={training.id || `training-${Math.random()}`} className="p-3 border rounded-md bg-card hover:bg-accent/50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{training.title || "Team Training"}</p>
                      <p className="text-sm text-muted-foreground">{formatEventDate(training.date)}</p>
                    </div>
                    {training.duration && (
                      <Badge variant="outline">
                        {training.duration} mins
                      </Badge>
                    )}
                  </div>
                  {training.location && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Location: {training.location}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 bg-muted/50 rounded text-center">
              <p className="text-sm text-muted-foreground">No upcoming training sessions scheduled</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
