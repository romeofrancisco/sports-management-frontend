import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

import { cn } from "@/lib/utils"

const ScrollArea = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => {
  return (
    (<ScrollAreaPrimitive.Root ref={ref} data-slot="scroll-area" className={cn("relative", className)} {...props}>
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className="ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] focus-visible:ring-4 focus-visible:outline-1">
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>)
  );
});
ScrollArea.displayName = "ScrollArea";

const ScrollBar = React.forwardRef(({
  className,
  orientation = "vertical",
  ...props
}, ref) => {
  return (
    (<ScrollAreaPrimitive.ScrollAreaScrollbar
      ref={ref}
      data-slot="scroll-bar"
      orientation={orientation}
      className={cn(
        "flex touch-none select-none rounded-full p-0.5 transition-all duration-150 ease-out data-[orientation=horizontal]:h-2 data-[orientation=vertical]:w-2 data-[orientation=horizontal]:flex-col bg-muted/30 hover:bg-muted/50",
        className
      )}
      {...props}>
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-thumb"
        className="relative flex-1 rounded-full bg-muted-foreground/50 hover:bg-muted-foreground/70 transition-colors" />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>)
  );
});
ScrollBar.displayName = "ScrollBar";

export { ScrollArea, ScrollBar }
