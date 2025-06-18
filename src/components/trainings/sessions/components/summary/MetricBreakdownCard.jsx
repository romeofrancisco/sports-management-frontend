import React from "react";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

const MetricBreakdownCard = ({ metric, totalPlayersWithMetrics }) => {
  if (!metric) return null;

  const participationRate = totalPlayersWithMetrics > 0 
    ? Math.round((metric.unique_players / totalPlayersWithMetrics) * 100)
    : 0;

  const StatDisplay = ({ label, value, color = "text-blue-600" }) => (
    <div className="text-center">
      <p className="text-xs text-gray-500 font-medium mb-1">{label}</p>
      <p className={`text-lg font-bold ${color}`}>
        {Number(value).toFixed(2)}
        <span className="text-xs text-gray-500 ml-1">
          {metric.metric__metric_unit__code}
        </span>
      </p>
    </div>
  );

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h5 className="font-semibold text-gray-900 text-lg mb-2">
            {metric.metric__name}
          </h5>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
              {metric.records_count} records
            </Badge>
            <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
              {metric.unique_players} players
            </Badge>
          </div>
        </div>
        <div className={`p-2 rounded-lg ${
          metric.metric__is_lower_better 
            ? 'bg-blue-100 text-blue-600' 
            : 'bg-green-100 text-green-600'
        }`}>
          {metric.metric__is_lower_better ? (
            <TrendingDown className="h-4 w-4" />
          ) : (
            <TrendingUp className="h-4 w-4" />
          )}
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <StatDisplay 
          label="Average" 
          value={metric.avg_value}
          color="text-blue-600"
        />
        
        <div className="border-l border-r border-gray-200 px-2">
          <StatDisplay 
            label={metric.metric__is_lower_better ? 'Best' : 'Highest'}
            value={metric.metric__is_lower_better ? metric.min_value : metric.max_value}
            color="text-green-600"
          />
        </div>
        
        <StatDisplay 
          label={metric.metric__is_lower_better ? 'Worst' : 'Lowest'}
          value={metric.metric__is_lower_better ? metric.max_value : metric.min_value}
          color="text-orange-600"
        />
      </div>

      {/* Progress indicator */}
      <div>
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>Participation</span>
          <span>{participationRate}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, participationRate)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default MetricBreakdownCard;
