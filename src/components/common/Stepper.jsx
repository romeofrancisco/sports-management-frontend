import React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle } from "lucide-react";

const Stepper = ({ steps, currentStep, orientation = "horizontal", className }) => {
  return (
    <div className={cn("flex", orientation === "horizontal" ? "flex-row" : "flex-col", className)}>
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep || step.completed;
        const isCurrent = stepNumber === currentStep;
        const isUpcoming = stepNumber > currentStep && !step.completed;

        return (
          <div key={step.id || index} className={cn(
            "flex items-center",
            orientation === "horizontal" ? "flex-row" : "flex-col",
            index < steps.length - 1 && orientation === "horizontal" && "flex-1"
          )}>
            {/* Step Circle and Content */}
            <div className={cn(
              "flex items-center",
              orientation === "horizontal" ? "flex-row" : "flex-col text-center"
            )}>
              {/* Step Circle */}
              <div className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-200",
                isCompleted 
                  ? "bg-primary border-primary text-primary-foreground" 
                  : isCurrent 
                  ? "border-primary text-primary bg-background" 
                  : "border-muted-foreground/30 text-muted-foreground bg-background"
              )}>
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-medium">{stepNumber}</span>
                )}
              </div>

              {/* Step Content */}
              <div className={cn(
                "flex flex-col",
                orientation === "horizontal" ? "ml-3" : "mt-2"
              )}>
                <span className={cn(
                  "text-sm font-medium",
                  isCompleted || isCurrent ? "text-foreground" : "text-muted-foreground"
                )}>
                  {step.title}
                </span>
                {step.description && (
                  <span className={cn(
                    "text-xs",
                    isCompleted || isCurrent ? "text-muted-foreground" : "text-muted-foreground/70"
                  )}>
                    {step.description}
                  </span>
                )}
              </div>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className={cn(
                "transition-all duration-200",
                orientation === "horizontal" 
                  ? "flex-1 h-px mx-4 bg-border" 
                  : "w-px h-8 mx-auto my-2 bg-border",
                isCompleted ? "bg-primary" : "bg-muted-foreground/30"
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
};

const StepperStep = ({ title, description, icon: Icon, completed, current, disabled, onClick }) => {
  return (
    <div 
      className={cn(
        "flex items-center gap-3 p-4 rounded-lg border transition-all duration-200 cursor-pointer",
        completed ? "border-green-200 bg-green-50 hover:bg-green-100" :
        current ? "border-primary bg-primary/5 hover:bg-primary/10" :
        disabled ? "border-muted bg-muted/20 cursor-not-allowed" :
        "border-muted hover:border-muted-foreground/50 hover:bg-muted/50"
      )}
      onClick={!disabled ? onClick : undefined}
    >
      <div className={cn(
        "flex items-center justify-center w-10 h-10 rounded-full",
        completed ? "bg-green-100 text-green-600" :
        current ? "bg-primary text-primary-foreground" :
        disabled ? "bg-muted text-muted-foreground" :
        "bg-muted text-muted-foreground"
      )}>
        {completed ? (
          <CheckCircle2 className="h-5 w-5" />
        ) : Icon ? (
          <Icon className="h-5 w-5" />
        ) : (
          <Circle className="h-5 w-5" />
        )}
      </div>
      <div className="flex-1">
        <h4 className={cn(
          "font-medium",
          disabled ? "text-muted-foreground" : "text-foreground"
        )}>
          {title}
        </h4>
        {description && (
          <p className={cn(
            "text-sm mt-1",
            disabled ? "text-muted-foreground/70" : "text-muted-foreground"
          )}>
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export { Stepper, StepperStep };
export default Stepper;
