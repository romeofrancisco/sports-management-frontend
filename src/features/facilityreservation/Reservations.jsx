import React, { Suspense } from 'react'
import FacilityCalendar from './components/FacilityCalendar'
import { CalendarSkeleton } from '@/components/calendar/calendar-skeleton'

const Reservations = () => {
  return (
    <div>
      <Suspense fallback={<CalendarSkeleton />}>
        <FacilityCalendar />
      </Suspense>
    </div>
  )
}

export default Reservations
