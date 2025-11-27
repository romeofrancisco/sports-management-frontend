"use client";

import React from "react";
import { CalendarBody } from "@/components/calendar/calendar-body";
import { CalendarProvider } from "@/components/calendar/calendar-context";
import { DndProvider } from "@/components/calendar/dnd-context";
import { CalendarHeader } from "@/components/calendar/calendar-header";
import { useEvents } from "@/hooks/useEvents";
import { useCoaches } from "@/hooks/useCoaches";
import { useCalendar } from "@/components/calendar/calendar-context";

function CalendarContent() {
  const { view, selectedDate, setUsers, setEvents } = useCalendar();

  const dateParam = selectedDate ? selectedDate.toISOString() : undefined;
  const { data: events } = useEvents({
    view: view,
    date: dateParam,
  });

  const { data: coachesData } = useCoaches({}, 1, 1000);
  const users = coachesData?.results || [];

  // Memoize to prevent unnecessary updates
  const eventsRef = React.useRef(null);
  const usersRef = React.useRef(null);

  React.useEffect(() => {
    // Only update if events actually changed (deep comparison by stringifying)
    const eventsStr = JSON.stringify(events);
    if (events && eventsStr !== eventsRef.current) {
      eventsRef.current = eventsStr;
      setEvents(events);
    }
  }, [events, setEvents]);

  React.useEffect(() => {
    // Only update if users actually changed
    const usersStr = JSON.stringify(users);
    if (users && usersStr !== usersRef.current) {
      usersRef.current = usersStr;
      setUsers(users);
    }
  }, [users, setUsers]);

  return (
    <DndProvider showConfirmation={false}>
      <CalendarHeader />
      <CalendarBody />
    </DndProvider>
  );
}

export function Calendar() {
  return (
    <CalendarProvider type="event" events={[]} users={[]} view="month">
      <CalendarContent />
    </CalendarProvider>
  );
}
