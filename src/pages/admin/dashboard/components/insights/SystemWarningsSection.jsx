import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// Utility function to safely render content
const safeRender = (content, fallback = "No data available") => {
  if (typeof content === "string") return content;
  if (typeof content === "number") return content.toString();
  if (content === null || content === undefined) return fallback;
  if (typeof content === "object") {
    // Try to extract meaningful content from object
    if (content.message) return content.message;
    if (content.description) return content.description;
    if (content.text) return content.text;
    return fallback;
  }
  return fallback;
};

const SystemWarningsSection = ({ warnings }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const INITIAL_DISPLAY_LIMIT = 3;

  if (!warnings || warnings.length === 0) {
    return null;
  }

  const displayWarnings = isExpanded ? warnings : warnings.slice(0, INITIAL_DISPLAY_LIMIT);
  const shouldShowMoreButton = warnings.length > INITIAL_DISPLAY_LIMIT;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-destructive" />
        <h3 className="text-lg font-semibold text-destructive">
          System Warnings
        </h3>
        <Badge variant="destructive" className="text-xs">
          {warnings.length}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-4">
        {displayWarnings.map((warning, index) => (
          <Card
            key={`warning-${index}`}
            className="group relative overflow-hidden border-2 border-destructive bg-gradient-to-br from-destructive/5 to-destructive/10 transition-all duration-300 hover:shadow-xl hover:scale-105 animate-in fade-in-50 duration-500"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-xl opacity-70 group-hover:opacity-100 transition-opacity"></div>

            <CardHeader className="pb-3 relative">
              <div className="flex items-start justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  System Warning
                </CardTitle>
                <div className="p-2 rounded-lg bg-destructive/10 backdrop-blur-sm border border-destructive/20">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="space-y-2">
                <p className="text-sm leading-relaxed">
                  {safeRender(warning, "System warning")}
                </p>
              </div>
              <div className="mt-3">
                <Badge
                  variant="outline"
                  className="text-xs bg-destructive/10 text-destructive border-destructive/30"
                >
                  High Priority
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Show More Button */}
      {shouldShowMoreButton && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-sm border-destructive/30 text-destructive hover:bg-destructive/10"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Show {warnings.length - INITIAL_DISPLAY_LIMIT} More
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default SystemWarningsSection;
