import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, ArrowRight } from 'lucide-react';

const TeamPlayersSection = ({ analytics, quickStats, attendanceOverview, attendanceTrends }) => {
  return (
    <div className="space-y-6">
      {/* Redirect message to Training Session Analysis */}
      <Card className="border-dashed border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Users className="h-5 w-5" />
            Player Analytics
          </CardTitle>
          <CardDescription>
            Player activity and engagement metrics have been consolidated
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <span>Player analysis is now available in</span>
                <div className="flex items-center gap-1 font-medium text-primary">
                  <span>Training Session Analysis</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground max-w-md">
                Check the Training Section below for comprehensive player activity, engagement metrics, and participation analytics.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamPlayersSection;
