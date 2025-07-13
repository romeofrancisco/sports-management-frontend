import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  Edit,
  Trash2,
  Calculator,
  Code,
  Check,
  X,
  Activity,
} from "lucide-react";

const StatCard = ({ stat, onEdit, onDelete }) => {
  return (
    <Card
      className={cn(
        "group py-0 overflow-hidden border-l-2 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] flex flex-col h-full",
        stat.is_record
          ? "border-l-4 border-l-secondary hover:border-l-secondary/80"
          : "border-l-4 border-l-orange-500 hover:border-l-orange-600",
        stat.is_negative &&
          "border-l-4 border-l-red-500 hover:border-l-red-600",
        "bg-gradient-to-br from-card to-card/50"
      )}
    >
      <CardHeader
        className={cn(
          "flex-shrink-0 py-2 sm:py-3 relative",
          stat.is_record
            ? "bg-gradient-to-r from-secondary/8 to-secondary/5 dark:from-secondary/20 dark:to-secondary/10"
            : "bg-gradient-to-r from-orange-500/8 to-orange-500/5 dark:from-orange-500/20 dark:to-orange-500/10",
          stat.is_negative &&
            "bg-gradient-to-r from-red-500/8 to-red-500/5 dark:from-red-500/20 dark:to-red-500/10"
        )}
      >
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <h4
              className="font-bold text-base sm:text-lg leading-tight line-clamp-2 text-foreground mb-2"
              title={stat.name}
            >
              {stat.name}
            </h4>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
              <Code className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="font-mono font-medium bg-muted/50 px-2 py-1 rounded text-xs">
                {stat.code}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-1 items-end">
            {stat.is_record ? (
              <Badge className="bg-secondary/10 text-secondary hover:bg-secondary/20 border-secondary/20 dark:bg-secondary/20 dark:text-secondary-foreground dark:border-secondary/40 font-semibold text-xs">
                <Activity className="h-3 w-3 mr-1" />
                Record
              </Badge>
            ) : (
              <Badge className="bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 border-orange-500/20 dark:bg-orange-500/20 dark:text-orange-300 dark:border-orange-500/40 font-semibold text-xs">
                <Calculator className="h-3 w-3 mr-1" />
                Formula
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-2 sm:pt-3 flex-grow flex flex-col p-3 sm:p-4">
        <div className="min-h-[60px] sm:min-h-[80px] mb-3 sm:mb-4">
          {stat.is_record ? (
            <div className="space-y-2 sm:space-y-3">
              <div className="text-xs sm:text-sm">
                <span className="font-semibold text-foreground">
                  Display Name:
                </span>
                <p className="text-muted-foreground mt-1 bg-muted/30 p-2 rounded text-xs sm:text-sm">
                  {stat.display_name || "Not specified"}
                </p>
              </div>
              {stat.point_value !== 0 && (
                <div className="text-xs sm:text-sm">
                  <span className="font-semibold text-foreground">
                    Point Value:
                  </span>
                  <div className="mt-1">
                    {stat.is_negative ? (
                      <Badge
                        variant="outline"
                        className="bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800 font-bold text-xs"
                      >
                        -{Math.abs(stat.point_value)} pts
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800 font-bold text-xs"
                      >
                        +{stat.point_value} pts
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-xs sm:text-sm">
              <div className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Calculator className="h-3 w-3 sm:h-4 sm:w-4" />
                Formula Expression:
              </div>
              <ScrollArea className="h-[50px] sm:h-[60px] w-full">
                <div className="bg-muted/60 p-2 sm:p-3 rounded-lg text-muted-foreground font-mono text-xs dark:bg-muted/30 whitespace-pre-wrap border">
                  {stat.expression || "No formula specified"}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>

        <div className="border-t pt-2 sm:pt-3 mt-auto">
          <div className="grid grid-cols-1 gap-2 text-xs sm:text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Boxscore:</span>
              <div className="flex items-center gap-1">
                {stat.is_boxscore ? (
                  <Check
                    size={14}
                    className="text-green-600 dark:text-green-400"
                  />
                ) : (
                  <X size={14} className="text-red-500 dark:text-red-400" />
                )}
                <span
                  className={
                    stat.is_boxscore
                      ? "text-green-600 dark:text-green-400 font-medium"
                      : "text-red-500 dark:text-red-400"
                  }
                >
                  {stat.is_boxscore ? "Enabled" : "Disabled"}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Team Comparison:</span>
              <div className="flex items-center gap-1">
                {stat.is_team_comparison ? (
                  <Check
                    size={14}
                    className="text-green-600 dark:text-green-400"
                  />
                ) : (
                  <X size={14} className="text-red-500 dark:text-red-400" />
                )}
                <span
                  className={
                    stat.is_team_comparison
                      ? "text-green-600 dark:text-green-400 font-medium"
                      : "text-red-500 dark:text-red-400"
                  }
                >
                  {stat.is_team_comparison ? "Enabled" : "Disabled"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between gap-2 pt-0 border-t-2 bg-muted/20 p-3 sm:p-4 flex-shrink-0">
        <Button
          size="sm"
          variant="outline"
          className="flex-1 h-8 sm:h-9 hover:bg-primary/10 hover:text-primary hover:border-primary transition-all duration-200 text-xs sm:text-sm"
          onClick={() => onEdit(stat)}
        >
          <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          Edit
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => onDelete(stat)}
          className="flex-1 h-8 sm:h-9 hover:bg-red-600 transition-all duration-200 text-xs sm:text-sm"
        >
          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StatCard;
