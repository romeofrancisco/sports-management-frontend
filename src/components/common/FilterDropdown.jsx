import React from "react";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "../ui/scroll-area";

/**
 * Generic FilterDropdown wrapper using shadcn DropdownMenu components.
 * Props:
 * - title: label shown in the menu header and on the trigger (default: 'Filter')
 * - headerRight: optional node to render at the right side of the header (e.g. view toggles)
 * - align: DropdownMenuContent align prop (default: 'end')
 * - widthClass: tailwind width class for the menu content (default: 'w-64')
 * - children: menu body nodes (groups, separators, etc.)
 * - clearLabel: optional label for footer clear action
 * - onClear: optional callback for clear action
 * - disableClear: optional boolean to disable the clear action
 */
const FilterDropdown = ({
  title = "Filter",
  headerRight = null,
  align = "end",
  widthClass = "w-64",
  children,
  clearLabel = "Clear All Filters",
  onClear = null,
  disableClear = false,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="ml-auto">
          <SlidersHorizontal />
          <span className="ml-2">{title}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align={align} className={`${widthClass}`}>
        <DropdownMenuGroup className="flex items-center justify-between px-1">
          <DropdownMenuLabel>{title}</DropdownMenuLabel>
          {headerRight}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <ScrollArea>
          <div className="max-h-64">{children}</div>
        </ScrollArea>

        {onClear && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup className="px-1">
              <DropdownMenuItem
                className="justify-center text-sm text-destructive"
                onSelect={(e) => {
                  if (onClear) onClear(e);
                }}
                disabled={disableClear}
              >
                {clearLabel}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterDropdown;
