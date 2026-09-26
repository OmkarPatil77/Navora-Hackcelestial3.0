import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Wallet, Clock, Compass, Utensils, Waves, Mountain, Shield, Check, Flame, Coffee, Camera } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency } from '@/lib/utils'

export const PlanningSection = () => {
  const [selectedInterests, setSelectedInterests] = useState(['Adventure', 'Food & Heritage', 'Beaches'])
  const [budgetLevel, setBudgetLevel] = useState(35000)
  const [selectedPace, setSelectedPace] = useState('Balanced')

  const interestOptions = [
    { label: "Adventure", icon: Mountain, color: "text-amber-700 bg-amber-50" },
    { label: "Food & Heritage", icon: Utensils, color: "text-coral-700 bg-coral-50" },
    { label: "Beaches", icon: Waves, color: "text-sky-700 bg-sky-50" },
    { label: "Cafes & Art", icon: Coffee, color: "text-emerald-700 bg-emerald-50" },
    { label: "Photography", icon: Camera, color: "text-purple-700 bg-purple-50" },
    { label: "Wellness & Spa", icon: Heart, color: "text-rose-700 bg-rose-50" },
  ]

  const toggleInterest = (label) => {
    setSelectedInterests(prev => 
      prev.includes(label) 
        ? (prev.length > 1 ? prev.filter(i => i !== label) : prev)
        : [...prev, label]
    )
  }

  return (
    <section className="py-20 md:py-28 bg-[#FAF6F0]/80 border-y border-[#F1ECE1] relative overflow-hidden">
      {/* Hand-drawn accent spiral */}
      <div className="absolute top-10 right-8 -z-0 opacity-15 pointer-events-none hidden lg:block">
        <svg width="140" height="140" viewBox="0 0 100 100" fill="none" stroke="#DF6951" strokeWidth="2">
          <path d="M50 50 A20 20 0 0 1 70 50 A40 40 0 0 1 30 50 A60 60 0 0 1 90 50" />
        </svg>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with Human Editorial Touch */}
        <div className="max-w-2xl text-left mb-14 sm:mb-16">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-coral-500 font-sans">
              Tailored Blueprint
            </span>
            <span className="font-handwriting text-lg text-[#5E6282] -rotate-2">
              ~ your travel, your tempo
            </span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-navy-900 font-serif leading-[1.18]">
            Your interests. Your budget. <br className="hidden sm:inline" />
            <span className="text-coral-500 italic">Your journey.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#5E6282] leading-relaxed">
            TripSaathi doesn't assemble cookie-cutter tour packages. We calibrate every stop to your travel pace, dynamic budget constraints, and personal taste.
          </p>
        </div>

        {/* 4 Interactive Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Pillar 1: Interests */}
          <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="p-6 h-full bg-white rounded-3xl flex flex-col justify-between border border-[#EFEAE0] shadow-soft-sm hover:shadow-soft-lg transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-coral-50 border border-coral-200/60 flex items-center justify-center text-coral-600 shadow-xs">
                    <Heart className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold text-coral-600 bg-coral-50 px-2.5 py-1 rounded-full">
                    Pillar 01
                  </span>
                </div>
                <h3 className="font-serif font-bold text-lg text-navy-900 mb-1.5">Curated Interests</h3>
                <p className="text-xs text-[#5E6282] mb-5 leading-relaxed">
                  Toggle your travel vibes. Discover handpicked authentic local spots beyond ordinary tourist traps.
                </p>
              </div>

              {/* Interactive Interest Pills */}
              <div className="space-y-2 pt-3 border-t border-[#F5F2EA]">
                <p className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400">
                  Click to select vibes:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {interestOptions.map(item => {
                    const isSelected = selectedInterests.includes(item.label)
                    const Icon = item.icon
                    return (
                      <motion.button
                        key={item.label}
                        type="button"
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleInterest(item.label)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                          isSelected
                            ? "bg-coral-500 text-white font-semibold shadow-warm-coral"
                            : "bg-[#F5F2EA] text-charcoal-700 hover:bg-[#EBE5D8]"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{item.label}</span>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </motion.button>
                    )
                  })}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Pillar 2: Smart Budgeting */}
          <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="p-6 h-full bg-white rounded-3xl flex flex-col justify-between border border-[#EFEAE0] shadow-soft-sm hover:shadow-soft-lg transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-700 shadow-xs">
                    <Wallet className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                    Pillar 02
                  </span>
                </div>
                <h3 className="font-serif font-bold text-lg text-navy-900 mb-1.5">Smart Budgeting</h3>
                <p className="text-xs text-[#5E6282] mb-4 leading-relaxed">
                  Real-time cost intelligence across boutique stays, dining, and activities without surprise bills.
                </p>
              </div>

              {/* Dynamic Interactive Budget Preview */}
              <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EFEAE0] space-y-2.5 text-xs">
                <div className="flex justify-between items-center text-navy-900 font-medium">
                  <span className="text-[11px] text-muted-foreground font-semibold">Target Budget:</span>
                  <span className="font-bold font-serif text-sm text-navy-900">{formatCurrency(budgetLevel)}</span>
                </div>

                {/* Slider */}
                <input
                  type="range"
                  min="20000"
                  max="80000"
                  step="5000"
                  value={budgetLevel}
                  onChange={(e) => setBudgetLevel(Number(e.target.value))}
                  className="w-full h-1.5 bg-sand-300 rounded-lg appearance-none cursor-pointer accent-coral-500"
                />

                <div className="w-full bg-[#E5DFD3] h-2 rounded-full overflow-hidden flex">
                  <div className="bg-coral-500 h-full w-[68%]" />
                  <div className="bg-emerald-500 h-full w-[32%]" />
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground pt-0.5">
                  <span>{formatCurrency(Math.round(budgetLevel * 0.68))} allocated</span>
                  <span className="text-emerald-700 font-bold">{formatCurrency(Math.round(budgetLevel * 0.32))} safety buffer</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Pillar 3: Adaptive Duration */}
          <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="p-6 h-full bg-white rounded-3xl flex flex-col justify-between border border-[#EFEAE0] shadow-soft-sm hover:shadow-soft-lg transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-700 shadow-xs">
                    <Clock className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
                    Pillar 03
                  </span>
                </div>
                <h3 className="font-serif font-bold text-lg text-navy-900 mb-1.5">Adaptive Duration</h3>
                <p className="text-xs text-[#5E6282] mb-4 leading-relaxed">
                  Calculated transit buffers so you actually absorb the sunset rather than racing to the next checklist item.
                </p>
              </div>

              <div className="space-y-2.5 pt-3 border-t border-[#F5F2EA]">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#5E6282] font-medium">Trip Timeline:</span>
                  <span className="font-bold text-navy-900 font-serif">4 Days / 3 Nights</span>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/60 flex items-center gap-2 text-[11px] text-amber-900">
                  <Compass className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>3-4 unhurried curated stops per day</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Pillar 4: Travel Style */}
          <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="p-6 h-full bg-white rounded-3xl flex flex-col justify-between border border-[#EFEAE0] shadow-soft-sm hover:shadow-soft-lg transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200/60 flex items-center justify-center text-sky-700 shadow-xs">
                    <Compass className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full">
                    Pillar 04
                  </span>
                </div>
                <h3 className="font-serif font-bold text-lg text-navy-900 mb-1.5">Travel Style</h3>
                <p className="text-xs text-[#5E6282] mb-4 leading-relaxed">
                  Match your natural rhythm whether you desire a slow retreat, balanced wander, or high-energy thrills.
                </p>
              </div>

              {/* Interactive Rhythm Switcher */}
              <div className="grid grid-cols-3 gap-1.5 pt-3 border-t border-[#F5F2EA]">
                {['Relaxed', 'Balanced', 'Action'].map(style => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setSelectedPace(style)}
                    className={`py-2 px-1 text-center rounded-xl text-[11px] font-medium transition-all ${
                      selectedPace === style
                        ? 'bg-navy-900 text-white font-bold shadow-soft-xs'
                        : 'bg-[#F5F2EA] text-[#5E6282] hover:bg-[#EBE5D8]'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
export default PlanningSection
