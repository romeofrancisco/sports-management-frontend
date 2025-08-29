import React from 'react';
import { 
  Activity,
  UserCheck,
  Users,
  Trophy,
  Target,
  PieChart
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

const DistributionSection = ({ overview }) => {
  return (
    <Card className="bg-gradient-to-br from-card via-card to-card/95 shadow-xl border-2 border-primary/20 transition-all duration-300 hover:shadow-2xl hover:border-primary/30 relative overflow-hidden">
      <CardContent className="relative">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110">
                <PieChart className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold tracking-tight text-gradient">
                  Sports & Gender Distribution
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Complete breakdown of teams and players by sport and gender
                </p>
              </div>
            </div>
          </div>

          {/* Sports Cards with Gender Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(overview?.distribution_stats?.teams_by_sport || []).length > 0 ? (
              (overview?.distribution_stats?.teams_by_sport || []).map((sport, index) => {
                // Get gender data for this sport
                const sportPlayers = (overview?.distribution_stats?.gender_stats?.players_by_gender_sport || []).filter(
                  p => p.team__sport__name === sport.sport__name
                );
                const sportTeams = (overview?.distribution_stats?.gender_stats?.teams_by_division_sport || []).filter(
                  t => t.sport__name === sport.sport__name
                );
                
                const malePlayers = sportPlayers.find(p => p.user__sex === 'male')?.count || 0;
                const femalePlayers = sportPlayers.find(p => p.user__sex === 'female')?.count || 0;
                const maleTeams = sportTeams.find(t => t.division === 'male')?.count || 0;
                const femaleTeams = sportTeams.find(t => t.division === 'female')?.count || 0;

                return (
                  <div 
                    key={sport.sport__name || index}
                    className={`p-4 rounded-lg border-2 border-primary/20 bg-gradient-to-br from-card to-primary/10 transition-all duration-300 hover:shadow-lg hover:scale-105 animate-in fade-in-50 duration-500`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="text-center mb-4">
                      <div className="text-lg font-bold text-primary capitalize">
                        {sport.sport__name || 'Unknown Sport'}
                      </div>
                    </div>
                    
                    {/* Overall Totals */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="text-center p-3 rounded-md bg-primary/10 border border-primary/20">
                        <div className="text-xl font-bold text-primary">
                          {sport.team_count || 0}
                        </div>
                        <div className="text-xs text-muted-foreground font-medium">
                          Total {sport.team_count === 1 ? 'Team' : 'Teams'}
                        </div>
                      </div>
                      
                      <div className="text-center p-3 rounded-md bg-primary/10 border border-primary/20">
                        <div className="text-xl font-bold text-primary">
                          {sport.active_players || 0}
                        </div>
                        <div className="text-xs text-muted-foreground font-medium">
                          Total {sport.active_players === 1 ? 'Player' : 'Players'}
                        </div>
                      </div>
                    </div>

                    {/* Gender Breakdown */}
                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-muted-foreground text-center">
                        Gender Distribution
                      </div>
                      
                      {/* Teams by Gender */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-center p-2 rounded bg-blue-50 border border-blue-200">
                          <div className="text-sm font-bold text-blue-700">{maleTeams}</div>
                          <div className="text-xs text-blue-600">Male Teams</div>
                        </div>
                        <div className="text-center p-2 rounded bg-pink-50 border border-pink-200">
                          <div className="text-sm font-bold text-pink-700">{femaleTeams}</div>
                          <div className="text-xs text-pink-600">Female Teams</div>
                        </div>
                      </div>

                      {/* Players by Gender */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-center p-2 rounded bg-indigo-50 border border-indigo-200">
                          <div className="text-sm font-bold text-indigo-700">{malePlayers}</div>
                          <div className="text-xs text-indigo-600">Male Players</div>
                        </div>
                        <div className="text-center p-2 rounded bg-rose-50 border border-rose-200">
                          <div className="text-sm font-bold text-rose-700">{femalePlayers}</div>
                          <div className="text-xs text-rose-600">Female Players</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Activity className="h-8 w-8 text-primary" />
                </div>
                <p className="font-medium">No sports data available</p>
                <p className="text-sm text-muted-foreground/70 mt-1">
                  Sports distribution will appear once teams are created
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DistributionSection;
