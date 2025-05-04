import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const StatCard = ({ title, value, icon, trend, className = "", description = null }) => {
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">{title}</p>
            <div className="flex items-end gap-1">
              <p className="text-2xl font-bold">{value}</p>
              {trend && (
                <span className={`text-xs ${trend > 0 ? "text-green-600" : trend < 0 ? "text-red-600" : ""}`}>
                  {trend > 0 ? `+${trend}%` : `${trend}%`}
                </span>
              )}
            </div>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>
          <div className="p-2 rounded-full bg-primary/10 text-primary">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;