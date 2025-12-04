import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

const Modal = ({
  // Required props
  open = false,
  onOpenChange,
  title,
  children,

  // Optional props
  description,
  icon: Icon,
  isLoading = false,
  error,
  loadingComponent = null,
  errorComponent = null,

  // Styling props
  size = "md", // sm, md, lg, xl, full
  maxHeight = "90vh",
  showHeader = true,
  headerGradient = true,
  scrollable = true,

  // Behavior props
  preventOutsideClose = false, // Prevent closing when clicking outside

  // Custom classes
  contentClassName = "",
  headerClassName = "",
  bodyClassName = "",
}) => {
  // Size configurations
  const sizeClasses = {
    sm: "max-w-[400px]",
    md: "max-w-[700px]",
    lg: "max-w-[900px]",
    xl: "max-w-[1200px]",
    full: "max-w-[95vw]",
  };

  // Default loading component
  const defaultLoadingComponent = (
    <div className="flex items-center justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );

  // Default error component
  const defaultErrorComponent = (
    <div className="p-4 text-center">
      <div className="text-destructive text-sm font-medium">
        {typeof error === "string" ? error : "An error occurred"}
      </div>
      <div className="text-muted-foreground text-xs mt-1">
        Please try again or contact support if the problem persists
      </div>
    </div>
  );

  const content = () => {
    if (isLoading) {
      return loadingComponent || defaultLoadingComponent;
    }

    if (error) {
      return errorComponent || defaultErrorComponent;
    }

    return children;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        // keep outer container clipped (rounded corners) and let inner ScrollArea
        // control scrolling via max-height + overflow-auto so small content keeps
        // a compact modal while large content scrolls.
        className={`overflow-hidden p-0 ${contentClassName}`}
        style={{ maxHeight }}
        onPointerDownOutside={preventOutsideClose ? (e) => e.preventDefault() : undefined}
        onInteractOutside={preventOutsideClose ? (e) => e.preventDefault() : undefined}
      >
        {showHeader && (title || description || Icon) && (
          <DialogHeader
            className={`px-6 pt-6 pb-4 border-b border-border/50 ${
              headerGradient
                ? "bg-gradient-to-r from-background via-primary/5 to-background"
                : "bg-background"
            } ${headerClassName}`}
          >
            <div className="flex items-center gap-3">
              {Icon && (
                <div className="p-2 rounded-lg bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                {title && (
                  <DialogTitle className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                    {title}
                  </DialogTitle>
                )}
                {description && (
                  <DialogDescription className="text-sm text-muted-foreground">
                    {description}
                  </DialogDescription>
                )}
              </div>
            </div>
          </DialogHeader>
        )}
        {scrollable ? (
          <ScrollArea className={`px-6 pb-6 w-full max-h-[calc(90vh-96px)]`}>
            {content()}
          </ScrollArea>
        ) : (
          <div className="px-6 pb-6">{content()}</div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
