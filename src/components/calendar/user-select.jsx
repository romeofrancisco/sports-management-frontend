import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCalendar } from "@/components/calendar/calendar-context";

export function UserSelect() {
  const {
    users = [],
    selectedUserId,
    filterEventsBySelectedUser,
  } = useCalendar();
  const [open, setOpen] = React.useState(false);

  const selectedLabel = React.useMemo(() => {
    if (!selectedUserId || selectedUserId === "all") return "All";
    const u = users.find((x) => String(x.id) === String(selectedUserId));
    return u
      ? u.name || `${u.first_name || ""} ${u.last_name || ""}`.trim()
      : "Unknown";
  }, [selectedUserId, users]);

  const selectedUser = React.useMemo(() => {
    if (!selectedUserId || selectedUserId === "all") return null;
    return users.find((x) => String(x.id) === String(selectedUserId)) || null;
  }, [selectedUserId, users]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
        >
          <div className="flex items-center gap-2">
            {selectedUserId === "all" ? (
              <>
                <div className="*:data-[slot=avatar]:ring-background flex -space-x-1 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
                  {users.slice(0, 3).map((user) => (
                    <Avatar key={user.id} className="size-6">
                      <AvatarImage
                        src={user.picturePath ?? undefined}
                        alt={user.name}
                      />
                      <AvatarFallback className="text-xs">
                        {(user.first_name || user.name || "?")[0]}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  <Avatar className="size-6">
                    <AvatarFallback className="text-xs">
                      +{users.length - 3}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <span>{selectedLabel}</span>
              </>
            ) : selectedUser ? (
              <>
                <Avatar className="size-5">
                  <AvatarImage
                    src={selectedUser.picturePath ?? undefined}
                    alt={selectedUser.name}
                  />
                  <AvatarFallback className="text-xs">
                    {(selectedUser.first_name || selectedUser.name || "?")[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="truncate">{selectedLabel}</span>
              </>
            ) : (
              <span>Select coach...</span>
            )}
          </div>

          <ChevronsUpDown className="ml-auto opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[260px] p-0">
        <Command>
          <CommandInput placeholder="Search users..." className="h-9" />
          <CommandList>
            <CommandEmpty>No users found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                value="all"
                onSelect={(currentValue) => {
                  filterEventsBySelectedUser(
                    currentValue === selectedUserId ? "all" : currentValue
                  );
                  setOpen(false);
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="*:data-[slot=avatar]:ring-background flex -space-x-1 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
                    {users.slice(0, 3).map((user) => (
                      <Avatar key={user.id} className="size-6">
                        <AvatarImage
                          src={user.picturePath ?? undefined}
                          alt={user.name}
                        />
                        <AvatarFallback className="text-xs">
                          {(user.first_name || user.name || "?")[0]}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    <Avatar className="size-6">
                      <AvatarFallback className="text-xs">
                        +{users.length - 3}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <span>All</span>
                  <Check
                    className={cn(
                      "ml-auto",
                      selectedUserId === "all" ? "opacity-100" : "opacity-0"
                    )}
                  />
                </div>
              </CommandItem>

              {users.map((user) => (
                <CommandItem
                  key={user.id}
                  value={String(user.id)}
                  onSelect={(currentValue) => {
                    filterEventsBySelectedUser(
                      currentValue === selectedUserId ? "all" : currentValue
                    );
                    setOpen(false);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="size-6">
                      <AvatarImage
                        src={user.picturePath ?? undefined}
                        alt={user.name}
                      />
                      <AvatarFallback className="text-xxs">
                        {(user.first_name || user.name || "?")[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate">{user.name}</span>
                  </div>
                  <span>{user.full_name}</span>
                  <Check
                    className={cn(
                      "ml-auto",
                      String(selectedUserId) === String(user.id)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
