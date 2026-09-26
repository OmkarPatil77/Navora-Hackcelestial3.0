import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Bell, Compass, Calendar, MapPin, ArrowUpRight, Menu, X, ShieldCheck, PlusCircle } from 'lucide-react'
import { Logo } from '@/components/shared/Logo'
import { Button } from '@/components/ui/Button'
import { Dropdown, DropdownItem, DropdownSeparator } from '@/components/ui/Dropdown'
import { cn } from '@/lib/utils'

export const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { label: "Explore", href: "/recommendations", icon: Compass },
    { label: "Plan", href: "/plan", icon: PlusCircle },
    { label: "Itinerary", href: "/itinerary", icon: Calendar },
    { label: "Live Trip", href: "/trip", icon: MapPin, badge: "Active" },
  ]

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true
    if (path !== '/' && location.pathname.startsWith(path)) return true
    return false
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#F1ECE1] bg-[#FFFDF9]/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-8">
          <Logo />

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              const active = isActive(link.href)
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "relative flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold tracking-wide rounded-xl transition-all",
                    active
                      ? "text-coral-600 bg-coral-50 border border-coral-200/80 shadow-xs"
                      : "text-[#5E6282] hover:text-navy-900 hover:bg-[#FAF6F0]"
                  )}
                >
                  <Icon className={cn("w-3.5 h-3.5", active ? "text-coral-500" : "text-[#5E6282]")} />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="ml-1 inline-flex items-center px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <span className="w-1 h-1 rounded-full bg-emerald-500 mr-1 animate-pulse" />
                      {link.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* Operator Switch Link */}
          <Link
            to="/operator"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#5E6282] hover:text-navy-900 bg-[#FAF6F0] hover:bg-[#F2ECE1] rounded-xl border border-[#EFEAE0] transition-colors"
            title="Switch to Operator Command Center"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-navy-900" />
            <span>Operator Mode</span>
          </Link>

          {/* Notification bell */}
          <Dropdown
            trigger={
              <button 
                aria-label="View trip notifications"
                className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[#EFEAE0] bg-white text-navy-900 hover:bg-[#FAF6F0] transition-colors shadow-soft-xs"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-coral-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-coral-500"></span>
                </span>
              </button>
            }
          >
            <div className="p-2 w-72">
              <div className="flex items-center justify-between pb-2 border-b border-sand-200">
                <span className="text-xs font-bold text-navy-900">Trip Updates</span>
                <span className="text-[10px] text-coral-600 font-semibold">1 Alert</span>
              </div>
              <div className="py-2.5 space-y-1.5 text-xs text-charcoal-700">
                <div className="p-2 rounded-lg bg-amber-50/80 border border-amber-200 text-left">
                  <p className="font-semibold text-amber-900 text-[11px]">Flight Delay Update</p>
                  <p className="text-[11px] text-amber-800 mt-0.5">Afternoon schedule adjusted to protect evening dinner.</p>
                </div>
              </div>
              <Button size="sm" variant="outline" className="w-full text-xs" onClick={() => navigate('/trip')}>
                View Live Trip
              </Button>
            </div>
          </Dropdown>

          {/* Profile Dropdown */}
          <Dropdown
            trigger={
              <button className="flex items-center gap-2 pl-1.5 pr-2 py-1 rounded-xl border border-[#EFEAE0] bg-white hover:bg-[#FAF6F0] transition-colors shadow-soft-xs">
                <div className="w-6 h-6 rounded-full bg-navy-900 text-sand-50 flex items-center justify-center text-[10px] font-bold">
                  AS
                </div>
                <span className="text-xs font-semibold text-navy-900 hidden lg:inline-block">Anish</span>
              </button>
            }
          >
            <div className="p-1 min-w-[170px]">
              <div className="px-3 py-1.5 border-b border-sand-200 mb-1">
                <p className="text-xs font-bold text-navy-900">Anish Sharma</p>
                <p className="text-[10px] text-muted-foreground">Goa Trip • 4D/3N</p>
              </div>
              <DropdownItem onClick={() => navigate('/plan')}>Create New Trip</DropdownItem>
              <DropdownItem onClick={() => navigate('/itinerary')}>My Itinerary</DropdownItem>
              <DropdownItem onClick={() => navigate('/operator')}>Operator Portal</DropdownItem>
              <DropdownSeparator />
              <DropdownItem onClick={() => navigate('/')}>Sign Out</DropdownItem>
            </div>
          </Dropdown>

          {/* Primary CTA: Warm Honey Button */}
          <button
            onClick={() => navigate('/plan')}
            className="hidden sm:inline-flex items-center gap-1.5 bg-honey-500 hover:bg-honey-600 text-navy-950 font-bold text-xs px-4 py-2 rounded-xl shadow-warm-honey transition-all"
          >
            <span>Plan a Trip</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-navy-950" />
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-sand-200 bg-white text-charcoal-700"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-sand-200 bg-sand-50 px-4 pt-2 pb-4 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon
            const active = isActive(link.href)
            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold",
                  active ? "bg-sand-200 text-charcoal-950" : "text-charcoal-700 hover:bg-sand-100"
                )}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-terracotta-600" />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800">
                    {link.badge}
                  </span>
                )}
              </Link>
            )
          })}
          <div className="pt-2 border-t border-sand-200 flex flex-col gap-2">
            <Link
              to="/operator"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-charcoal-800 bg-sand-200/70"
            >
              <ShieldCheck className="w-4 h-4 text-charcoal-700" />
              <span>Operator Command Center</span>
            </Link>
            <Button
              size="sm"
              onClick={() => {
                setMobileMenuOpen(false)
                navigate('/plan')
              }}
              className="w-full"
            >
              Plan a Trip
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
