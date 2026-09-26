import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, Compass, Shield, CheckCircle, RefreshCw, Clock } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

export const HeroSection = () => {
  const navigate = useNavigate()

  return (
    <section className="relative overflow-hidden pt-10 pb-16 md:pt-16 md:pb-24 lg:pt-20 lg:pb-32 bg-gradient-to-b from-sand-50 via-background to-sand-100/40">
      
      {/* Subtle background ambient mesh */}
      <div className="absolute inset-0 bg-subtle-grid opacity-60 pointer-events-none" />
      <div className="absolute top-0 right-1/4 -z-10 h-96 w-96 rounded-full bg-terracotta-100/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 -z-10 h-80 w-80 rounded-full bg-sand-300/30 blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Editorial Value Proposition */}
          <motion.div 
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="lg:col-span-7 space-y-6"
          >
            {/* Pill Header */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sand-100/90 border border-sand-300 text-charcoal-800 text-xs font-semibold shadow-soft-xs">
              <Compass className="w-3.5 h-3.5 text-terracotta-600" />
              <span>Dynamic Travel Planning & Operations</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-charcoal-950 font-serif leading-[1.12]">
              Your journey should <br />
              <span className="italic font-normal text-terracotta-600 underline decoration-terracotta-300 decoration-wavy decoration-1 underline-offset-8">
                adapt to you.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-charcoal-700 leading-relaxed max-w-xl font-normal">
              Build a personalized trip around your interests, budget and travel style — then let TripSaathi adapt it when plans change.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <Button
                size="lg"
                onClick={() => navigate('/plan')}
                className="bg-terracotta-600 hover:bg-terracotta-700 text-white shadow-soft-md"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Plan My Journey
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/recommendations')}
                className="bg-white/90 text-charcoal-800 border-sand-300 hover:bg-sand-50"
                leftIcon={<Compass className="w-4 h-4 text-charcoal-600" />}
              >
                Explore Experiences
              </Button>
            </div>

            {/* Trust and Key Capabilities */}
            <div className="pt-6 border-t border-sand-200/80 grid grid-cols-3 gap-4 text-left">
              <div>
                <p className="text-base font-bold text-charcoal-900 font-serif">100%</p>
                <p className="text-xs text-muted-foreground mt-0.5">Dynamic Rerouting</p>
              </div>
              <div>
                <p className="text-base font-bold text-charcoal-900 font-serif">Zero-loss</p>
                <p className="text-xs text-muted-foreground mt-0.5">Disruption Safety Net</p>
              </div>
              <div>
                <p className="text-base font-bold text-charcoal-900 font-serif">Dual-engine</p>
                <p className="text-xs text-muted-foreground mt-0.5">Traveler & Operator</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Editorial Visual Treatment & Live Dynamic Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            className="lg:col-span-5 relative"
          >
            {/* Main Visual Frame */}
            <div className="relative rounded-2xl p-2 bg-gradient-to-b from-sand-200 to-sand-300/40 shadow-soft-xl">
              <div className="relative rounded-xl overflow-hidden aspect-[4/4.8] sm:aspect-[4/4.5] bg-charcoal-900">
                <img
                  src="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80"
                  alt="Goa Coastal Architecture"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700 opacity-90"
                />

                {/* Subtle dark gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-transparent to-black/20" />

                {/* Top Badge on image */}
                <div className="absolute top-4 left-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white text-xs font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Goa Experience • 4D/3N</span>
                  </div>
                </div>

                {/* Bottom Destination Tag */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-[11px] font-semibold tracking-wider uppercase text-sand-300">Active Destination</p>
                  <h3 className="text-xl font-bold font-serif">Panjim Latin Quarter & Coastal Trail</h3>
                </div>
              </div>

              {/* Floating Live AI Adaptation Card (The core visual metaphor) */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="absolute -bottom-6 -left-4 sm:-left-8 sm:-bottom-8 max-w-[320px] rounded-xl bg-white/95 backdrop-blur-md border border-sand-200/90 p-3.5 shadow-soft-lg"
              >
                <div className="flex items-center justify-between pb-2 border-b border-sand-100">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-charcoal-900">
                    <Sparkles className="w-3.5 h-3.5 text-terracotta-600" />
                    <span>TripSaathi Adaptation Engine</span>
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                    LIVE
                  </span>
                </div>
                
                <div className="mt-2.5 space-y-1.5">
                  <div className="flex items-start gap-2 text-xs text-charcoal-700">
                    <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-charcoal-900 text-[11px]">Flight delayed 2h 15m</p>
                      <p className="text-[10px] text-muted-foreground">Airport pickup rescheduled automatically</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-xs text-charcoal-700 pt-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-charcoal-900 text-[11px]">Sunset Cruise swapped to Day 2</p>
                      <p className="text-[10px] text-emerald-700">Zero penalty • Dinner table preserved</p>
                    </div>
                  </div>
                </div>
              </motion.div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
