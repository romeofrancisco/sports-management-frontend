import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, Calendar } from "lucide-react";
import PlayerProgressMultiView from "./PlayerProgressMultiView";

const TeamPlayerView = ({ teamSlug, dateRange }) => {
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
    <div className="space-y-6">      {/* Enhanced Header Section */}
      <Card className="border-0 bg-gradient-to-r from-primary/5 via-secondary/8 to-primary/5 shadow-xl overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Team Performance Analysis
                </CardTitle>
              </div>
              <CardDescription className="text-sm text-muted-foreground flex items-center gap-2 mb-3">
                <TrendingUp className="h-4 w-4" />
                Compare performance metrics and progress across all team players
              </CardDescription>
              
              {/* Enhanced Date Range Display */}
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-primary/10 border-primary/30 text-primary px-3 py-1">
                  <Calendar className="h-3 w-3 mr-2" />
                  {formatDateRange()}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>      {/* Enhanced Multi-View Container */}
      <div className="relative">
        <PlayerProgressMultiView
          teamSlug={teamSlug}
          dateRange={dateRange}
        />
      </div>
    </div>
  );
};

export default TeamPlayerView;
