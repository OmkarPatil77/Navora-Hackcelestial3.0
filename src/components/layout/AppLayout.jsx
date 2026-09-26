import React from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from '@/components/navigation/Navbar'
import { Footer } from '@/components/layout/Footer'
import { TripSaathiCopilot } from '@/components/traveler/TripSaathiCopilot'
import { useAuth } from '@/context/AuthContext'

export const AppLayout = () => {
  const { isOperator } = useAuth()

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans selection:bg-terracotta-100 selection:text-terracotta-900">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      {/* Traveler AI Copilot only shown for Travelers and Guests, never for Operators */}
      {!isOperator && <TripSaathiCopilot />}
    </div>
  )
}

export default AppLayout
