import React from 'react'
import { motion } from 'framer-motion'
import { Plane, AlertTriangle, Cpu, CalendarCheck, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'

export const AdaptationFlow = () => {
  const steps = [
    {
      step: "01",
      title: "Flight Delay",
      subtitle: "Disruption Trigger",
      desc: "Flight 6E-204 delayed by 135 mins due to air traffic.",
      icon: Plane,
      color: "border-rose-300 bg-rose-50/70 text-rose-700",
      pill: "Trigger",
      pillVariant: "danger"
    },
    {
      step: "02",
      title: "Impact Detection",
      subtitle: "Telemetry & Window Analysis",
      desc: "Pickup at 13:00 missed; Sunset Cruise at 17:30 at risk.",
      icon: AlertTriangle,
      color: "border-amber-300 bg-amber-50/70 text-amber-800",
      pill: "Detected",
      pillVariant: "warning"
    },
    {
      step: "03",
      title: "AI Recovery",
      subtitle: "Constraint Solver",
      desc: "Re-allocated cruise slot to Day 2 morning. Notified cab driver.",
      icon: Cpu,
      color: "border-terracotta-300 bg-terracotta-50/70 text-terracotta-800",
      pill: "Solved",
      pillVariant: "default"
    },
    {
      step: "04",
      title: "Updated Itinerary",
      subtitle: "Seamless Continuation",
      desc: "Dinner booking shifted to 20:30. Zero missed experiences.",
      icon: CalendarCheck,
      color: "border-emerald-300 bg-emerald-50/70 text-emerald-800",
      pill: "Synchronized",
      pillVariant: "success"
    }
  ]

  return (
    <section className="py-16 md:py-24 bg-background relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="spark" className="mb-3 text-[11px] font-semibold tracking-wider uppercase">
            The Dynamic Adaptation Engine
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-charcoal-950 font-serif">
            Plans change. <br className="sm:hidden" />
            <span className="italic text-terracotta-600">Your journey doesn't have to fall apart.</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-charcoal-700 leading-relaxed">
            When disruptions hit, ordinary itineraries break into stressful phone calls. TripSaathi detects timeline anomalies and automatically executes recovery maneuvers.
          </p>
        </div>

        {/* 4-Step Adaptation Visual Language Flow */}
        <div className="relative">
          
          {/* Connecting line behind cards on desktop */}
          <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-0.5 bg-gradient-to-r from-rose-200 via-amber-200 via-terracotta-200 to-emerald-300 -translate-y-6 z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {steps.map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="h-full bg-white border-sand-200 shadow-soft-xs hover:shadow-soft-md transition-all p-5 flex flex-col justify-between">
                    <div>
                      {/* Top Header */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-serif font-bold text-muted-foreground">
                          {item.step}
                        </span>
                        <Badge variant={item.pillVariant} size="sm">
                          {item.pill}
                        </Badge>
                      </div>

                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border mb-4 ${item.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>

                      <h3 className="font-serif font-bold text-base text-charcoal-900 mb-0.5">
                        {item.title}
                      </h3>
                      <p className="text-[11px] font-semibold text-terracotta-600 uppercase tracking-wide mb-2">
                        {item.subtitle}
                      </p>
                      <p className="text-xs text-charcoal-600 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    {/* Step bottom indicator */}
                    <div className="mt-5 pt-3 border-t border-sand-100 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>Status</span>
                      <span className="font-semibold text-charcoal-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        AI Verified
                      </span>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Real-time telemetry callout */}
        <div className="mt-12 rounded-2xl bg-charcoal-900 text-sand-50 p-6 sm:p-8 border border-charcoal-800 shadow-soft-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-charcoal-800 border border-charcoal-700 text-terracotta-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-base text-white">Dynamic Safety Net Guarantee</h4>
              <p className="text-xs text-charcoal-300 mt-1 max-w-xl leading-relaxed">
                Whether it's unexpected monsoon showers in Goa, flight gate changes, or vendor delays — your day is rebalanced in seconds without lost deposits.
              </p>
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-sand-100">Average Recovery Time</p>
              <p className="text-lg font-serif font-bold text-terracotta-400">&lt; 3.2 Seconds</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
