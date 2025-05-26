import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import {
  CircleCheck,
  CircleX,
  Edit,
  Trash2,
  BarChart2,
  PlusCircle,
  Calculator,
  Check,
  X,
  Tag,
  Code,
  Hash,
  Shield,
  Filter,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useModal } from "@/hooks/useModal";
import SportStatsModal from "@/components/modals/SportStatsModal";
import DeleteStatModal from "@/components/modals/DeleteStatModal";
import { ScrollArea } from "@/components/ui/scroll-area";
import InfoCard from "@/components/common/InfoCard";

const SportStatsCardView = ({ stats, filter }) => {
  const [selectedStat, setSelectedStat] = React.useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});

  const modals = {
    stat: useModal(),
    delete: useModal(),
  };

  const handleEditStat = (stat) => {
    setSelectedStat(stat);
    modals.stat.openModal();
  };

  const handleDeleteStat = (stat) => {
    setSelectedStat(stat);
    modals.delete.openModal();
  };
  
  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Function to get active filters count for badge
  const getActiveFiltersCount = () => {
    if (!filter) return 0;
    
    let count = 0;
    if (filter.search) count++;
    if (filter.category && filter.category !== "all") count++;
    if (filter.type && filter.type !== "all") count++;
    return count;
  };
  
  // Calculate stats counts by category
  const getCategoriesCount = () => {
    if (!stats) return {};
    const categories = {};
    
    stats.forEach(stat => {
      const category = stat.category || 'other';
      categories[category] = (categories[category] || 0) + 1;
    });
    
    return categories;
  };
  
  // Calculate stats counts by type
  const getStatsTypeCount = () => {
    if (!stats) return { record: 0, formula: 0 };
    
    return stats.reduce((counts, stat) => {
      if (stat.is_record) counts.record++;
      else counts.formula++;
      return counts;
    }, { record: 0, formula: 0 });
  };
  
  // Get stats metrics to display in InfoCards
  const categoriesCount = getCategoriesCount();
  const statsTypeCount = getStatsTypeCount();

  // Function to categorize stats using the model's category field
  const categorizeStats = (stats) => {
    if (!stats) return {};

    // Create categories object
    const categories = {
      Scoring: [],
      Performance: [],
      Offensive: [],
      Defensive: [],
      Other: [],
    };

    stats.forEach((stat) => {
      // Use the category from the model
      const categoryMap = {
        scoring: "Scoring",
        performance: "Performance",
        offensive: "Offensive",
        defensive: "Defensive",
        other: "Other",
      };

      const category = categoryMap[stat.category] || "Other";
      if (categories[category]) {
        categories[category].push(stat);
      } else {
        categories["Other"].push(stat);
      }
    });

    // Remove empty categories
    Object.keys(categories).forEach((key) => {
      if (categories[key].length === 0) {
        delete categories[key];
      }
    });

    return categories;
  };

  const categorizedStats = categorizeStats(stats);

  // No stats
  if (!stats || stats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-center bg-muted/30 rounded-lg border border-dashed">
        <BarChart2 className="h-10 w-10 text-muted-foreground mb-2" />
        <h3 className="text-lg font-medium mb-1">No stats found</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {getActiveFiltersCount() > 0 
            ? "Try adjusting your filters to see more stats"
            : "Create your first stat to start tracking performance"}
        </p>
        <Button
          onClick={() => {
            setSelectedStat(null);
            modals.stat.openModal();
          }}
          className="bg-primary hover:bg-primary/90"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Stat
        </Button>
      </div>
    );
  }

  // Function to get icon for category
  const getCategoryIcon = (category) => {
    switch (category) {
      case "Scoring":
        return <Tag className="h-4 w-4 text-amber-500 dark:text-amber-400" />;
      case "Performance":
        return <BarChart2 className="h-4 w-4 text-amber-600 dark:text-amber-400" />;
      case "Offensive":
        return <PlusCircle className="h-4 w-4 text-red-900 dark:text-red-400" />;
      case "Defensive":
        return <Shield className="h-4 w-4 text-purple-500 dark:text-purple-400" />;
      default:
        return <Hash className="h-4 w-4 text-gray-500 dark:text-gray-400" />;
    }
  };

  return (
    <div>
      {/* Stats Overview Section */}
      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-3">Stats Overview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <InfoCard
            title="Total Stats"
            value={stats.length}
            icon={<BarChart2 className="h-5 w-5 text-amber-600" />}
            description={`${Object.keys(categorizedStats).length} categories`}
            className="hover:shadow-md transition-all duration-300"
          />
          
          <InfoCard
            title="Recording Stats"
            value={statsTypeCount.record}
            icon={<CircleCheck className="h-5 w-5 text-red-900" />}
            description={`${Math.round((statsTypeCount.record / stats.length) * 100)}% of total`}
            progress={Math.round((statsTypeCount.record / stats.length) * 100)}
            progressLabel="% of Total Stats"
            className="hover:shadow-md transition-all duration-300"
          />
            <InfoCard
            title="Formula Stats"
            value={statsTypeCount.formula}
            icon={<Calculator className="h-5 w-5 text-amber-500" />}
            description={`${Math.round((statsTypeCount.formula / stats.length) * 100)}% of total`}
            className="hover:shadow-md transition-all duration-300"
          />
          
          <InfoCard
            title="Most Common"
            value={Object.entries(categoriesCount).reduce((max, [category, count]) => 
              count > (categoriesCount[max] || 0) ? category : max, "")}
            icon={<Tag className="h-5 w-5 text-violet-500" />}
            description="Most used category"
            className="hover:shadow-md transition-all duration-300 capitalize"
          />
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-lg">Card View</h3>
          <Badge variant="outline" className="bg-primary/10 font-medium">
            {stats.length} stats
          </Badge>
          {getActiveFiltersCount() > 0 && (
            <Badge variant="secondary" className="flex items-center gap-1.5 bg-secondary/80">
              <Filter className="h-3 w-3" />
              {getActiveFiltersCount()} filter{getActiveFiltersCount() !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>
        
        <Button
          onClick={() => {
            setSelectedStat(null);
            modals.stat.openModal();
          }}
          size="sm"
          className="bg-primary hover:bg-primary/90 text-white shadow-sm"
        >
          <PlusCircle className="mr-1.5 h-3.5 w-3.5" />
          New Stat
        </Button>
      </div>
        <div className="space-y-6">
        {Object.entries(categorizedStats).map(([category, categoryStats]) => {
          const isExpanded = expandedCategories[category] !== false; // default to expanded
          
          return (
            <Card key={category} className="overflow-hidden border shadow-sm">
              <div 
                className="flex justify-between items-center p-4 border-b bg-muted/20 cursor-pointer"
                onClick={() => toggleCategory(category)}
              >
                <div className="flex items-center gap-2">
                  {getCategoryIcon(category)}
                  <h3 className="text-lg font-semibold">{category}</h3>
                  <Badge variant="outline" className="ml-2 bg-primary/10">
                    {categoryStats.length}
                  </Badge>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </div>

              {isExpanded && (
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {categoryStats.map((stat) => (
                      <Card
                        key={stat.id}
                        className={cn(
                          "overflow-hidden border-l-4 transition-all duration-200 hover:shadow-md flex flex-col h-full p-0",
                          stat.is_record ? "border-l-blue-500" : "border-l-amber-500",
                          stat.is_negative && "border-l-red-500"
                        )}
                      >
                        <CardHeader
                          className={cn(
                            "p-4 pb-2 flex-shrink-0",
                            stat.is_record
                              ? "bg-blue-50 dark:bg-blue-900/20"
                              : "bg-amber-50 dark:bg-amber-900/20",
                            stat.is_negative && "bg-red-50 dark:bg-red-900/20"
                          )}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-lg line-clamp-1" title={stat.name}>{stat.name}</h3>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                <Code className="h-3.5 w-3.5" />
                                <span className="font-mono">{stat.code}</span>
                              </div>
                            </div>
                            <div>
                              {stat.is_record ? (
                                <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200 dark:bg-amber-900/50 dark:text-amber-300 dark:border-amber-800">
                                  Recording
                                </Badge>
                              ) : (
                                <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200 dark:bg-amber-900/50 dark:text-amber-300 dark:border-amber-800">
                                  Formula
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="pt-2 flex-grow flex flex-col">
                          <div className="min-h-[80px]">
                          {stat.is_record ? (
                            <>
                              <div className="text-xs mb-2">
                                <span className="font-medium">Display: </span>
                                <span className="text-muted-foreground">
                                  {stat.display_name || "N/A"}
                                </span>
                              </div>
                              {stat.point_value !== 0 && (
                                <div className="text-xs mb-3">
                                  <span className="font-medium">Points: </span>
                                  {stat.is_negative ? (
                                    <Badge
                                      variant="outline"
                                      className="bg-red-100 text-red-700 border-red-200 ml-1 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800"
                                    >
                                      -{Math.abs(stat.point_value)}
                                    </Badge>
                                  ) : (
                                    <Badge
                                      variant="outline"
                                      className="bg-red-100 text-red-700 border-red-200 ml-1 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800"
                                    >
                                      +{stat.point_value}
                                    </Badge>
                                  )}
                                  {stat.is_points && (
                                    <div className="mt-1 flex items-center">
                                      <span className="font-medium mr-1">Uses Point Value:</span>
                                      {stat.uses_point_value ? (
                                        <Check size={14} className="text-red-900 dark:text-red-400" />
                                      ) : (
                                        <X size={14} className="text-red-500 dark:text-red-400" />
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="text-xs mt-1 mb-3">
                              <div className="font-medium mb-1">Formula:</div>
                              <ScrollArea className="h-[60px] w-full">
                                <div className="bg-muted/40 p-1.5 rounded text-muted-foreground font-mono text-[0.7rem] dark:bg-muted/20 whitespace-pre">
                                  {stat.expression || "N/A"}
                                </div>
                              </ScrollArea>
                            </div>
                          )}
                          </div>

                          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs mt-auto">                            <div className="flex items-center gap-1">
                              {stat.is_player_stat ? (
                                <Check size={14} className="text-red-900 dark:text-red-400" />
                              ) : (
                                <X size={14} className="text-red-500 dark:text-red-400" />
                              )}
                              Player Stat
                            </div>
                            <div className="flex items-center gap-1">
                              {stat.is_team_stat ? (
                                <Check size={14} className="text-red-900 dark:text-red-400" />
                              ) : (
                                <X size={14} className="text-red-500 dark:text-red-400" />
                              )}
                              Team Stat
                            </div>
                            <div className="flex items-center gap-1">
                              {stat.is_boxscore ? (
                                <Check size={14} className="text-red-900 dark:text-red-400" />
                              ) : (
                                <X size={14} className="text-red-500 dark:text-red-400" />
                              )}
                              Boxscore
                            </div>
                            <div className="flex items-center gap-1">
                              {stat.is_team_comparison ? (
                                <Check size={14} className="text-red-900 dark:text-red-400" />
                              ) : (
                                <X size={14} className="text-red-500 dark:text-red-400" />
                              )}
                              Team Comparison
                            </div>
                          </div>
                        </CardContent>

                        <CardFooter className="flex justify-end gap-2 pt-0 border-t mt-2 p-4 flex-shrink-0">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8"
                            onClick={() => handleEditStat(stat)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteStat(stat)}
                            className="h-8"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <SportStatsModal
        isOpen={modals.stat.isOpen}
        onClose={modals.stat.closeModal}
        stat={selectedStat}
      />
      <DeleteStatModal
        isOpen={modals.delete.isOpen}
        onClose={modals.delete.closeModal}
        stat={selectedStat}
      />
    </div>
  );
};

export default SportStatsCardView;
