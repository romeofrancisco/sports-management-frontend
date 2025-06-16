import React from "react";
import { Card, CardContent } from "../../../../ui/card";
import { Users } from "lucide-react";

const EmptyAttendanceState = () => {
  return (
    <div className="text-center py-8">
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Players Enrolled</h3>
          <p className="text-muted-foreground text-sm">
            No players are enrolled in this training session. Please check the
            session configuration or contact an administrator.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmptyAttendanceState;
