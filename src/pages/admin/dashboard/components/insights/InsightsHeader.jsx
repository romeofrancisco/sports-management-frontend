import React from "react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Lightbulb, Brain, Sparkles } from "lucide-react";

const InsightsHeader = ({ aiEnabled, onAiToggle }) => {
  return (
    <div className="flex flex-col xl:flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-primary shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110">
          <Lightbulb className="h-5 w-5 text-primary-foreground" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-xl md:text-2xl xl:text-lg font-bold tracking-tight text-gradient">
            System Insights & Alerts
          </h2>
          <p className="text-sm xl:text-xs text-muted-foreground mt-1">
            AI-powered intelligent analysis and system health monitoring
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row xl:flex-col gap-3">
        {/* AI Toggle Control - Compact for sidebar */}
        <div className="flex items-center justify-between gap-1 p-2 xl:p-2 rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20">
          <div className="flex items-center gap-2 min-w-0">
            <Brain className="h-4 w-4 xl:h-3 xl:w-3 text-primary flex-shrink-0" />
            <span className="text-sm xl:text-xs font-medium text-primary truncate">
              AI Analysis
            </span>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Switch
              checked={aiEnabled}
              onCheckedChange={onAiToggle}
              className="data-[state=checked]:bg-primary scale-75 xl:scale-75"
            />
            {aiEnabled ? (
              <Badge
                variant="outline"
                className="bg-primary/10 text-primary border-primary/30 text-xs xl:text-[10px] px-1 xl:px-1 py-0"
              >
                <Sparkles className="h-3 w-3 xl:h-2 xl:w-2 mr-1" />
                On
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="bg-muted text-muted-foreground border-muted-foreground/30 text-xs xl:text-[10px] px-1 xl:px-1 py-0"
              >
                Off
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsHeader;
