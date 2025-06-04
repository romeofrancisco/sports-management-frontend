import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Heart, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  UserMinus, 
  Activity,
  Thermometer
} from "lucide-react";

const TeamHealthCard = ({ healthData = {} }) => {
  const {
    total_players = 0,
    healthy_players = 0,
    injured_players = 0,
    recovery_players = 0,
    fitness_level = 0,
    injury_rate = 0,
    availability_rate = 0,
    recent_injuries = []
  } = healthData;

  const healthPercentage = total_players > 0 ? (healthy_players / total_players) * 100 : 0;
  const injuryPercentage = total_players > 0 ? (injured_players / total_players) * 100 : 0;

  const getHealthStatus = () => {
    if (healthPercentage >= 90) return { label: "Excellent", color: "text-green-600 border-green-600", icon: CheckCircle };
    if (healthPercentage >= 75) return { label: "Good", color: "text-blue-600 border-blue-600", icon: Shield };
    if (healthPercentage >= 60) return { label: "Fair", color: "text-yellow-600 border-yellow-600", icon: AlertTriangle };
    return { label: "Concern", color: "text-red-600 border-red-600", icon: AlertTriangle };
  };

  const getFitnessLevel = () => {
    if (fitness_level >= 80) return { label: "Peak", color: "text-green-600" };
    if (fitness_level >= 60) return { label: "Good", color: "text-blue-600" };
    if (fitness_level >= 40) return { label: "Average", color: "text-yellow-600" };
    return { label: "Poor", color: "text-red-600" };
  };

  const healthStatus = getHealthStatus();
  const fitnessStatus = getFitnessLevel();
  const HealthIcon = healthStatus.icon;

  return (
    <Card className="bg-gradient-to-br from-card via-card to-card/95 shadow-xl border-2 border-primary/20 transition-all duration-500 hover:shadow-2xl hover:border-primary/30">
      <CardHeader>
        <CardTitle className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Team Health
        </CardTitle>
        <CardDescription>
          Player health and fitness overview
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Health Status */}
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20">
          <div className="flex items-center gap-3">
            <HealthIcon className={`h-5 w-5 ${healthStatus.color.split(' ')[0]}`} />
            <div>
              <p className="text-sm font-medium">Overall Health</p>
              <p className="text-lg font-bold">{Math.round(healthPercentage)}%</p>
            </div>
          </div>
          <Badge variant="outline" className={healthStatus.color}>
            {healthStatus.label}
          </Badge>
        </div>

        {/* Player Status Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
            <CheckCircle className="h-5 w-5 text-green-600 mx-auto mb-1" />
            <p className="text-sm font-medium text-green-700 dark:text-green-400">Healthy</p>
            <p className="text-lg font-bold text-green-800 dark:text-green-300">{healthy_players}</p>
          </div>
          
          <div className="text-center p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
            <UserMinus className="h-5 w-5 text-red-600 mx-auto mb-1" />
            <p className="text-sm font-medium text-red-700 dark:text-red-400">Injured</p>
            <p className="text-lg font-bold text-red-800 dark:text-red-300">{injured_players}</p>
          </div>
          
          <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <Heart className="h-5 w-5 text-yellow-600 mx-auto mb-1" />
            <p className="text-sm font-medium text-yellow-700 dark:text-yellow-400">Recovery</p>
            <p className="text-lg font-bold text-yellow-800 dark:text-yellow-300">{recovery_players}</p>
          </div>
        </div>

        {/* Fitness Level */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Thermometer className="h-4 w-4 text-secondary" />
              <span className="text-sm font-medium">Team Fitness Level</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">{fitness_level}%</span>
              <Badge variant="outline" className={fitnessStatus.color}>
                {fitnessStatus.label}
              </Badge>
            </div>
          </div>
          <Progress value={fitness_level} className="h-2" />
        </div>

        {/* Availability Rate */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Availability Rate</span>
            </div>
            <span className="text-sm font-bold">{availability_rate}%</span>
          </div>
          <Progress value={availability_rate} className="h-2" />
        </div>

        {/* Recent Injuries */}
        {recent_injuries.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              Recent Injuries
            </h4>
            <div className="space-y-2 max-h-24 overflow-y-auto">
              {recent_injuries.slice(0, 3).map((injury, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <div>
                    <p className="text-xs font-medium text-yellow-800 dark:text-yellow-300">
                      {injury.player_name || 'Unknown Player'}
                    </p>
                    <p className="text-xs text-yellow-600 dark:text-yellow-400">
                      {injury.injury_type || 'Injury'}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs text-yellow-600 border-yellow-600">
                    {injury.days_ago ? `${injury.days_ago}d ago` : 'Recent'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Metrics Summary */}
        <div className="pt-3 border-t border-border">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Injury Rate: {injury_rate}%</span>
            <span>Total Players: {total_players}</span>
          </div>
        </div>

        {/* Empty State */}
        {total_players === 0 && (
          <div className="text-center py-6">
            <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No health data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TeamHealthCard;