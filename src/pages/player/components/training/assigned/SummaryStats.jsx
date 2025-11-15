import React from "react";
import { Target, XCircle, Clock, CheckCircle } from "lucide-react";
import CommonOverviewCards from "@/components/common/OverviewCards";

const SummaryStats = ({
  summary,
  filteredSummary = null,
  isFiltered = false,
}) => {
  const cards = [
    {
      title: "Completed/Total",
      value: (
        <>
          <span className="">{summary.completed}</span>
          <span className="d">/{summary.total_metrics}</span>
          {isFiltered && filteredSummary && (
            <div className="text-sm text-muted-foreground mt-1">
              ({filteredSummary.completed}/{filteredSummary.total_metrics})
            </div>
          )}
        </>
      ),
      description: "Metrics completed out of total assigned",
      icon: Target,
      color: "from-primary via-primary/90 to-primary/80",
      iconBg: "bg-primary",
      iconColor: "text-primary",
    },
    {
      title: "In Progress",
      value: (
        <>
          {summary.in_progress}
          {isFiltered && filteredSummary && (
            <span className="text-sm text-muted-foreground ml-1">({filteredSummary.in_progress})</span>
          )}
        </>
      ),
      description: "Metrics currently being tracked",
      icon: Clock,
      color: "from-secondary via-secondary/90 to-secondary/80",
      iconBg: "bg-secondary",
      iconColor: "text-secondary",
    },
    {
      title: "Assigned",
      value: (
        <>
          {summary.assigned}
          {isFiltered && filteredSummary && (
            <span className="text-sm text-muted-foreground ml-1">({filteredSummary.assigned})</span>
          )}
        </>
      ),
      description: "Metrics awaiting completion",
      icon: CheckCircle,
      color: "from-orange-500 via-orange-500/90 to-orange-500/80",
      iconBg: "bg-orange-500",
      iconColor: "text-orange-600",
    },
    {
      title: "Missed",
      value: (
        <>
          {summary.missed}
          {isFiltered && filteredSummary && (
            <span className="text-sm text-muted-foreground ml-1">({filteredSummary.missed})</span>
          )}
        </>
      ),
      description: "Metrics not completed",
      icon: XCircle,
      color: "from-red-500 via-red-500/90 to-red-500/80",
      iconBg: "bg-red-500",
      iconColor: "text-red-600",
    },
  ];

  return <CommonOverviewCards stats={cards} />;
};

export default SummaryStats;
