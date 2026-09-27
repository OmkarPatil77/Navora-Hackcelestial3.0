import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Menu, ArrowLeft } from 'lucide-react'
import { OperatorSidebar } from '@/components/navigation/OperatorSidebar'
import { OperatorAIAssistant } from '@/components/operator/OperatorAIAssistant'
import { Button } from '@/components/ui/Button'

export const OperatorLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const navigate = useNavigate()

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
          {/* Mobile Hamburger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 rounded-lg text-charcoal-700 hover:bg-sand-100 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
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

      {/* AI Assistant */}
      <OperatorAIAssistant />
    </div>
  )
}

export default OperatorLayout
