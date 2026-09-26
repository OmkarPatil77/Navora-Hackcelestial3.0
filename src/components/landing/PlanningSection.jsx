import React from 'react'
import { motion } from 'framer-motion'
import { Heart, Wallet, Clock, Compass, Sparkles, Utensils, Waves, Mountain, Shield } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency } from '@/lib/utils'

export const PlanningSection = () => {
  const interestPills = [
    { label: "Adventure", icon: Mountain, selected: true },
    { label: "Food & Heritage", icon: Utensils, selected: true },
    { label: "Beaches", icon: Waves, selected: true },
    { label: "Wellness", icon: Heart, selected: false },
    { label: "Nightlife", icon: Compass, selected: false },
  ]

  return (
    <section className="py-16 md:py-24 bg-sand-50/60 border-y border-sand-200/70 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl text-left mb-12 sm:mb-16">
          <Badge variant="secondary" className="mb-3 text-[11px] uppercase tracking-wider font-semibold">
            Tailored Blueprint
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-charcoal-950 font-serif">
            Your interests. Your budget. <br className="hidden sm:inline" />
            <span className="text-terracotta-600">Your journey.</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-charcoal-700 leading-relaxed">
            TripSaathi doesn't assemble generic cookie-cutter templates. We calibrate every stop to your travel pace, dynamic budget constraints, and personal taste.
          </p>
        </div>

        {/* 4 Interactive Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Pillar 1: Interests */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="p-5 h-full bg-white flex flex-col justify-between border-sand-200/90 shadow-soft-xs hover:shadow-soft-md">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-terracotta-50 border border-terracotta-200/60 flex items-center justify-center text-terracotta-700">
                    <Heart className="w-5 h-5" />
                  </div>
                  <Badge variant="default" size="sm">Pillar 01</Badge>
                </div>
                <h3 className="font-serif font-bold text-base text-charcoal-900 mb-1">Curated Interests</h3>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                  Select key travel vibes and let AI discover hidden authentic spots beyond the tourist traps.
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-3 border-t border-sand-100">
                {interestPills.map(item => (
                  <span
                    key={item.label}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                      item.selected
                        ? "bg-terracotta-600 text-white font-semibold shadow-xs"
                        : "bg-sand-100 text-charcoal-600 hover:bg-sand-200"
                    }`}
                  >
                    <item.icon className="w-3 h-3" />
                    {item.label}
                  </span>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Pillar 2: Budget */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="p-5 h-full bg-white flex flex-col justify-between border-sand-200/90 shadow-soft-xs hover:shadow-soft-md">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <Badge variant="success" size="sm">Pillar 02</Badge>
                </div>
                <h3 className="font-serif font-bold text-base text-charcoal-900 mb-1">Smart Budgeting</h3>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                  Real-time cost optimization across boutique stays, dining, and activities without unexpected overshoots.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-sand-50 border border-sand-200/80 space-y-1.5 text-xs">
                <div className="flex justify-between items-center text-charcoal-800 font-medium">
                  <span>Target Budget:</span>
                  <span className="font-bold font-serif text-charcoal-950">{formatCurrency(35000)}</span>
                </div>
                <div className="w-full bg-sand-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-terracotta-600 h-full w-[69%]" />
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground pt-0.5">
                  <span>₹24,200 allocated</span>
                  <span className="text-emerald-700 font-semibold">₹10,800 buffer</span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Pillar 3: Duration & Pacing */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="p-5 h-full bg-white flex flex-col justify-between border-sand-200/90 shadow-soft-xs hover:shadow-soft-md">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                    <Clock className="w-5 h-5" />
                  </div>
                  <Badge variant="warning" size="sm">Pillar 03</Badge>
                </div>
                <h3 className="font-serif font-bold text-base text-charcoal-900 mb-1">Adaptive Duration</h3>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                  Intelligent scheduling with calculated transit buffers so you enjoy experiences instead of rushing.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-sand-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-charcoal-700 font-medium">Trip Timeline:</span>
                  <span className="font-bold text-charcoal-900">4 Days / 3 Nights</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-charcoal-600">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>3-4 curated stops per day</span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Pillar 4: Travel Style */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="p-5 h-full bg-white flex flex-col justify-between border-sand-200/90 shadow-soft-xs hover:shadow-soft-md">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700">
                    <Compass className="w-5 h-5" />
                  </div>
                  <Badge variant="info" size="sm">Pillar 04</Badge>
                </div>
                <h3 className="font-serif font-bold text-base text-charcoal-900 mb-1">Travel Style</h3>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                  Match the rhythm whether you crave a laid-back retreat, balanced exploration, or action-packed schedule.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-sand-100">
                <div className="p-1.5 text-center rounded bg-terracotta-50 border border-terracotta-200 text-terracotta-800 text-[11px] font-bold">
                  Balanced
                </div>
                <div className="p-1.5 text-center rounded bg-sand-100 text-charcoal-600 text-[11px]">
                  Relaxed
                </div>
              </div>
            </Card>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
