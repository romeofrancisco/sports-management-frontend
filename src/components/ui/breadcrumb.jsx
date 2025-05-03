import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"

const Breadcrumb = React.forwardRef(({
  ...props
}, ref) => {
  return <nav ref={ref} aria-label="breadcrumb" data-slot="breadcrumb" {...props} />;
})
Breadcrumb.displayName = "Breadcrumb";

const BreadcrumbList = React.forwardRef(({
  className,
  ...props
}, ref) => {
  return (
    (<ol
      ref={ref}
      data-slot="breadcrumb-list"
      className={cn(
        "text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5",
        className
      )}
      {...props} />)
  );
})
BreadcrumbList.displayName = "BreadcrumbList";

const BreadcrumbItem = React.forwardRef(({
  className,
  ...props
}, ref) => {
  return (
    (<li
      ref={ref}
      data-slot="breadcrumb-item"
      className={cn("inline-flex items-center gap-1.5", className)}
      {...props} />)
  );
})
BreadcrumbItem.displayName = "BreadcrumbItem";

const BreadcrumbLink = React.forwardRef(({
  asChild,
  className,
  ...props
}, ref) => {
  const Comp = asChild ? Slot : "a"

  return (
    (<Comp
      ref={ref}
      data-slot="breadcrumb-link"
      className={cn("hover:text-foreground transition-colors", className)}
      {...props} />)
  );
})
BreadcrumbLink.displayName = "BreadcrumbLink";

const BreadcrumbPage = React.forwardRef(({
  className,
  ...props
}, ref) => {
  return (
    (<span
      ref={ref}
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("text-foreground font-normal", className)}
      {...props} />)
  );
})
BreadcrumbPage.displayName = "BreadcrumbPage";

const BreadcrumbSeparator = React.forwardRef(({
  children,
  className,
  ...props
}, ref) => {
  return (
    (<li
      ref={ref}
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn("[&>svg]:size-3.5", className)}
      {...props}>
      {children ?? <ChevronRight />}
    </li>)
  );
})
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

const BreadcrumbEllipsis = React.forwardRef(({
  className,
  ...props
}, ref) => {
  return (
    (<span
      ref={ref}
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}>
      <MoreHorizontal className="size-4" />
      <span className="sr-only">More</span>
    </span>)
  );
})
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis";

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}
