import React, { useState } from "react";
import { Button } from "../../../../ui/button";
import { 
  Plus, 
  Save, 
  RotateCcw, 
  Eye,
  ChevronUp,
  ChevronDown,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

const QuickActions = ({ 
  onSave, 
  onReset, 
  onPreview,
  hasChanges = false,
  isSaving = false,
  className = "" 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const actions = [
    {
      icon: Save,
      label: "Save Progress",
      action: onSave,
      variant: hasChanges ? "default" : "outline",
      disabled: !hasChanges || isSaving,
      className: hasChanges ? "bg-blue-600 hover:bg-blue-700" : ""
    },
    {
      icon: Eye,
      label: "Preview Data",
      action: onPreview,
      variant: "outline",
      disabled: false
    },
    {
      icon: RotateCcw,
      label: "Reset Form",
      action: onReset,
      variant: "outline",
      disabled: !hasChanges
    }
  ];

  return (
    <div className={cn("fixed bottom-6 left-6 z-50", className)}>
      <div className="flex flex-col items-start gap-2">
        {/* Expanded Actions */}
        {isExpanded && (
          <div className="flex flex-col gap-2 animate-in slide-in-from-bottom-2 duration-200">
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant}
                size="sm"
                onClick={action.action}
                disabled={action.disabled}
                className={cn(
                  "flex items-center gap-2 shadow-lg transition-all duration-200",
                  action.className,
                  "hover:scale-105 hover:shadow-xl"
                )}
              >
                <action.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{action.label}</span>
              </Button>
            ))}
          </div>
        )}

        {/* Main Toggle Button */}
        <Button
          variant="default"
          size="lg"
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "rounded-full w-14 h-14 shadow-2xl transition-all duration-300",
            "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700",
            "hover:scale-110 hover:shadow-2xl",
            isExpanded && "rotate-180",
            hasChanges && "animate-pulse"
          )}
        >
          {isExpanded ? (
            <ChevronDown className="h-6 w-6" />
          ) : hasChanges ? (
            <Zap className="h-6 w-6" />
          ) : (
            <Plus className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Status Indicator */}
      {hasChanges && !isExpanded && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full animate-ping" />
      )}
      {isSaving && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse" />
      )}
    </div>
  );
};

export default QuickActions;
