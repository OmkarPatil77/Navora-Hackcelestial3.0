import React, { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Menu, ArrowLeft, ShieldCheck, Radio, Sparkles } from 'lucide-react'
import { OperatorSidebar } from '@/components/navigation/OperatorSidebar'
import { OperatorOpsCopilot } from '@/components/operator/OperatorOpsCopilot'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useTripPlan } from '@/context/TripPlanningContext'

export const OperatorLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { activeDisruption, appliedRecovery } = useTripPlan()

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-charcoal-900 font-sans selection:bg-terracotta-500/20 selection:text-charcoal-950 flex flex-col">
      {/* Sidebar Navigation */}
      <OperatorSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area (offset by sidebar on desktop) */}
      <div className="lg:pl-64 flex-1 flex flex-col min-h-screen">
        {/* Top Operational Header Bar */}
        <header className="sticky top-0 z-30 w-full border-b border-sand-200/80 bg-white/90 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between shadow-soft-xs">
          {/* Mobile Hamburger & Page Context */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 rounded-lg text-charcoal-700 hover:bg-sand-100 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden sm:flex items-center gap-2 text-xs">
              <span className="font-bold text-charcoal-900">Goa Dispatch Hub</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground font-mono">12 Oct 2026 • 09:30 IST</span>
            </div>
          </div>

          {/* Right Status & Badges */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sand-100 border border-sand-200 text-charcoal-700 text-[11px] font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All Systems Operational</span>
            </div>

            <Badge variant="outline" size="sm" className="hidden sm:inline-flex bg-white text-[10px] uppercase font-mono tracking-wider text-muted-foreground">
              Demo Environment
            </Badge>

            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate('/trip')}
              className="text-xs gap-1.5 bg-white border-sand-300 hover:bg-sand-100"
              leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
            >
              Traveler View
            </Button>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>

      {/* Floating Ops Copilot */}
      <OperatorOpsCopilot />
    </div>
  )
}

export default OperatorLayout
