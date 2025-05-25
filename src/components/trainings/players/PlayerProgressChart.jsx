import React from "react";
import { Card, CardContent } from "./YourCardComponents"; // Adjust the import based on your project structure

const PlayerProgressChart = ({ metricData, data }) => {
  const firstPoint = data[0];
  const lastPoint = data[data.length - 1];

  // Use the backend-provided improvement percentage
  const improvementPercentage = lastPoint.improvement_percentage ?? 0;
  const isImproved = improvementPercentage > 0;

  // Raw improvement is still useful to show absolute change
  const rawDiff = lastPoint.value - firstPoint.value;
  const improvement = metricData.is_lower_better ? -rawDiff : rawDiff;
  const unit = metricData.metric_unit ? metricData.metric_unit.code : '';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-2xl font-bold mb-1">
              {improvement.toFixed(2)} {unit}
            </div>
            <p className={`text-sm ${isImproved ? "text-green-600" : "text-red-600"}`}>
              {isImproved ? "Improvement" : "Decline"} from first to last record
            </p>            <p className="text-sm text-muted-foreground mt-2">
              {improvementPercentage > 0 ? "+" : ""}
              {improvementPercentage.toFixed(2)}% Overall Improvement
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlayerProgressChart;