import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { InfoIcon } from "lucide-react";

export const WeightedMetricsGuide = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <InfoIcon className="h-5 w-5" />
          Understanding Metric Normalization
        </CardTitle>
        <CardDescription>
          How weighted metrics improve athlete progress tracking
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>
          Different training metrics naturally improve at different rates. For example:
        </p>

        <div className="space-y-3">
          <div className="rounded-md border p-3">
            <h3 className="font-medium mb-1">Problem: Distorted Improvement Data</h3>
            <p className="text-sm text-muted-foreground">
              Without normalization, metrics like repetitions (which can easily show 50% improvement) 
              would overshadow metrics like sprint times (where a 5% improvement is significant).
            </p>
          </div>
          
          <div className="rounded-md border p-3">
            <h3 className="font-medium mb-1">Solution: Metric Normalization Weights</h3>
            <p className="text-sm text-muted-foreground">
              Each unit of measurement has a normalization weight that scales its impact on overall 
              improvement calculations. Lower weights are used for metrics that typically show 
              larger percentage changes.
            </p>
          </div>
        </div>
        
        <h3 className="font-medium pt-2">Normalization Weight Examples:</h3>
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            {/* Standard metrics (weight: 1.0) */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Standard Weight (×1.0)</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>Time (seconds, minutes)</li>
                <li>Distance (cm, m, km, in, ft)</li>
                <li>Weight (kg, lbs)</li>
                <li>Heart Rate (bpm)</li>
                <li>Rating (1-10 scale)</li>
              </ul>
              <p className="text-xs text-muted-foreground mt-2">
                These metrics maintain their original percentage improvements
              </p>
            </div>

            {/* Lower weighted metrics */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Reduced Weight</h4>
              <ul className="space-y-1 text-sm">
                <li className="flex justify-between">
                  <span>Repetitions</span>
                  <span className="text-primary">×0.2</span>
                </li>
                <li className="flex justify-between">
                  <span>Sets</span>
                  <span className="text-primary">×0.2</span>
                </li>
                <li className="flex justify-between">
                  <span>Points</span>
                  <span className="text-primary">×0.5</span>
                </li>
              </ul>
              <p className="text-xs text-muted-foreground mt-2">
                These metrics typically show larger percentage changes and are weighted down
              </p>
            </div>
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <h3 className="font-medium mb-2">Example Calculation:</h3>
          <div className="text-sm space-y-2">
            <p>
              <strong>Push-ups (×0.2):</strong> Improving from 10 to 15 reps shows a 50% improvement, 
              but contributes only 10% (50% × 0.2) to overall progress
            </p>
            <p>
              <strong>Sprint Time (×1.0):</strong> Improving from 12 to 11.4 seconds shows a 5% improvement, 
              and contributes the full 5% to overall progress
            </p>
          </div>
        </div>

        <div className="pt-2">
          <p className="text-sm text-muted-foreground">
            This normalization system provides a balanced view of athlete improvement across 
            diverse metrics, making progress tracking more accurate and meaningful.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};