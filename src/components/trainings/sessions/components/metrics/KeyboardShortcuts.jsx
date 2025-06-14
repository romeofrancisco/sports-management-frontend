import React, { useState } from "react";
import { Button } from "../../../../ui/button";
import { 
  Keyboard, 
  ChevronLeft, 
  ChevronRight, 
  Save, 
  RotateCcw,
  X,
  HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

const KeyboardShortcuts = ({ className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);

  const shortcuts = [
    { keys: ["Alt", "←"], action: "Previous Player", icon: ChevronLeft },
    { keys: ["Alt", "→"], action: "Next Player", icon: ChevronRight },
    { keys: ["Ctrl", "S"], action: "Save Current Player", icon: Save },
    { keys: ["Ctrl", "R"], action: "Reset Form", icon: RotateCcw },
    { keys: ["Esc"], action: "Close Dialogs", icon: X },
  ];

  if (!isVisible) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsVisible(true)}
        className={cn("flex items-center gap-2", className)}
      >
        <HelpCircle className="h-4 w-4" />
        <span className="hidden sm:inline">Shortcuts</span>
      </Button>
    );
  }

  return (
    <div className={cn("fixed bottom-4 right-4 z-50", className)}>
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-6 max-w-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Keyboard className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Keyboard Shortcuts</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-3">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <shortcut.icon className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">{shortcut.action}</span>
              </div>
              <div className="flex items-center gap-1">
                {shortcut.keys.map((key, keyIndex) => (
                  <React.Fragment key={keyIndex}>
                    <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded">
                      {key}
                    </kbd>
                    {keyIndex < shortcut.keys.length - 1 && (
                      <span className="text-gray-400 text-xs">+</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Press <kbd className="px-1 py-0.5 text-xs bg-gray-100 border rounded">?</kbd> anytime for help
          </p>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcuts;
