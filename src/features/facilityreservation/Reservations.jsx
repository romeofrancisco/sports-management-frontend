import React, { Suspense } from 'react'
import FacilityCalendar from './components/FacilityCalendar'
import { CalendarSkeleton } from '@/components/calendar/calendar-skeleton'

const Reservations = () => {
  return (
    <div className="space-y-4 container mx-auto p-1 md:p-6">
      <Suspense fallback={<CalendarSkeleton />}>
        <FacilityCalendar />
      </Suspense>
    </div>
  )
}

export default Reservations
