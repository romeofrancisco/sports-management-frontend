import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import PlayerProgressMultiView from "./PlayerProgressMultiView";

const TeamPlayerView = ({ teamSlug, dateRange, onBackClick }) => {
  return (
    <Card>
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 rounded-full"
              onClick={onBackClick}
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
            </Button>
            Team Comparison
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <PlayerProgressMultiView
          teamSlug={teamSlug}
          dateRange={dateRange}
        />
      </CardContent>
    </Card>
  );
};

export default TeamPlayerView;
