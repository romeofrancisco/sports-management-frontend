import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Users,
  Trophy,
  Calendar,
  Target,
  Activity,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react'

// Key Metrics Summary Card
export const MetricsSummaryCard = ({ overview, analytics, insights }) => {
  if (!overview || !analytics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Key Metrics Summary</CardTitle>
          <CardDescription>System health and performance overview</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-muted-foreground">Loading metrics...</div>
        </CardContent>
      </Card>
    )
  }

  const healthScore = insights?.system_health_score || 0
  const attendanceRate = analytics?.training_analytics?.overall_attendance_rate || 0
  const teamUtilization = analytics?.performance_analytics?.team_utilization_rate || 0
  const leagueActivity = analytics?.system_health?.league_activity_rate || 0

  const getHealthColor = (score) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getTrendIcon = (trend) => {
    switch(trend) {
      case 'increasing': return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'decreasing': return <TrendingDown className="h-4 w-4 text-red-500" />
      default: return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Key Metrics Summary
        </CardTitle>
        <CardDescription>System health and performance overview</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* System Health Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">System Health Score</span>
            <span className="text-lg font-bold">{healthScore}/100</span>
          </div>
          <Progress value={healthScore} className="h-2" />
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getHealthColor(healthScore)}`} />
            <span className="text-xs text-muted-foreground">
              {healthScore >= 80 ? 'Excellent' : healthScore >= 60 ? 'Good' : 'Needs Attention'}
            </span>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              <span className="text-sm">Total Teams</span>
            </div>
            <div className="text-2xl font-bold">{overview?.system_overview?.total_teams || 0}</div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span className="text-sm">Active Players</span>
            </div>
            <div className="text-2xl font-bold">{overview?.system_overview?.total_players || 0}</div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-green-500" />
              <span className="text-sm">Games This Month</span>
            </div>
            <div className="text-2xl font-bold">{overview?.recent_activity?.games_this_month || 0}</div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-purple-500" />
              <span className="text-sm">Training Sessions</span>
            </div>
            <div className="text-2xl font-bold">{overview?.recent_activity?.training_sessions_month || 0}</div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Performance Indicators</h4>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Training Attendance</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{attendanceRate.toFixed(1)}%</span>
                {getTrendIcon(analytics?.training_analytics?.training_trend)}
              </div>
            </div>
            <Progress value={attendanceRate} className="h-1" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Team Utilization</span>
              <span className="text-sm font-medium">{teamUtilization.toFixed(1)}%</span>
            </div>
            <Progress value={teamUtilization} className="h-1" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">League Activity</span>
              <span className="text-sm font-medium">{leagueActivity.toFixed(1)}%</span>
            </div>
            <Progress value={leagueActivity} className="h-1" />
          </div>
        </div>

        {/* Alerts Summary */}
        {insights && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">System Alerts</h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">Warnings</span>
              </div>
              <Badge variant="outline">{insights?.summary?.warnings || 0}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-sm">Successes</span>
              </div>
              <Badge variant="outline">{insights?.summary?.successes || 0}</Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Real-time Activity Card
export const RealTimeActivityCard = ({ overview }) => {
  if (!overview) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Real-time Activity</CardTitle>
          <CardDescription>Current system activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">Loading activity...</div>
        </CardContent>
      </Card>
    )
  }

  const activities = [
    {
      label: 'Active Users Today',
      value: overview?.user_activity?.active_users_today || 0,
      icon: Users,
      color: 'text-blue-500'
    },
    {
      label: 'Scheduled Games',
      value: overview?.recent_activity?.games_scheduled || 0,
      icon: Calendar,
      color: 'text-green-500'
    },
    {
      label: 'Upcoming Trainings',
      value: overview?.recent_activity?.upcoming_trainings || 0,
      icon: Target,
      color: 'text-purple-500'
    },
    {
      label: 'New Users This Week',
      value: overview?.user_activity?.new_users_week || 0,
      icon: TrendingUp,
      color: 'text-orange-500'
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Real-time Activity</CardTitle>
        <CardDescription>Current system activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {activities.map((activity, index) => {
            const Icon = activity.icon
            return (
              <div key={index} className="flex items-center space-x-2">
                <Icon className={`h-4 w-4 ${activity.color}`} />
                <div>
                  <div className="text-sm text-muted-foreground">{activity.label}</div>
                  <div className="text-lg font-semibold">{activity.value}</div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

// System Issues Alert Card
export const SystemIssuesCard = ({ overview, insights }) => {
  if (!overview) {
    return null
  }

  const issues = [
    {
      title: 'Unassigned Players',
      count: overview?.system_health?.unassigned_players || 0,
      severity: 'medium',
      description: 'Players not assigned to any team'
    },
    {
      title: 'Teams Without Coaches',
      count: overview?.system_health?.teams_without_coaches || 0,
      severity: 'high',
      description: 'Teams that need coach assignment'
    },
    {
      title: 'Understaffed Teams',
      count: overview?.system_health?.teams_with_few_players || 0,
      severity: 'medium',
      description: 'Teams with fewer than 5 players'
    }
  ]

  const hasIssues = issues.some(issue => issue.count > 0)

  if (!hasIssues) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            System Status
          </CardTitle>
          <CardDescription>All systems operating normally</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-2" />
            <p className="text-green-600 font-medium">No issues detected</p>
            <p className="text-sm text-muted-foreground">System is running smoothly</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'high': return 'text-red-500 bg-red-50 border-red-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-blue-500 bg-blue-50 border-blue-200'
      default: return 'text-gray-500 bg-gray-50 border-gray-200'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          System Issues
        </CardTitle>
        <CardDescription>Issues requiring attention</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {issues.filter(issue => issue.count > 0).map((issue, index) => (
            <div key={index} className={`p-3 rounded-lg border ${getSeverityColor(issue.severity)}`}>
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">{issue.title}</div>
                  <div className="text-sm opacity-75">{issue.description}</div>
                </div>
                <Badge variant="outline" className="ml-2">
                  {issue.count}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
