import React from "react";
import { CalendarBody } from "@/components/calendar/calendar-body";
import { CalendarProvider } from "@/components/calendar/calendar-context";
import { DndProvider } from "@/components/calendar/dnd-context";
import FacilityCalendarHeader from "./FacilityCalendarHeader";
import FacilityAddEditReservationDialog from "./FacilityAddEditReservationDialog";
import FacilityEventDetailsDialog from "./FacilityEventDetailsDialog";
import { useReservations } from "@/hooks/useReservations";
import { useCalendar } from "@/components/calendar/calendar-context";

function FacilityCalendarContent() {
  const { view, selectedDate, setEvents } = useCalendar();

  // pass selectedDate as ISO string and request full (no pagination) for calendar
  const dateParam = selectedDate ? selectedDate.toISOString() : undefined;
  const { data: events } = useReservations({ view: view, date: dateParam, no_pagination: 1 });

  const eventsRef = React.useRef(null);

  React.useEffect(() => {
    if (!events) return;
    

    // Ensure calendar receives plain objects with string datetimes
    const safe = events.map((e) => ({
      id: e.id,
      title: e.title,
      description: e.description,
      startDate: typeof e.startDate === "string" ? e.startDate : e.startDate?.toString?.() || null,
      endDate: typeof e.endDate === "string" ? e.endDate : e.endDate?.toString?.() || null,
      color: e.color,
      user: e.user,
      meta: e.meta,
    }));

    let eventsStr = null;
    try {
      eventsStr = JSON.stringify(safe);
    } catch (err) {
      eventsStr = `len:${safe.length}`;
    }

    if (eventsStr !== eventsRef.current) {
      eventsRef.current = eventsStr;
      setEvents(safe);
    }
  }, [events, setEvents]);


  return (
    <DndProvider showConfirmation={true}>
      <div className="w-full border-2 border-primary/20 rounded-xl">
        <FacilityCalendarHeader />
        <CalendarBody />
      </div>
    </DndProvider>
  );
}

export function FacilityCalendar() {
  return (
    <CalendarProvider
      events={[]}
      users={[]}
      view="month"
      addEditDialogComponent={FacilityAddEditReservationDialog}
      detailsDialogComponent={FacilityEventDetailsDialog}
      type="reservation"
    >
      <FacilityCalendarContent />
    </CalendarProvider>
  );
}

export default FacilityCalendar;
