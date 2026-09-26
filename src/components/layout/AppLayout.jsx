import React from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from '@/components/navigation/Navbar'
import { Footer } from '@/components/layout/Footer'
import { TripSaathiCopilot } from '@/components/traveler/TripSaathiCopilot'

export const AppLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans selection:bg-terracotta-100 selection:text-terracotta-900">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <TripSaathiCopilot />
    </div>
  )
}
