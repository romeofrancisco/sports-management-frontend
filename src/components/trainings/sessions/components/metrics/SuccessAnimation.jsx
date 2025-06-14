import React, { useState, useEffect } from "react";
import { CheckCircle2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const SuccessAnimation = ({ 
  isVisible, 
  onComplete,
  message = "Metrics saved successfully!",
  duration = 3000 
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        onComplete?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onComplete]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className={cn(
        "bg-white rounded-2xl shadow-2xl border border-green-200 p-8 max-w-sm mx-4",
        "animate-in zoom-in-50 slide-in-from-bottom-4 duration-500",
        "bg-gradient-to-br from-green-50 to-emerald-50"
      )}>
        <div className="text-center space-y-4">
          {/* Success Icon with Animation */}
          <div className="relative mx-auto w-16 h-16">
            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75" />
            <div className="relative w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-white" />
            </div>
          </div>

          {/* Success Message */}
          <div>
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              {message}
            </h3>
            <p className="text-sm text-green-700">
              Your data has been saved and improvements calculated.
            </p>
          </div>

          {/* Sparkles Effect */}
          <div className="flex justify-center space-x-2">
            {[...Array(3)].map((_, i) => (
              <Sparkles 
                key={i}
                className={cn(
                  "h-4 w-4 text-yellow-500 animate-pulse",
                  i === 1 && "animation-delay-150",
                  i === 2 && "animation-delay-300"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessAnimation;
