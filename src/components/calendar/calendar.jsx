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
  const { data: events } = useEvents({
    view: view,
    date: selectedDate,
  });
  const { data: coachesData } = useCoaches({}, 1, 1000);
  const users = coachesData?.results || [];

  // Update events in context when they're loaded
  React.useEffect(() => {
    if (events) {
      setEvents(events);
    }
  }, [events, setEvents]);

  // Update users in context when they're loaded
  React.useEffect(() => {
    if (users) {
      setUsers(users);
    }
  }, [users, setUsers]);

  return (
    <DndProvider showConfirmation={false}>
      <div className="w-full border-2 border-primary/20 rounded-xl">
        <CalendarHeader />
        <CalendarBody />
      </div>
    </DndProvider>
  );
}

export function Calendar() {
  return (
    <CalendarProvider events={[]} users={[]} view="month">
      <CalendarContent />
    </CalendarProvider>
  );
}
