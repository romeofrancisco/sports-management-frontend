import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import { usePlayerOverview, usePlayerProgress } from '@/api/dashboardApi'
import { User, Trophy, Calendar, TrendingUp, Target, Activity, Clock, Radar } from 'lucide-react'
import UniversityPageHeader from '@/components/common/UniversityPageHeader'
import PlayerRadarChartContainer from '@/components/charts/PlayerRadarChart/PlayerRadarChartContainer'
import { useSelector } from 'react-redux'

const PlayerDashboard = () => {
  const { data: overview, isLoading: overviewLoading, error: overviewError } = usePlayerOverview()
  const { data: progress, isLoading: progressLoading, error: progressError } = usePlayerProgress()
  const { user } = useSelector((state) => state.auth)

  if (overviewLoading || progressLoading) {
    return <DashboardSkeleton />
  }

  if (overviewError || progressError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/2 to-secondary/2">
        <div className="p-4 md:p-6">
          <div className="bg-destructive/15 border border-destructive/50 rounded-lg p-4">
            <h3 className="text-destructive font-semibold">Error Loading Dashboard</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {overviewError?.message || progressError?.message || 'Failed to load dashboard data'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  const playerInfo = overview?.player_info

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/2 to-secondary/2">
      <div className="p-4 md:p-6 space-y-8">
        {/* Header */}
        <UniversityPageHeader
          title={`Welcome ${user?.first_name || 'Player'}!`}
          subtitle="Player Portal"
          description="Track your performance and upcoming activities"
          showOnlineStatus={true}
          showUniversityColors={true}
        />        <div className="animate-in fade-in-50 duration-500 delay-100 space-y-6">
          {/* Player Info Card */}
      {playerInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Player Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <div className="text-sm text-muted-foreground">Name</div>
                <div className="font-semibold">{playerInfo.name}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Team</div>
                <div className="font-semibold">{playerInfo.team?.name || 'Not assigned'}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Position</div>
                <div className="font-semibold">{playerInfo.position || 'Not assigned'}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Jersey Number</div>
                <Badge variant="outline" className="font-semibold">
                  #{playerInfo.jersey_number || 'N/A'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Games</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.upcoming_games?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Games scheduled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Training Sessions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overview?.training_summary?.total_sessions || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Sessions attended
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overview?.training_summary?.attendance_rate?.toFixed(1) || 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Training attendance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Training</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {overview?.training_summary?.last_training_date || 'No data'}
            </div>
            <p className="text-xs text-muted-foreground">
              Most recent session
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Games */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Upcoming Games
          </CardTitle>
          <CardDescription>Your scheduled matches</CardDescription>
        </CardHeader>
        <CardContent>
          {overview?.upcoming_games?.length > 0 ? (
            <div className="space-y-3">
              {overview.upcoming_games.slice(0, 5).map((game, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">vs {game.opponent}</div>
                    <div className="text-sm text-muted-foreground">
                      {game.date} • {game.location || 'TBD'}
                    </div>
                  </div>
                  <Badge variant="outline">{game.status || 'Scheduled'}</Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No upcoming games scheduled</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Performance */}
      {overview?.recent_stats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Recent Performance
            </CardTitle>
            <CardDescription>Your latest game statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(overview.recent_stats).map(([key, value]) => (
                <div key={key} className="text-center p-3 border rounded-lg">
                  <div className="text-2xl font-bold">{value}</div>
                  <div className="text-sm text-muted-foreground capitalize">
                    {key.replace('_', ' ')}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Personal Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Personal Progress
          </CardTitle>
          <CardDescription>Your training and development metrics</CardDescription>
        </CardHeader>
        <CardContent>
          {progress?.progress_metrics?.length > 0 ? (
            <div className="space-y-4">
              {progress.progress_metrics.slice(0, 6).map((metric, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{metric.metric_name}</span>
                    <span className="text-muted-foreground">
                      {metric.current_value} {metric.unit}
                    </span>
                  </div>
                  <Progress 
                    value={metric.progress_percentage || 0} 
                    className="h-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Target: {metric.target_value} {metric.unit}</span>
                    <span>{metric.progress_percentage?.toFixed(1) || 0}% complete</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No progress metrics available</p>
              <p className="text-sm">Complete training sessions to see your progress</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Progress Summary */}
      {progress?.progress_summary && (
        <Card>
          <CardHeader>
            <CardTitle>Progress Summary</CardTitle>
            <CardDescription>Overview of your development</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {progress.progress_summary.total_metrics || 0}
                </div>
                <div className="text-sm text-muted-foreground">Metrics Tracked</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {progress.progress_summary.average_improvement?.toFixed(1) || 0}%
                </div>
                <div className="text-sm text-muted-foreground">Avg Improvement</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {progress.progress_summary.goals_achieved || 0}
                </div>
                <div className="text-sm text-muted-foreground">Goals Achieved</div>
              </div>
            </div>
          </CardContent>        </Card>
      )}
        </div>
      </div>
    </div>
  )
}

const DashboardSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-background via-primary/2 to-secondary/2">
    <div className="p-4 md:p-6 space-y-8">
      <div>
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>
    
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-32" />
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i}>
              <Skeleton className="h-4 w-16 mb-1" />
              <Skeleton className="h-5 w-24" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
    
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-1" />
            <Skeleton className="h-3 w-24" />
          </CardContent>
        </Card>
      ))}
    </div>
    
    {[...Array(2)].map((_, i) => (
      <Card key={i}>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>        <CardContent>
          <Skeleton className="h-32 w-full" />        </CardContent>      </Card>
    ))}
    </div>
  </div>
)

export default PlayerDashboard
