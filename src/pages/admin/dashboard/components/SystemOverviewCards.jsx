import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Trophy, 
  Gamepad2, 
  TrendingUp, 
  UserCheck,
  Target
} from 'lucide-react';

const SystemOverviewCards = ({ overview }) => {  const systemStats = [
    {
      title: 'Total Teams',
      value: overview?.system_overview?.total_teams || 0,
      icon: Users,
      description: 'Active teams',
      trend: null,
      color: 'from-primary via-primary/90 to-primary/80',
      iconBg: 'bg-primary',
      iconColor: 'text-primary'
    },
    {
      title: 'Active Players', 
      value: overview?.system_overview?.total_players || 0,
      icon: UserCheck,
      description: 'Players with teams',
      trend: null,
      color: 'from-secondary via-secondary/90 to-secondary/80',
      iconBg: 'bg-secondary',
      iconColor: 'text-secondary'
    },
    {
      title: 'Total Coaches',
      value: overview?.system_overview?.total_coaches || 0,
      icon: Target,
      description: 'Active coaches',
      trend: null,
      color: 'from-primary/80 via-primary/70 to-primary/60',
      iconBg: 'bg-gradient-to-br from-primary to-primary/80',
      iconColor: 'text-primary'
    },
    {
      title: 'Games Played',
      value: overview?.system_overview?.total_games || 0,
      icon: Gamepad2,
      description: 'All-time games',
      trend: null,
      color: 'from-secondary/80 via-secondary/70 to-secondary/60',
      iconBg: 'bg-gradient-to-br from-secondary to-secondary/80',
      iconColor: 'text-secondary'
    }
  ];

  return (
    <div className="space-y-6">
      {/* System Overview Cards */}
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {systemStats.map((stat, index) => {
            const Icon = stat.icon;
            return (              <Card 
                key={stat.title} 
                className={`group relative overflow-hidden border-2 border-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:scale-[1.02] animate-in fade-in-50 duration-500 bg-gradient-to-br backdrop-blur-sm`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Enhanced Gradient Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-8 group-hover:opacity-12 transition-opacity duration-300`}
                ></div>
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/15 to-transparent rounded-full blur-2xl opacity-60"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-white/10 to-transparent rounded-full blur-xl opacity-40"></div><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative">
                  <CardTitle className="text-sm font-semibold text-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-3 rounded-xl ${stat.iconBg} shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110 group-hover:rotate-3`}>
                    <Icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                </CardHeader>                <CardContent className="relative z-10">
                  <div className={`text-2xl md:text-3xl font-bold ${stat.iconColor} drop-shadow-sm tracking-tight`}>
                    {stat.value.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-3 font-medium tracking-wide">
                    {stat.description}
                  </p>
                  {stat.trend && (
                    <div className="flex items-center mt-2">
                      <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                      <span className="text-xs text-green-500 font-medium">
                        {stat.trend}
                      </span>
                    </div>
                  )}
                </CardContent></Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SystemOverviewCards;
