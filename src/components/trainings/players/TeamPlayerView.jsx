import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Users, TrendingUp, Calendar } from "lucide-react";
import PlayerProgressMultiView from "./PlayerProgressMultiView";

const TeamPlayerView = ({ teamSlug, dateRange, onBackClick, onDateChange }) => {
  // Format date range for display
  const formatDateRange = () => {
    if (!dateRange?.from && !dateRange?.to) return "All time";
    if (dateRange?.from && dateRange?.to) {
      const from = new Date(dateRange.from).toLocaleDateString();
      const to = new Date(dateRange.to).toLocaleDateString();
      return `${from} - ${to}`;
    }
    if (dateRange?.from) {
      return `From ${new Date(dateRange.from).toLocaleDateString()}`;
    }
    if (dateRange?.to) {
      return `Until ${new Date(dateRange.to).toLocaleDateString()}`;
    }
    return "All time";
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header Section - matching individual view */}
      <Card className="bg-gradient-to-r from-primary/5 via-primary/10 to-secondary/5 border-0 shadow-lg overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4">
            {/* Top Row - Back Button and Title */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0 rounded-full hover:bg-white/20 transition-all duration-200 backdrop-blur-sm border border-white/10 shadow-sm"
                onClick={onBackClick}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back to team list</span>
              </Button>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-1.5 bg-primary/10 rounded-lg">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Team Comparison
                  </CardTitle>
                </div>
                <CardDescription className="text-sm text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="h-3 w-3" />
                  Compare performance metrics across team players
                </CardDescription>
              </div>
            </div>

            {/* Date Range Badge */}
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-white/10 border-white/20 text-foreground backdrop-blur-sm">
                <Calendar className="h-3 w-3 mr-1" />
                {formatDateRange()}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Chart Section with Improved Container */}
      <Card className="bg-gradient-to-br from-background to-muted/20 overflow-hidden">
        <CardContent className="p-0">
          <PlayerProgressMultiView
            teamSlug={teamSlug}
            dateRange={dateRange}
            onDateChange={onDateChange}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamPlayerView;
