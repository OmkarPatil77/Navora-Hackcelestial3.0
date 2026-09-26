import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, ShieldCheck, Sparkles, Activity, Layers, ArrowUpRight, Compass, BellRing } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export const OperatorSplitSection = () => {
  const navigate = useNavigate()

  return (
    <section className="py-16 md:py-24 bg-sand-100/40 border-t border-sand-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge variant="secondary" className="mb-2 text-[11px] uppercase tracking-wider font-semibold">
            Unified Travel Ecosystem
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-charcoal-950 font-serif">
            Two connected experiences. One intelligent engine.
          </h2>
          <p className="mt-2 text-sm text-charcoal-700">
            TripSaathi bridges the gap between individual travelers crafting dream journeys and tour operators managing complex logistics at scale.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Traveler Side Card */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="flex"
          >
            <Card className="flex flex-col justify-between p-8 bg-white border-sand-200 shadow-soft-sm rounded-2xl w-full">
              <div className="space-y-6">
                
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-terracotta-50 border border-terracotta-200 flex items-center justify-center text-terracotta-600">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <Badge variant="default" size="sm">For Travelers</Badge>
                      <h3 className="font-serif font-bold text-2xl text-charcoal-950 mt-1">Design your journey.</h3>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-charcoal-700 leading-relaxed">
                  Experience effortless AI-guided travel planning from initial inspiration to live on-trip modifications.
                </p>

                {/* Feature checklist */}
                <ul className="space-y-3 text-xs text-charcoal-800">
                  <li className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-terracotta-600 shrink-0" />
                    <span>Personalized itinerary generation based on interests & budget</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Compass className="w-4 h-4 text-terracotta-600 shrink-0" />
                    <span>Dynamic cost tracking and instant route optimization</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <BellRing className="w-4 h-4 text-terracotta-600 shrink-0" />
                    <span>Instant automatic adaptation when flights, weather, or plans shift</span>
                  </li>
                </ul>

                {/* Preview pill */}
                <div className="p-3.5 rounded-xl bg-sand-50 border border-sand-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-charcoal-900 block">Goa 4D/3N Explorer</span>
                    <span className="text-muted-foreground text-[11px]">Budget ₹35,000 • 2 Travelers</span>
                  </div>
                  <Badge variant="success" size="sm">Plan Ready</Badge>
                </div>

              </div>

              <div className="pt-6 mt-6 border-t border-sand-100">
                <Button
                  onClick={() => navigate('/plan')}
                  className="w-full bg-terracotta-600 hover:bg-terracotta-700 text-white"
                  rightIcon={<ArrowUpRight className="w-4 h-4" />}
                >
                  Explore Traveler Experience
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Operator Side Card */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="flex"
          >
            <Card className="flex flex-col justify-between p-8 bg-charcoal-950 text-white border-charcoal-800 shadow-soft-xl rounded-2xl w-full">
              <div className="space-y-6">
                
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-charcoal-800 border border-charcoal-700 flex items-center justify-center text-terracotta-400">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <Badge variant="dark" size="sm" className="border-charcoal-700 text-terracotta-400">For Tour Operators</Badge>
                      <h3 className="font-serif font-bold text-2xl text-white mt-1">Orchestrate every moving part.</h3>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-charcoal-300 leading-relaxed">
                  Real-time command center for agency operators to monitor active fleets, catch disruptions, and approve automated recovery workflows.
                </p>

                {/* Feature checklist */}
                <ul className="space-y-3 text-xs text-charcoal-300">
                  <li className="flex items-center gap-2.5">
                    <Activity className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Real-time fleet monitoring and live guest status tracking</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Layers className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Proactive anomaly detection across flights, weather & vendors</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-terracotta-400 shrink-0" />
                    <span>1-Click AI incident recovery plans with vendor synchronization</span>
                  </li>
                </ul>

                {/* Preview pill */}
                <div className="p-3.5 rounded-xl bg-charcoal-900 border border-charcoal-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-white block">Active Command Stream</span>
                    <span className="text-charcoal-400 text-[11px]">18 Active Tours • 1 Urgent Recovery</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    Live Stream
                  </span>
                </div>

              </div>

              <div className="pt-6 mt-6 border-t border-charcoal-800">
                <Button
                  onClick={() => navigate('/operator')}
                  variant="outline"
                  className="w-full bg-charcoal-900 text-white border-charcoal-700 hover:bg-charcoal-800"
                  rightIcon={<ArrowUpRight className="w-4 h-4" />}
                >
                  Open Operator Command Center
                </Button>
              </div>
            </Card>
          </motion.div>

        </div>

      </div>
    </section>
  )
}
