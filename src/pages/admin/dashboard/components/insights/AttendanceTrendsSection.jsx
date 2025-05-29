import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

// Utility function to safely render content
const safeRender = (content, fallback = "No data available") => {
  if (typeof content === "string") return content;
  if (typeof content === "number") return content.toString();
  if (content === null || content === undefined) return fallback;
  if (typeof content === "object") {
    // Try to extract meaningful content from object
    if (content.message) return content.message;
    if (content.description) return content.description;
    if (content.text) return content.text;
    return fallback;
  }
  return fallback;
};

const AttendanceTrendsSection = ({ attendanceTrends }) => {
  if (!attendanceTrends) {
    return null;
  }

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-card to-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Attendance Trends
        </CardTitle>
        <CardDescription>
          Analysis of training and game attendance patterns
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {attendanceTrends.training && (
            <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/20">
              <h4 className="font-medium mb-2">Training Attendance</h4>
              <p className="text-sm text-muted-foreground">
                {safeRender(
                  attendanceTrends.training,
                  "Training attendance data available"
                )}
              </p>
            </div>
          )}
          {attendanceTrends.games && (
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
              <h4 className="font-medium mb-2">Game Attendance</h4>
              <p className="text-sm text-muted-foreground">
                {safeRender(
                  attendanceTrends.games,
                  "Game attendance data available"
                )}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceTrendsSection;
