import React from "react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Lightbulb,
  Brain,
  Sparkles,
} from "lucide-react";

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
        <div className="flex items-center gap-2 p-2 xl:p-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-blue-600" />
            <span className="text-sm xl:text-xs font-medium text-blue-700">AI Analysis</span>
          </div>
          <Switch
            checked={aiEnabled}
            onCheckedChange={onAiToggle}
            className="data-[state=checked]:bg-blue-600 scale-75 xl:scale-100"
          />
          {aiEnabled ? (
            <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300 text-xs xl:text-[10px] px-1 xl:px-2">
              <Sparkles className="h-3 w-3 xl:h-2 xl:w-2 mr-1" />
              Active
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-300 text-xs xl:text-[10px] px-1 xl:px-2">
              <Brain className="h-3 w-3 xl:h-2 xl:w-2 mr-1" />
              Off
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default InsightsHeader;
