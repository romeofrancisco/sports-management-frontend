import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Target, TrendingUp, TrendingDown, Minus } from "lucide-react";
import ChartCard from "@/components/charts/ChartCard";

const CategoryBreakdown = ({
  categories = [],
  className = "",
  title = "Category Breakdown",
  description = "Performance breakdown by training categories",
}) => {
  if (!categories || categories.length === 0) {
    return (
      <ChartCard
        title={title}
        description={description}
        icon={Target}
        className={className}
      >
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-y-4">
            <Target className="h-12 w-12 text-muted-foreground mx-auto" />
            <p className="text-sm text-muted-foreground">
              No category data available
            </p>
          </div>
        </div>
      </ChartCard>
    );
  }

  return (
    <ChartCard
      title={title}
      description={description}
      icon={Target}
      className={className}
    >
      <ScrollArea className="h-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((category, index) => {
              const improvementPercentage = category.average_improvement;
              const isImproved = improvementPercentage > 0;
              const isDeclined = improvementPercentage < -5;
              const isStable = !isImproved && !isDeclined;
              const Icon = isImproved
                ? TrendingUp
                : isDeclined
                ? TrendingDown
                : Minus;
              const iconColor = isImproved
                ? "text-primary"
                : isDeclined
                ? "text-destructive"
                : "text-muted-foreground";
              const bgColor = isImproved
                ? "bg-primary/10"
                : isDeclined
                ? "bg-destructive/10"
                : "bg-secondary/10";
              const borderColor = isImproved
                ? "border-primary/20"
                : isDeclined
                ? "border-destructive/20"
                : "border-secondary/20";

              return (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${bgColor} ${borderColor}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className={`h-4 w-4 ${iconColor}`} />
                      <span className="font-medium text-sm truncate">
                        {category.category_name}
                      </span>
                    </div>
                    <Badge
                      variant={
                        isImproved
                          ? "default"
                          : isDeclined
                          ? "destructive"
                          : "secondary"
                      }
                      className="text-xs"
                    >
                      {improvementPercentage > 0 ? "+" : ""}
                      {improvementPercentage.toFixed(1)}%
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {/* Performance Score */}
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        Performance
                      </span>
                      <span className="text-xs font-medium">
                        {category.performance_score.toFixed(1)}/100
                      </span>
                    </div>{" "}
                    {/* Progress Bar */}
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300 bg-gradient-to-r from-primary to-secondary"
                        style={{
                          width: `${Math.min(
                            category.performance_score,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                    {/* Metrics Info */}
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>{category.metrics_count} metrics</span>
                      <span>{category.total_records} records</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {/* Summary Stats */}
        {/* <div className="pt-4 border-t border-border/50 flex-shrink-0">
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-2 bg-primary/5 rounded-lg">
              <p className="text-xs text-muted-foreground">Categories</p>
              <p className="text-sm font-semibold">{categories.length}</p>
            </div>
            <div className="p-2 bg-secondary/5 rounded-lg">
              <p className="text-xs text-muted-foreground">Avg Performance</p>
              <p className="text-sm font-semibold">
                {categories.length > 0
                  ? (
                      categories.reduce(
                        (sum, cat) => sum + cat.performance_score,
                        0
                      ) / categories.length
                    ).toFixed(1)
                  : 0}
                /100
              </p>
            </div>
          </div>
        </div> */}
      </ChartCard>
    );
  };

export default CategoryBreakdown;
