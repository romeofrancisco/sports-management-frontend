import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useAdminOverview, useAdminAnalytics } from '@/api/dashboardApi'
import { Users, Trophy, Gamepad2, TrendingUp, BarChart3, Calendar } from 'lucide-react'

const AdminDashboard = () => {
  const { data: overview, isLoading: overviewLoading, error: overviewError } = useAdminOverview()
  const { data: analytics, isLoading: analyticsLoading, error: analyticsError } = useAdminAnalytics()

  if (overviewLoading || analyticsLoading) {
    return <DashboardSkeleton />
  }

  if (overviewError || analyticsError) {
    return (
      <div className="p-6">
        <div className="bg-destructive/15 border border-destructive/50 rounded-lg p-4">
          <h3 className="text-destructive font-semibold">Error Loading Dashboard</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {overviewError?.message || analyticsError?.message || 'Failed to load dashboard data'}
          </p>
        </div>
      </div>
    )
  }

  const systemStats = [
    {
      title: 'Total Teams',
      value: overview?.system_overview?.total_teams || 0,
      icon: Users,
      description: 'Active teams'
    },
    {
      title: 'Total Players', 
      value: overview?.system_overview?.total_players || 0,
      icon: Users,
      description: 'Registered players'
    },
    {
      title: 'Total Coaches',
      value: overview?.system_overview?.total_coaches || 0,
      icon: Users,
      description: 'Active coaches'
    },
    {
      title: 'Total Games',
      value: overview?.system_overview?.total_games || 0,
      icon: Gamepad2,
      description: 'Games played'
    }
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          System overview and analytics for sports management
        </p>
      </div>

      {/* System Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {systemStats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Recent Activity
            </CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">Recent Games</span>
              <Badge variant="secondary">
                {overview?.recent_activity?.recent_games || 0}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Training Sessions</span>
              <Badge variant="secondary">
                {overview?.recent_activity?.recent_training_sessions || 0}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">New Players</span>
              <Badge variant="secondary">
                {overview?.recent_activity?.recent_player_registrations || 0}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Teams by Sport
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {overview?.distribution_stats?.teams_by_sport?.slice(0, 5).map((sport, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm">{sport.sport__name || 'Unknown'}</span>
                  <Badge variant="outline">{sport.count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              System Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">Overall Attendance</span>
              <Badge variant="secondary">
                {analytics?.attendance_analytics?.overall_attendance_rate?.toFixed(1) || 0}%
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Completed Games</span>
              <Badge variant="secondary">
                {analytics?.game_analytics?.completed_games || 0}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Upcoming Games</span>
              <Badge variant="secondary">
                {analytics?.game_analytics?.upcoming_games || 0}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Players by Sport */}
      <Card>
        <CardHeader>
          <CardTitle>Player Distribution</CardTitle>
          <CardDescription>Players across different sports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {overview?.distribution_stats?.players_by_sport?.map((sport, index) => (
              <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                <span className="font-medium">{sport.team__sport__name || 'Unknown'}</span>
                <div className="text-right">
                  <div className="text-2xl font-bold">{sport.count}</div>
                  <div className="text-sm text-muted-foreground">players</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const DashboardSkeleton = () => (
  <div className="p-6 space-y-6">
    <div>
      <Skeleton className="h-8 w-64 mb-2" />
      <Skeleton className="h-4 w-96" />
    </div>
    
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
    
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(3)].map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-5 w-8" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
)

export default AdminDashboard
