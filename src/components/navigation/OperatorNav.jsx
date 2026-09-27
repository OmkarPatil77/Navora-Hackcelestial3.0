import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Activity, Layers, ArrowLeft, RefreshCw, AlertTriangle, ShieldCheck, CalendarCheck, Store, CreditCard, BarChart3 } from 'lucide-react'
import { Logo } from '@/components/shared/Logo'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export const OperatorNav = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const navItems = [
    { label: "Command Center", href: "/operator", icon: Activity },
    { label: "All Active Tours", href: "/operator/tours", icon: Layers },
    { label: "Bookings", href: "/operator/bookings", icon: CalendarCheck },
    { label: "Vendors", href: "/operator/vendors", icon: Store },
    { label: "Disruptions", href: "/operator/disruptions", icon: AlertTriangle },
    { label: "Payments", href: "/operator/payments", icon: CreditCard },
    { label: "Reports", href: "/operator/reports", icon: BarChart3 },
  ]

  const isActive = (path) => {
    if (path === '/operator' && location.pathname === '/operator') return true
    if (path === '/operator/tours' && location.pathname.startsWith('/operator/tours')) return true
    if (path === '/operator/bookings' && location.pathname.startsWith('/operator/bookings')) return true
    if (path === '/operator/vendors' && location.pathname.startsWith('/operator/vendors')) return true
    if (path === '/operator/disruptions' && location.pathname.startsWith('/operator/disruptions')) return true
    if (path === '/operator/payments' && location.pathname.startsWith('/operator/payments')) return true
    if (path === '/operator/reports' && location.pathname.startsWith('/operator/reports')) return true
    return false
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-charcoal-800 bg-charcoal-950 text-sand-50 transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Brand + Operator Badge */}
        <div className="flex items-center gap-6">
          <Logo isDark={true} to="/operator" />

          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-charcoal-800 border border-charcoal-700 text-terracotta-400 text-[11px] font-semibold tracking-wider uppercase">
            <ShieldCheck className="w-3.5 h-3.5 text-terracotta-400" />
            <span>Ops Desk</span>
          </div>

          {/* Ops Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors",
                    active
                      ? "bg-charcoal-800 text-white font-semibold"
                      : "text-charcoal-400 hover:text-white hover:bg-charcoal-900"
                  )}
                >
                  <Icon className={cn("w-3.5 h-3.5", active ? "text-terracotta-400" : "text-charcoal-500")} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate('/')}
            className="bg-charcoal-900 text-sand-200 border-charcoal-700 hover:bg-charcoal-800 hover:text-white text-xs gap-1.5"
            leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
          >
            Traveler Mode
          </Button>
        </div>
      </div>
    </header>
  )
}
