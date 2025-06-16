import React from "react";
import { Card, CardContent } from "../../../../ui/card";
import { AlertCircle } from "lucide-react";

const AttendanceWarningCard = ({ canMarkAttendance }) => {
  if (canMarkAttendance) return null;

  return (
    <div className="animate-in fade-in-50 duration-500">
      <Card className="bg-primary/10 border-2 border-primary/20">
        <CardContent>
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-primary flex-shrink-0" />
            <div>
              <h3 className="font-medium text-primary">
                Attendance Preview Mode
              </h3>
              <p className="text-sm text-primary mt-1">
                You can view and prepare attendance, but marking attendance is only available on the session date. 
                All buttons for marking attendance will be disabled until then.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceWarningCard;
