import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Activity, FileText, BarChart3 } from "lucide-react";

const QuickActionsCard = ({ openModal, className = "" }) => {
  return (
    <Card className={`${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start bg-background/50 hover:bg-primary/10 border-primary/20"
            onClick={() => openModal && openModal()}
          >
            <Target className="h-4 w-4 mr-2" />
            View Detailed Report
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start bg-background/50 hover:bg-secondary/10 border-secondary/20"
          >
            <Activity className="h-4 w-4 mr-2" />
            Compare with Team
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start bg-background/50 hover:bg-muted/10"
          >
            <FileText className="h-4 w-4 mr-2" />
            Export Analytics
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start bg-background/50 hover:bg-blue-100 dark:hover:bg-blue-900/20 border-blue-200 dark:border-blue-800"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Generate PDF Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActionsCard;
