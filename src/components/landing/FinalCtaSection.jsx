import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, MapPin, Compass } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export const FinalCtaSection = () => {
  const navigate = useNavigate()

  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-charcoal-950 text-white">
      {/* Editorial background image with deep gradient */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80"
          alt="Coastal Horizon"
          className="w-full h-full object-cover object-center opacity-25 filter grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/90 to-charcoal-950/70" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-charcoal-800 border border-charcoal-700 text-terracotta-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Experience the next evolution of travel planning</span>
        </div>

        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight font-serif text-sand-50">
          Ready to build your journey?
        </h2>

        <p className="text-sm sm:text-base text-charcoal-300 max-w-xl mx-auto leading-relaxed">
          Tell us where you want to go, set your budget, and let TripSaathi craft a resilient itinerary that adapts to every moment.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Button
            size="lg"
            onClick={() => navigate('/plan')}
            className="w-full sm:w-auto bg-terracotta-600 hover:bg-terracotta-700 text-white shadow-soft-lg px-8"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Start Planning
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate('/trip')}
            className="w-full sm:w-auto bg-charcoal-900/90 text-sand-200 border-charcoal-700 hover:bg-charcoal-800"
            leftIcon={<Compass className="w-4 h-4 text-terracotta-400" />}
          >
            View Live Demo Trip
          </Button>
        </div>

        <div className="pt-8 flex items-center justify-center gap-6 text-xs text-charcoal-400">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-terracotta-500" />
            Goa • Rajasthan • Kerala & beyond
          </span>
          <span>•</span>
          <span>Zero setup friction</span>
        </div>
      </div>
    </section>
  )
}
