import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { getCategoryIcon, getCategoryColors } from "../utils/statsCategories";
import StatCard from "./StatCard";

const CategorySection = ({ 
  category, 
  categoryStats, 
  isExpanded, 
  onToggle, 
  onEditStat, 
  onDeleteStat 
}) => {
  const categoryColors = getCategoryColors(category);

  return (
    <Card className={`relative pt-0 gap-0 overflow-hidden border-2 shadow-lg hover:shadow-xl transition-all duration-300 ${categoryColors.border} ${categoryColors.bg}`}>
      <div className={`absolute inset-0 bg-gradient-to-br opacity-5`} />
      
      <div
        className={`flex justify-between items-center p-3 sm:p-4 lg:p-5 border-b-2 cursor-pointer transition-all duration-200 hover:bg-opacity-80 ${categoryColors.bg} ${categoryColors.border} relative z-10`}
        onClick={onToggle}
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <div className={`p-1.5 sm:p-2 rounded-lg ${categoryColors.iconBg} shadow-lg transition-transform duration-300 hover:scale-110`}>
            {getCategoryIcon(category)}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
            <h3 className={`text-lg sm:text-xl font-bold ${categoryColors.text}`}>
              {category}
            </h3>
            <Badge variant="outline" className={`${categoryColors.badge} font-semibold px-2 py-1 text-xs sm:text-sm w-fit`}>
              {categoryStats.length} {categoryStats.length === 1 ? 'stat' : 'stats'}
            </Badge>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full hover:bg-white/50 dark:hover:bg-black/30 transition-all duration-200 ${categoryColors.text}`}
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5" />
          ) : (
            <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />
          )}
        </Button>
      </div>

      {isExpanded && (
        <div className="p-3 sm:p-4 lg:p-6 bg-gradient-to-br from-background to-muted/20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {categoryStats.map((stat) => (
              <StatCard
                key={stat.id}
                stat={stat}
                onEdit={onEditStat}
                onDelete={onDeleteStat}
              />
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default CategorySection;
