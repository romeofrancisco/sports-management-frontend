import React, { Suspense } from "react";
import { Calendar } from "@/components/calendar/calendar";
import { CalendarSkeleton } from "@/components/calendar/calendar-skeleton";

const EventCalendar = () => {
  return (
    <div className="container mx-auto p-1 md:p-6 space-y-6">
      <Suspense fallback={<CalendarSkeleton />}>
        <Calendar />
      </Suspense>
    </div>
  );
};

export default EventCalendar;
