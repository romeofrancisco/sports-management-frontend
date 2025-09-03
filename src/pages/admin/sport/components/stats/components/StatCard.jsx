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
        "gap-0 group overflow-hidden border-l-4 flex-col h-full",
        stat.is_record
          ? "border-l-secondary bg-secondary/2 hover:border-l-secondary/80"
          : "border-l-orange-500 bg-orange-500/2 hover:border-l-orange-600",
        stat.is_negative &&
          "border-l-red-500 bg-red-500/2 hover:border-l-red-600"
      )}
    >
      {/* Header - Name, Code, and Type Badge */}
      <CardHeader className="pb-2 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h4
              className="font-semibold text-sm leading-tight line-clamp-1 mb-1"
              title={stat.name}
            >
              {stat.name}
            </h4>
            {stat.display_name && stat.display_name !== stat.name && (
              <p
                className="text-xs text-muted-foreground line-clamp-1"
                title={stat.display_name}
              >
                {stat.display_name}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {stat.point_value > 0 && (
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800 text-xs font-medium"
              >
                +{stat.point_value}pts
              </Badge>
            )}
            {stat.is_record ? (
              <Badge className="bg-secondary/10 text-secondary border-secondary/20 text-xs">
                <Activity className="h-3 w-3 mr-1" />
                Record
              </Badge>
            ) : (
              <Badge className="bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800 text-xs">
                <Calculator className="h-3 w-3 mr-1" />
                Formula
              </Badge>
            )}
          </div>
        </div>

        {/* Code */}
        <div className="flex items-center gap-2 text-xs">
          <Code className="h-3 w-3 text-muted-foreground" />
          <span className="font-mono bg-muted/40 px-2 py-0.5 rounded text-xs">
            {stat.code}
          </span>
        </div>
      </CardHeader>

      {/* Content - Formula or Description */}
      <CardContent className="py-2 flex-grow">
        {!stat.is_record && stat.expression && (
          <div className="mb-3">
            <div className="text-xs font-medium text-muted-foreground mb-1">
              Formula:
            </div>
            <div className="bg-muted/40 p-2 rounded text-xs font-mono border text-muted-foreground line-clamp-2">
              {stat.expression}
            </div>
          </div>
        )}

        {/* Compact Settings Row */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Boxscore:</span>
            {stat.is_boxscore ? (
              <Check size={12} className="text-green-600" />
            ) : (
              <X size={12} className="text-red-500" />
            )}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Team Comparison:</span>
            {stat.is_team_comparison ? (
              <Check size={12} className="text-green-600" />
            ) : (
              <X size={12} className="text-red-500" />
            )}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Player Summary:</span>
            {stat.is_player_summary ? (
              <Check size={12} className="text-green-600" />
            ) : (
              <X size={12} className="text-red-500" />
            )}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Team Summary:</span>
            {stat.is_team_summary ? (
              <Check size={12} className="text-green-600" />
            ) : (
              <X size={12} className="text-red-500" />
            )}
          </div>
        </div>
      </CardContent>

      {/* Footer - Action Buttons */}
      <CardFooter className="pt-2 border-t">
        <div className="flex gap-2 w-full">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 text-xs h-7"
            onClick={() => onEdit(stat)}
          >
            <Edit />
            Edit
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(stat)}
            className="flex-1 text-xs h-7"
          >
            <Trash2 />
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default StatCard;
