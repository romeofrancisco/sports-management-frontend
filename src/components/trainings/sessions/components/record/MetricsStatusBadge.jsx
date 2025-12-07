import React from "react";
import { Badge } from "../../../../ui/badge";
import { CheckCircle, Clock, Circle } from "lucide-react";

const MetricsStatusBadge = ({ metricValues, metricsToShow }) => {
  const totalMetrics = metricsToShow.length;
  const recordedMetrics = Object.entries(metricValues).filter(
    ([key, value]) =>
      value !== "" &&
      !isNaN(parseFloat(value)) &&
      parseFloat(value) > 0
  ).length;

  const isAllMetricsRecorded =
    totalMetrics > 0 && recordedMetrics === totalMetrics;

  if (isAllMetricsRecorded) {
    return (
      <Badge
        variant="outline"
        className="text-xs sm:text-sm px-2.5 sm:px-4 py-1.5 sm:py-2 bg-green-500/10 border-green-500/20 text-green-600 font-semibold flex items-center gap-1.5 sm:gap-2"
      >
        <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <span className="hidden xs:inline">Ready to proceed</span>
        <span className="xs:hidden">Ready</span>
        ({recordedMetrics}/{totalMetrics})
      </Badge>
    );
  } else if (recordedMetrics > 0) {
    return (
      <Badge
        variant="outline"
        className="text-xs sm:text-sm px-2.5 sm:px-4 py-1.5 sm:py-2 bg-amber-500/10 border-amber-500/20 text-amber-600 font-semibold flex items-center gap-1.5 sm:gap-2"
      >
        <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        In Progress ({recordedMetrics}/{totalMetrics})
      </Badge>
    );
  } else {
    return (
      <Badge
        variant="outline"
        className="text-xs sm:text-sm px-2.5 sm:px-4 py-1.5 sm:py-2 bg-muted/50 border-muted text-muted-foreground font-semibold flex items-center gap-1.5 sm:gap-2"
      >
        <Circle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        Not Started (0/{totalMetrics})
      </Badge>
    );
  }
};

export default MetricsStatusBadge;
