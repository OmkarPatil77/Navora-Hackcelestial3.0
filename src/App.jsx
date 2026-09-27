import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { OperatorLayout } from '@/components/layout/OperatorLayout'
import { TripPlanningProvider } from '@/context/TripPlanningContext'

// Traveler & Public Pages
import { Landing } from '@/pages/Landing'
import { PlanTrip } from '@/pages/PlanTrip'
import { Recommendations } from '@/pages/Recommendations'
import { Itinerary } from '@/pages/Itinerary'
import { Trip } from '@/pages/Trip'

// Operator Pages
import { Operator } from '@/pages/Operator'
import { OperatorTours } from '@/pages/OperatorTours'
import { OperatorTourDetail } from '@/pages/OperatorTourDetail'
import { OperatorBookings } from '@/pages/OperatorBookings'
import { OperatorVendors } from '@/pages/OperatorVendors'
import { OperatorDisruptions } from '@/pages/OperatorDisruptions'
import { OperatorPayments } from '@/pages/OperatorPayments'
import { OperatorReports } from '@/pages/OperatorReports'

function App() {
  return (
    <TripPlanningProvider>
      <BrowserRouter>
        <Routes>
          {/* Public & Traveler Routes with Traveler Layout */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/plan" element={<PlanTrip />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/itinerary" element={<Itinerary />} />
            <Route path="/trip" element={<Trip />} />
          </Route>

          {/* Operator Portal Routes with Dark Operator Command Layout */}
          <Route path="/operator" element={<OperatorLayout />}>
            <Route index element={<Operator />} />
            <Route path="tours" element={<OperatorTours />} />
            <Route path="tours/:id" element={<OperatorTourDetail />} />
            <Route path="bookings" element={<OperatorBookings />} />
            <Route path="vendors" element={<OperatorVendors />} />
            <Route path="disruptions" element={<OperatorDisruptions />} />
            <Route path="payments" element={<OperatorPayments />} />
            <Route path="reports" element={<OperatorReports />} />
          </Route>

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </TripPlanningProvider>
  )
}


export default App
