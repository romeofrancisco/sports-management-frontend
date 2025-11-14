import { Command as CommandPrimitive } from "cmdk";
import { useMemo, useState, useEffect, useRef } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Input } from "../ui/input";
import { Popover, PopoverAnchor, PopoverContent } from "../ui/popover";
import { Skeleton } from "../ui/skeleton";

export function AutoComplete({
  searchValue,
  onSearchValueChange,
  items,
  isLoading,
  placeholder = "Search...",
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // Map items for quick lookup
  const labels = useMemo(
    () =>
      items.reduce((acc, item) => ({ ...acc, [item.value]: item.label }), {}),
    [items]
  );

  const onSelectItem = (value) => {
    // When selecting from dropdown, update input
    onSearchValueChange(labels[value] ?? value);
    setOpen(false);
  };

  // Show popover only if there are items and user typed something
  useEffect(() => {
    const active = document.activeElement;
    const isFocused = containerRef.current?.contains(active);

    // Only open if there is a search value and items exist
    if (
      searchValue.trim() !== "" &&
      items.length > 0 &&
      isFocused &&
      !isLoading
    ) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [items, searchValue, isLoading]);

  const onInputBlur = (e) => {
    if (!e.relatedTarget?.hasAttribute("cmdk-list")) {
      setOpen(false);
    }
  };

  return (
    <div className="flex items-center" ref={containerRef}>
      <Popover open={open} onOpenChange={setOpen}>
        <Command shouldFilter={false}>
          <PopoverAnchor asChild>
            <CommandPrimitive.Input
              asChild
              value={searchValue}
              onValueChange={onSearchValueChange}
              onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
              onFocus={() =>
                searchValue.trim() !== "" && items.length > 0 && setOpen(true)
              }
              onMouseDown={() => items.length > 0 && setOpen(true)}
              onBlur={onInputBlur}
            >
              <Input placeholder={placeholder} />
            </CommandPrimitive.Input>
          </PopoverAnchor>

          {!open && <CommandList aria-hidden="true" className="hidden" />}

          <PopoverContent
            asChild
            onOpenAutoFocus={(e) => e.preventDefault()}
            onInteractOutside={(e) => {
              if (
                e.target instanceof Element &&
                e.target.hasAttribute("cmdk-input")
              ) {
                e.preventDefault();
              }
            }}
            className="w-[--radix-popover-trigger-width] p-0"
          >
            <CommandList>
              {isLoading && (
                <CommandPrimitive.Loading>
                  <div className="p-1">
                    <Skeleton className="h-6 w-full" />
                  </div>
                </CommandPrimitive.Loading>
              )}

              {items.length > 0 && !isLoading ? (
                <CommandGroup>
                  {items.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onMouseDown={(e) => e.preventDefault()}
                      onSelect={onSelectItem}
                    >
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : null}

              {!isLoading && items.length === 0 && (
                <CommandEmpty>No items.</CommandEmpty>
              )}
            </CommandList>
          </PopoverContent>
        </Command>
      </Popover>
    </div>
  );
}
