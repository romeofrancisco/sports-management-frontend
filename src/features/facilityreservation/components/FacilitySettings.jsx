"use client";
import { Settings as SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { useCalendar } from "@/components/calendar/calendar-context";

export default function FacilitySettings() {
  const { filterEventsByStatus, selectedStatus } = useCalendar();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <SettingsIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={(e) => e.preventDefault()}>
          Show only approved
          <div className="ml-auto">
            <Switch
              checked={selectedStatus === "approved"}
              onCheckedChange={(checked) => filterEventsByStatus(checked ? "approved" : "all")}
            />
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => e.preventDefault()}>
          Show only pending
          <div className="ml-auto">
            <Switch
              checked={selectedStatus === "pending"}
              onCheckedChange={(checked) => filterEventsByStatus(checked ? "pending" : "all")}
            />
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { FacilitySettings };
