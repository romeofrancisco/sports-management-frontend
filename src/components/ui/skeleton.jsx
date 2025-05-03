import * as React from "react"
import { cn } from "@/lib/utils"

const Skeleton = React.forwardRef(({
  className,
  ...props
}, ref) => {
  return (
    (<div
      ref={ref}
      data-slot="skeleton"
      className={cn("bg-primary/10 animate-pulse rounded-md", className)}
      {...props} />)
  );
});
Skeleton.displayName = "Skeleton";

export { Skeleton }
