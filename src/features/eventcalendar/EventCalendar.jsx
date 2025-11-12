import React, { Suspense } from "react";
import { Calendar } from "@/components/calendar/calendar";
import { CalendarSkeleton } from "@/components/calendar/calendar-skeleton";

const EventCalendar = () => {
  return (
    <div className="w-full max-h-[100vh-64px]">
      <Suspense fallback={<CalendarSkeleton />}>
        <Calendar />
      </Suspense>
    </div>
  );
};

export default EventCalendar;
