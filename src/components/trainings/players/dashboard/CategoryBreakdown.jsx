import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, TrendingUp, TrendingDown, Minus } from "lucide-react";

const CategoryBreakdown = ({ 
  categories = [], 
  className = "",
  title = "Category Breakdown"
}) => {
  if (!categories || categories.length === 0) {
    return (
      <Card className={`bg-gradient-to-br from-card via-card/95 to-card/90 rounded-xl shadow-xl border border-border/50 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:border-secondary/20 ${className}`}>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-secondary" />
            {title}
          </CardTitle>
        </CardHeader>        <CardContent className="pt-0">
          <div className="flex items-center justify-center h-96">
            <div className="text-center space-y-4">
              <Target className="h-12 w-12 text-muted-foreground mx-auto" />
              <p className="text-sm text-muted-foreground">No category data available</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-gradient-to-br from-card via-card/95 to-card/90 rounded-xl shadow-xl border border-border/50 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:border-secondary/20 ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-secondary" />
          {title}
        </CardTitle>
      </CardHeader>      <CardContent className="pt-0">
        <div className="h-96 flex flex-col">
          <div className="flex-1 space-y-3 overflow-y-auto pr-2">
            {categories.map((category, index) => {
              const improvementPercentage = category.average_improvement;
              const isImproved = improvementPercentage > 0;
              const isDeclined = improvementPercentage < -5;
              const isStable = !isImproved && !isDeclined;
              
              const Icon = isImproved ? TrendingUp : isDeclined ? TrendingDown : Minus;
              const iconColor = isImproved ? "text-green-600" : isDeclined ? "text-red-600" : "text-gray-500";
              const bgColor = isImproved ? "bg-green-50 dark:bg-green-950/30" : 
                             isDeclined ? "bg-red-50 dark:bg-red-950/30" : 
                             "bg-gray-50 dark:bg-gray-950/30";
              const borderColor = isImproved ? "border-green-200 dark:border-green-800" : 
                                 isDeclined ? "border-red-200 dark:border-red-800" : 
                                 "border-gray-200 dark:border-gray-800";
              
              return (
                <div key={index} className={`p-3 rounded-lg border ${bgColor} ${borderColor}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className={`h-4 w-4 ${iconColor}`} />
                      <span className="font-medium text-sm truncate">
                        {category.category_name}
                      </span>
                    </div>
                    <Badge 
                      variant={isImproved ? "default" : isDeclined ? "destructive" : "secondary"}
                      className="text-xs"
                    >
                      {improvementPercentage > 0 ? "+" : ""}{improvementPercentage.toFixed(1)}%
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    {/* Performance Score */}
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Performance</span>
                      <span className="text-xs font-medium">
                        {category.performance_score.toFixed(1)}/100
                      </span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          category.performance_score >= 80 ? "bg-green-500" :
                          category.performance_score >= 60 ? "bg-yellow-500" :
                          category.performance_score >= 40 ? "bg-orange-500" :
                          "bg-red-500"
                        }`}
                        style={{ width: `${Math.min(category.performance_score, 100)}%` }}
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
          
          {/* Summary Stats */}
          <div className="pt-4 border-t border-border/50 flex-shrink-0">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-2 bg-primary/5 rounded-lg">
                <p className="text-xs text-muted-foreground">Categories</p>
                <p className="text-sm font-semibold">{categories.length}</p>
              </div>
              <div className="p-2 bg-secondary/5 rounded-lg">
                <p className="text-xs text-muted-foreground">Avg Performance</p>
                <p className="text-sm font-semibold">
                  {categories.length > 0 
                    ? (categories.reduce((sum, cat) => sum + cat.performance_score, 0) / categories.length).toFixed(1)
                    : 0
                  }/100
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryBreakdown;
