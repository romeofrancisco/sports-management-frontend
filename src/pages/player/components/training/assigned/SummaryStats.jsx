import React from "react";
import { Target, XCircle, Clock, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
          <span className="text-green-600">{summary.completed}</span>
          <span className="text-muted-foreground">
            /{summary.total_metrics}
          </span>
          {isFiltered && filteredSummary && (
            <div className="text-sm text-muted-foreground mt-1">
              ({filteredSummary.completed}/{filteredSummary.total_metrics})
            </div>
          )}
        </>
      ),
      description: "Metrics completed out of total assigned",
      icon: <Target className="h-5 w-5 text-primary-foreground" />,
      color: "from-primary via-primary/90 to-primary/80",
      bgColor: "bg-primary/8",
      borderColor: "border-primary/30",
      iconBg: "bg-primary",
      textAccent: "text-primary",
    },
    {
      title: "In Progress",
      value: (
        <>
          {summary.in_progress}
          {isFiltered && filteredSummary && (
            <span className="text-sm text-muted-foreground ml-1">
              ({filteredSummary.in_progress})
            </span>
          )}
        </>
      ),
      description: "Metrics currently being tracked",
      icon: <Clock className="h-5 w-5 text-secondary-foreground" />,
      color: "from-secondary via-secondary/90 to-secondary/80",
      bgColor: "bg-secondary/8",
      borderColor: "border-secondary/30",
      iconBg: "bg-secondary",
      textAccent: "text-secondary",
    },
    {
      title: "Assigned",
      value: (
        <>
          {summary.assigned}
          {isFiltered && filteredSummary && (
            <span className="text-sm text-muted-foreground ml-1">
              ({filteredSummary.assigned})
            </span>
          )}
        </>
      ),
      description: "Metrics awaiting completion",
      icon: <CheckCircle className="h-5 w-5 text-white" />,
      color: "from-orange-500 via-orange-500/90 to-orange-500/80",
      bgColor: "bg-orange-500/8",
      borderColor: "border-orange-500/30",
      iconBg: "bg-orange-500",
      textAccent: "text-orange-600",
    },
    {
      title: "Missed",
      value: (
        <>
          {summary.missed}
          {isFiltered && filteredSummary && (
            <span className="text-sm text-muted-foreground ml-1">
              ({filteredSummary.missed})
            </span>
          )}
        </>
      ),
      description: "Metrics not completed",
      icon: <XCircle className="h-5 w-5 text-white" />,
      color: "from-red-500 via-red-500/90 to-red-500/80",
      bgColor: "bg-red-500/8",
      borderColor: "border-red-500/30",
      iconBg: "bg-red-500",
      textAccent: "text-red-600",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Card
          key={index}
          className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 ${card.bgColor} ${card.borderColor} border`}
        >
          <div
            className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-5`}
          />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div
              className={`p-2 rounded-lg ${card.iconBg} shadow-lg transition-transform duration-300 hover:scale-110`}
            >
              {card.icon}
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className={`text-2xl font-bold ${card.textAccent} mb-1`}>
              {card.value}
            </div>
            <p className="text-xs text-muted-foreground">{card.description}</p>
          </CardContent>{" "}
        </Card>
      ))}
    </div>
  );
};

export default SummaryStats;
