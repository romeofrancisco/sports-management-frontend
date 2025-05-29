import React from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Eye } from "lucide-react";

const NoInsightsState = ({ aiEnabled }) => {
  return (
    <Card className="border-2 border-muted bg-gradient-to-br from-card to-muted/10">
      <CardContent className="text-center py-12">
        <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-medium text-muted-foreground mb-2">
          {aiEnabled ? "AI Analysis Loading..." : "No Insights Available"}
        </h3>
        <p className="text-sm text-muted-foreground">
          {aiEnabled 
            ? "AI-powered insights are being generated. Please wait a moment."
            : "System insights and alerts will appear here once there's enough data to analyze."
          }
        </p>
      </CardContent>
    </Card>
  );
};

export default NoInsightsState;
