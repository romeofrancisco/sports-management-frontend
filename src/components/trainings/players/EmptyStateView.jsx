import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, PlusCircle, Activity } from "lucide-react";

const EmptyStateView = ({ sports, handleSportChange, openModal, teamSlug }) => {
  return (
    <Card className="border shadow-sm bg-gradient-to-b from-background to-muted/20">
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="bg-primary/10 p-5 rounded-full mb-6 backdrop-blur-sm">
          <Users className="h-12 w-12 text-primary/80" />
        </div>
        <h3 className="text-2xl font-semibold mb-3">
          Player Progress Tracking
        </h3>
        <p className="text-muted-foreground max-w-md mb-8">
          Track individual and team performance metrics over time. Select a
          sport and team from the filters above to get started.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          {sports.length > 0 && (
            <Button
              variant="outline"
              onClick={() => handleSportChange(sports[0].id)}
              className="gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Select a Sport
            </Button>
          )}
          <Button
            variant="default"
            className="gap-2"
            onClick={() => openModal(teamSlug)}
          >
            <Activity className="h-4 w-4" />
            Record New Session
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default EmptyStateView;
