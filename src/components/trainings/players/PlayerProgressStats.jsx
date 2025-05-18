import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, Trophy, BarChart3 } from "lucide-react";

const PlayerProgressStats = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border shadow-sm card-hover-effect">
        <CardContent className="p-4 flex items-center">
          <div className="bg-blue-100 dark:bg-blue-800 p-2 rounded-full mr-4">
            <Activity className="h-5 w-5 text-blue-700 dark:text-blue-300" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Recent Improvement
            </p>
            <p className="text-xl font-semibold">+12%</p>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border shadow-sm card-hover-effect">
        <CardContent className="p-4 flex items-center">
          <div className="bg-green-100 dark:bg-green-800 p-2 rounded-full mr-4">
            <Trophy className="h-5 w-5 text-green-700 dark:text-green-300" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Top Performance
            </p>
            <p className="text-xl font-semibold">15.6s</p>
            <p className="text-xs text-muted-foreground">
              Sprint time (best)
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="sm:col-span-2 md:col-span-1">
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border shadow-sm card-hover-effect h-full">
          <CardContent className="p-4 flex items-center">
            <div className="bg-purple-100 dark:bg-purple-800 p-2 rounded-full mr-4">
              <BarChart3 className="h-5 w-5 text-purple-700 dark:text-purple-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Training Sessions
              </p>
              <p className="text-xl font-semibold">24</p>
              <p className="text-xs text-muted-foreground">
                This season
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlayerProgressStats;
