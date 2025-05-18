import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Calendar, TrendingUp } from "lucide-react";

const PlayerProgressQuickActions = ({ openModal, playerId, teamSlug }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <Button
        variant="outline"
        size="sm"
        className="shadow-sm"
        onClick={() =>
          openModal(playerId, teamSlug)
        }
      >
        <PlusCircle className="h-4 w-4 mr-2" /> Record New Metric
      </Button>
      <Button variant="outline" size="sm" className="shadow-sm">
        <Calendar className="h-4 w-4 mr-2" /> View Training Schedule
      </Button>
      <Button variant="outline" size="sm" className="shadow-sm">
        <TrendingUp className="h-4 w-4 mr-2" /> Growth Analysis
      </Button>
    </div>
  );
};

export default PlayerProgressQuickActions;
