"use client";
import { Filter, CheckIcon, RefreshCcw } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useFacilities } from "@/hooks/useFacilities";
import { useCalendar } from "@/components/calendar/calendar-context";

export default function FacilityFilterEvents() {
  const { data: facilitiesData } = useFacilities(
    {},
    { staleTime: 1000 * 60 * 5, noPagination: true }
  );
  const facilities = facilitiesData || [];
  const { filterEventsByFacility, selectedFacilityIds } = useCalendar();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Filter />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          key="all"
          className="flex items-center justify-between"
          onClick={(e) => {
            e.preventDefault();
            filterEventsByFacility("all");
          }}
        >
          <span>All Facilities</span>
          {(!selectedFacilityIds || selectedFacilityIds.length === 0) && (
            <CheckIcon className="h-4 w-4 " />
          )}
        </DropdownMenuItem>

        {facilities.map((f) => (
          <DropdownMenuItem
            key={f.id}
            className="flex items-center justify-between"
            onClick={(e) => {
              e.preventDefault();
              filterEventsByFacility(f.id);
            }}
          >
            <span className="truncate">{f.name}</span>
            {(selectedFacilityIds || []).some(
              (id) => String(id) === String(f.id)
            ) && <CheckIcon className="h-4 w-4 " />}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="flex items-center gap-2"
          variant="destructive"
          onClick={(e) => {
            e.preventDefault();
            filterEventsByFacility("all");
          }}
        >
          <RefreshCcw className="h-4 w-4" />
          Clear Filter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { FacilityFilterEvents };
