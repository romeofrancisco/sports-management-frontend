import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Check, ChevronLeft, ChevronRight } from "lucide-react";

const WorkflowStepper = ({
  steps = [],
  currentStep = 1,
  className,
  onNext,
  onPrevious,
}) => {
  const navigate = useNavigate();
  const completedSteps = steps.filter((step) => step.completed).length;
  const progress = (completedSteps / steps.length) * 100;
  const allCompleted = completedSteps === steps.length;

  return (
    <div className={cn("w-full space-y-6", className)}>
      {/* Horizontal Stepper */}
      <div className="w-full">
        <div className="flex items-center w-full">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isCompleted = step.completed;
            const isCurrent = step.current;
            const isDisabled = step.disabled;
            const Icon = step.icon;

            return (
              <React.Fragment key={step.id}>
                {/* Step indicator */}
                <div className="flex flex-col items-center mb-auto">
                  <button
                    onClick={() => {
                      if (!isDisabled && step.path) {
                        navigate(step.path);
                      }
                    }}
                    disabled={isDisabled}
                    className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200",
                      !isDisabled && "hover:scale-105 cursor-pointer",
                      isDisabled && "cursor-not-allowed",
                      isCompleted
                        ? "bg-primary border-primary text-primary-foreground hover:bg-primary/90"
                        : isCurrent
                        ? "bg-secondary border-secondary text-secondary-foreground hover:bg-secondary/90"
                        : isDisabled
                        ? "bg-muted border-muted-foreground/20 text-muted-foreground"
                        : "bg-background border-muted-foreground/40 text-muted-foreground hover:border-muted-foreground/60"
                    )}
                    title={
                      isDisabled
                        ? step.validationMessage ||
                          `Complete previous steps first`
                        : `Go to ${step.title}`
                    }
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4" />
                    ) : Icon ? (
                      <Icon className="w-4 h-4" />
                    ) : (
                      <span className="text-sm font-medium">{stepNumber}</span>
                    )}
                  </button>
                  {/* Step label */}
                  <div className="mt-2 text-center hidden sm:block">
                    {" "}
                    <div
                      className={cn(
                        "text-sm font-medium",
                        isCompleted
                          ? "text-primary"
                          : isCurrent
                          ? "text-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {step.title}
                    </div>
                    {step.description && (
                      <div
                        className={cn(
                          "text-xs mt-1",
                          isCompleted
                            ? "text-primary/80"
                            : isCurrent
                            ? "text-foreground/80"
                            : isDisabled
                            ? "text-muted-foreground/70"
                            : "text-muted-foreground"
                        )}
                      >
                        {step.description}
                      </div>
                    )}
                    {/* Validation message for disabled steps */}
                    {isDisabled && step.validationMessage && (
                      <div className="text-xs mt-1 px-2 py-1 bg-amber-500/10 text-amber-700 border border-amber-200/30 rounded-md max-w-[250px]">
                        {step.validationMessage}
                      </div>
                    )}
                    {/* Sub-steps indicator - only show for current step */}
                    {step.subSteps && isCurrent && (
                      <div className="mt-2 space-y-1">
                        {step.subSteps.map((subStep, subIndex) => {
                          const SubIcon = subStep.icon;
                          return (
                            <div
                              key={subStep.id}
                              className={cn(
                                "flex items-center gap-1 text-xs px-2 py-1 rounded-md transition-all",
                                subStep.completed
                                  ? "bg-green-100 text-green-700 border border-green-200"
                                  : "bg-muted/50 text-muted-foreground border border-muted"
                              )}
                            >
                              {subStep.completed ? (
                                <CheckCircle2 className="w-3 h-3" />
                              ) : SubIcon ? (
                                <SubIcon className="w-3 h-3" />
                              ) : (
                                <div className="w-3 h-3 rounded-full border border-current" />
                              )}
                              <span className="text-xs">{subStep.title}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "flex-1 h-0.5 mx-4 transition-all duration-200",
                      isCompleted ? "bg-primary" : "bg-muted-foreground/20"
                    )}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WorkflowStepper;
