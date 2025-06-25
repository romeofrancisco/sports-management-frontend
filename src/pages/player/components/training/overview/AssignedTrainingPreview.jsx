import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardCheck, ChevronRight, Clock, Dumbbell } from "lucide-react";
import { SessionCard } from "../assigned";
import { transformSessionData } from "../utils/sessionDataTransform";

const AssignedTrainingPreview = ({
  assignedData,
  isAssignedLoading,
  showAllAssigned,
  setShowAllAssigned,
  hideShowAllButton,
  type = "assigned",
}) => {
  const navigate = useNavigate();

  // Dynamic title, icon, and description based on type
  const config =
    type === "recent"
      ? {
          title: "Recent Sessions",
          icon: <Clock className="size-5 text-primary-foreground" />,
          description: "Your most recent training sessions",
        }
      : {
          title: "Assigned Training Metrics",
          icon: <ClipboardCheck className="size-5 text-primary-foreground" />,
          description: "Trainings assigned by your coach.",
        };

  const noDataMessage =
    type === "recent" ? "No recent trainings" : "No assigned trainings";
  const hasResults = assignedData?.results && assignedData.results.length > 0;

  return (
    <Card className="bg-card shadow-lg border-2 border-primary/10">
      <CardHeader>
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`p-3 rounded-lg bg-primary shadow-lg`}
            >
              {config.icon}
            </div>
            <div>
              <CardTitle className="text-lg">{config.title}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {config.description}
              </CardDescription>
            </div>
          </div>
          {!hideShowAllButton && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/trainings/assigned")}
              className="flex items-center gap-1 mt-2 sm:mt-0"
            >
              View All{assignedData?.count ? ` (${assignedData.count})` : ""}
              <ChevronRight className="h-3 w-3 transition-transform" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isAssignedLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : hasResults ? (
          <div className="space-y-4">
            {assignedData.results
              .slice(0, showAllAssigned ? 20 : 3)
              .map((sessionData) => {
                const sessionGroup = transformSessionData(sessionData);
                return (
                  <div key={`assigned-session-${sessionData.session}`}>
                    <SessionCard sessionGroup={sessionGroup} />
                  </div>
                );
              })}
            {/* Always show the button below if not hidden */}
            {!hideShowAllButton && (
              <div className="text-center pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/trainings/assigned")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  View all assigned sessions
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3 min-h-[300px] items-center justify-center py-8 text-muted-foreground">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-2">
              <Dumbbell className="w-8 h-8 text-primary" />
            </div>
            <p className="text-base font-semibold text-center">
              {noDataMessage}
            </p>
            <span className="text-xs text-center text-muted-foreground/80 max-w-xs">
              {type === "recent"
                ? "You haven't completed any trainings recently. Once you do, your most recent sessions will appear here."
                : "You currently have no assigned trainings. When a coach assigns you a training, it will show up here."}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AssignedTrainingPreview;
