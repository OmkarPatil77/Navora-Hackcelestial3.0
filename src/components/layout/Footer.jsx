import React from 'react'
import { Link } from 'react-router-dom'
import { Logo } from '@/components/shared/Logo'
import { Sparkles, MapPin, Shield, Heart } from 'lucide-react'

export const Footer = () => {
  return (
    <footer className="border-t border-sand-200/90 bg-sand-100/50 text-charcoal-700">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Logo showTagline={true} />
            <p className="text-xs text-charcoal-600 leading-relaxed max-w-md">
              AI-powered dynamic tour planning and operations platform. We personalize every detail of your journey and intelligently adapt when disruptions happen.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-sand-200 text-charcoal-800 border border-sand-300">
                <Sparkles className="w-3 h-3 text-terracotta-600" />
                HackCelestial 3.0 Edition
              </span>
            </div>
          </div>

          {/* Traveler Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-900">Traveler</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/plan" className="text-charcoal-600 hover:text-terracotta-600 transition-colors">
                  Plan Personalized Trip
                </Link>
              </li>
              <li>
                <Link to="/recommendations" className="text-charcoal-600 hover:text-terracotta-600 transition-colors">
                  AI Recommendations
                </Link>
              </li>
              <li>
                <Link to="/itinerary" className="text-charcoal-600 hover:text-terracotta-600 transition-colors">
                  Dynamic Itinerary
                </Link>
              </li>
              <li>
                <Link to="/trip" className="text-charcoal-600 hover:text-terracotta-600 transition-colors">
                  Live Trip View
                </Link>
              </li>
            </ul>
          </div>

          {/* Operator Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-900">Tour Operations</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/operator" className="text-charcoal-600 hover:text-terracotta-600 transition-colors">
                  Command Center
                </Link>
              </li>
              <li>
                <Link to="/operator/tours" className="text-charcoal-600 hover:text-terracotta-600 transition-colors">
                  Active Tours Monitor
                </Link>
              </li>
              <li>
                <Link to="/operator/tours/tour-801" className="text-charcoal-600 hover:text-terracotta-600 transition-colors">
                  Disruption Recovery Demo
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-sand-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-muted-foreground">
          <p>© 2026 TripSaathi. Plan it. Personalize it. Adapt it.</p>
          <p className="flex items-center gap-1">
            Engineered with precision for dynamic travel experiences
          </p>
        </div>
      </div>
    </footer>
  )
}
