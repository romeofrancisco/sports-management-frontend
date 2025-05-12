import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const InfoCard = ({ title, value, icon, trend, className = "", description = null }) => {
  return (
    <Card className={cn("overflow-hidden border transition-all duration-300", className)}>
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1.5 min-w-0">
            <p className="text-xs font-medium text-muted-foreground">{title}</p>
            <div className="flex items-end gap-1.5 flex-wrap">
              <p className="text-2xl font-bold truncate max-w-full">{value}</p>
              {trend !== undefined && (
                <span 
                  className={cn(
                    "text-xs font-medium flex items-center",
                    trend > 0 ? "text-green-600" : trend < 0 ? "text-red-600" : "text-muted-foreground"
                  )}
                >
                  {trend > 0 ? `+${trend}%` : `${trend}%`}
                </span>
              )}
            </div>
            {description && (
              <div className="text-xs text-muted-foreground truncate max-w-full">
                {description}
              </div>
            )}
          </div>
          <div className="p-2.5 rounded-full bg-primary/10 text-primary flex-shrink-0 shadow-sm">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InfoCard;