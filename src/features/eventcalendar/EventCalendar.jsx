import React, { Suspense } from "react";
import { Calendar } from "@/components/calendar/calendar";
import { CalendarSkeleton } from "@/components/calendar/calendar-skeleton";

const EventCalendar = () => {
  return (
    <Suspense fallback={<CalendarSkeleton />}>
      <Calendar />
    </Suspense>
  );
};

export default EventCalendar;
