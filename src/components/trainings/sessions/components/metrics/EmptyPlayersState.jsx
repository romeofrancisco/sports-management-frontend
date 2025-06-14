import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../ui/card";
import { Users, BarChart3 } from "lucide-react";

const EmptyPlayersState = () => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Step 4: Record Player Metrics
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Record individual player performance metrics for this training session.
        </p>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <p>No players have metrics configured for recording.</p>
          <p className="text-sm">
            Complete Step 3 (Configure Player Metrics) first.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmptyPlayersState;
