"use client";

import React from "react";
import { CalendarBody } from "@/components/calendar/calendar-body";
import { CalendarProvider } from "@/components/calendar/calendar-context";
import { DndProvider } from "@/components/calendar/dnd-context";
import { CalendarHeader } from "@/components/calendar/calendar-header";
import { useEvents } from "@/hooks/useEvents";
import { useCoaches } from "@/hooks/useCoaches";

export function Calendar() {
  // Hooks must be called directly inside the component (client-side).
  const { data: events } = useEvents();
  // request a large page size so we get all coaches for the calendar
  const { data: coachesData } = useCoaches({}, 1, 1000);
  // coaches API returns a paginated shape { results: [...], count, ... }
  // normalize to an array for the CalendarProvider
  const users = coachesData?.results || [];
  

  return (
    <CalendarProvider events={events} users={users} view="month">
      <DndProvider showConfirmation={false}>
        <div className="w-full border-2 border-primary/20 rounded-xl">
          <CalendarHeader />
          <CalendarBody />
        </div>
      </DndProvider>
    </CalendarProvider>
  );
}
