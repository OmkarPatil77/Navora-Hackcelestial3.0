import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, MapPin, Clock, AlertTriangle, Sparkles, 
  CheckCircle2, Compass, Sun, Wallet, Users, ArrowRight, 
  ShieldCheck, Edit3, RefreshCw, Plus, Layers, Zap, HeartHandshake, Shield 
} from 'lucide-react'
import { useTripPlan } from '@/context/TripPlanningContext'
import { RouteVisualizer } from '@/components/traveler/RouteVisualizer'
import { DependencyChainWidget } from '@/components/traveler/DependencyChainWidget'
import { ItineraryTimelineNode } from '@/components/traveler/ItineraryTimelineNode'
import { ItineraryItemDetailDialog } from '@/components/traveler/ItineraryItemDetailDialog'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatCurrency } from '@/lib/utils'
import PageTransition from '@/components/motion/PageTransition'

export const Itinerary = () => {
  const navigate = useNavigate()
  const {
    tripPreferences,
    selectedExperiences,
    itinerary,
    regenerateSingleDay,
    regenerateFullItinerary,
    updateItineraryItemTime,
    removeItineraryItem
  } = useTripPlan()

  const [selectedDayNumber, setSelectedDayNumber] = useState(1)
  const [activeItemModal, setActiveItemModal] = useState(null)
  const [isRegeneratingDay, setIsRegeneratingDay] = useState(false)
  const [activeAssistantNotice, setActiveAssistantNotice] = useState(null)

  const {
    destination,
    duration,
    travelers,
    budget,
    travelStyle,
    interests
  } = tripPreferences

  // Fallback if itinerary is null
  const daysList = itinerary?.days || []
  const currentDay = daysList.find(d => d.day === selectedDayNumber) || daysList[0] || {
    day: 1,
    title: "Arrival & Coastal Exploration",
    theme: "Arrival",
    date: "12 Oct 2026",
    items: []
  }

  const summary = itinerary?.summary || {
    totalCost: 34620,
    totalBudget: budget?.total || 35000,
    remainingBudget: 380,
    isOverBudget: false,
    breakdown: { activities: 7200, accommodation: 12250, transport: 9100, meals: 4200, estimatedBuffer: 1870 },
    metrics: { experienceCount: 5, transferCount: 3, totalDays: duration?.days || 4 }
  }

  const flexibility = itinerary?.flexibility || {
    percentage: 78,
    rating: "High Flexibility",
    bufferFormatted: "2h 15m",
    totalBufferMinutes: 135
  }

  const handleRegenerateCurrentDay = () => {
    setIsRegeneratingDay(true)
    setTimeout(() => {
      regenerateSingleDay(selectedDayNumber)
      setIsRegeneratingDay(false)
      setActiveAssistantNotice(`Day ${selectedDayNumber} has been rebalanced with optimal timing and rested buffers.`)
    }, 600)
  }

  const handleAssistantAction = (actionText) => {
    setActiveAssistantNotice(`TripSaathi Strategy: "${actionText}" applied to current schedule.`)
  }

  return (
    <PageTransition>
      <div className="py-10 md:py-14 bg-sand-50/50 min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header Row & Live Telemetry Summary */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-sand-200/80">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sand-100 text-charcoal-800 text-[11px] font-medium border border-sand-200">
                <Calendar className="w-3.5 h-3.5 text-terracotta-600" />
                <span>Day-by-Day Schedule</span>
              </span>
              <span className="text-xs text-muted-foreground">• Trip Code: TS-GOA-108</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold font-serif text-charcoal-950">
              Your {destination.city || destination.name} journey
            </h1>

            <p className="text-xs sm:text-sm text-charcoal-600">
              {duration.days} Days · {duration.nights} Nights · {travelers.total} Travelers ({travelers.composition || '2 Adults'}) • {travelStyle.pace.charAt(0).toUpperCase() + travelStyle.pace.slice(1)} Pacing
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Estimated Cost */}
            <div className="px-3.5 py-2 rounded-xl bg-white border border-sand-200 shadow-soft-xs">
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">Estimated Cost</span>
              <span className="text-sm sm:text-base font-serif font-bold text-charcoal-950">
                {formatCurrency(summary.totalCost)}
              </span>
            </div>

            {/* Budget Remaining */}
            <div className="px-3.5 py-2 rounded-xl bg-white border border-sand-200 shadow-soft-xs">
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">Remaining Buffer</span>
              <span className={`text-sm sm:text-base font-serif font-bold ${summary.isOverBudget ? 'text-rose-600' : 'text-emerald-700'}`}>
                {formatCurrency(summary.remainingBudget)}
              </span>
            </div>

            {/* Journey Fit */}
            <div className="px-3.5 py-2 rounded-xl bg-white border border-sand-200 shadow-soft-xs">
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">Journey Fit</span>
              <span className="text-sm sm:text-base font-serif font-bold text-terracotta-600">
                92%
              </span>
            </div>

            <Button
              size="sm"
              onClick={() => navigate('/trip')}
              className="bg-terracotta-600 hover:bg-terracotta-700 text-white text-xs shadow-soft-xs font-semibold"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Go to Live Trip
            </Button>
          </div>
        </div>

        {/* Assistant Notice Banner if active */}
        {activeAssistantNotice && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs flex items-center justify-between shadow-soft-xs"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{activeAssistantNotice}</span>
            </div>
            <button
              onClick={() => setActiveAssistantNotice(null)}
              className="text-emerald-800 hover:text-emerald-950 font-bold ml-2"
            >
              ✕
            </button>
          </motion.div>
        )}

        {/* Day Switcher Navigation Tabs */}
        <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1 scrollbar-none">
          <div className="flex items-center gap-2">
            {daysList.map((dObj) => {
              const isActive = dObj.day === selectedDayNumber
              return (
                <button
                  key={dObj.day}
                  type="button"
                  onClick={() => setSelectedDayNumber(dObj.day)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold shrink-0 transition-all ${
                    isActive
                      ? "bg-charcoal-900 text-white border-charcoal-800 shadow-soft-xs"
                      : "bg-white text-charcoal-700 border-sand-200 hover:bg-sand-100"
                  }`}
                >
                  <span className="font-mono text-[10px] opacity-75">DAY 0{dObj.day}</span>
                  <span className="font-serif font-bold">{dObj.theme || `Day ${dObj.day}`}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                    isActive ? "bg-charcoal-800 text-sand-200" : "bg-sand-100 text-charcoal-600"
                  }`}>
                    {dObj.date}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRegenerateCurrentDay}
              isLoading={isRegeneratingDay}
              className="text-xs bg-white text-charcoal-800 border-sand-300 hover:bg-sand-50"
              leftIcon={<RefreshCw className="w-3.5 h-3.5 text-terracotta-600" />}
            >
              Regenerate Day ✦
            </Button>
          </div>
        </div>

        {/* Main Content Layout: Timeline (8 cols) + Sidebar Analytics (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Column: Day Visualizer & Timeline (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Day Title Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-sand-200/90 shadow-soft-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold text-terracotta-600 uppercase tracking-wider block">
                  Day {currentDay.day} Focus & Schedule
                </span>
                <h3 className="font-serif font-bold text-lg sm:text-xl text-charcoal-950 mt-0.5">
                  {currentDay.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {currentDay.items?.length || 0} Connected Itinerary Nodes • {currentDay.date}
                </p>
              </div>

              <Badge variant="success" size="sm">
                Schedule Verified
              </Badge>
            </div>

            {/* Daily Route Map Visualizer */}
            <RouteVisualizer
              dayItems={currentDay.items || []}
              dayTitle={currentDay.title}
            />

            {/* Dependency Chain Visualizer */}
            <DependencyChainWidget
              dayItems={currentDay.items || []}
            />

            {/* Vertical Timeline Nodes Track */}
            <div className="space-y-2 relative border-l-2 border-sand-300/80 ml-3 sm:ml-5 pl-2">
              {currentDay.items && currentDay.items.length > 0 ? (
                currentDay.items.map((item, idx) => (
                  <ItineraryTimelineNode
                    key={item.id || idx}
                    item={item}
                    index={idx}
                    onClick={() => setActiveItemModal(item)}
                  />
                ))
              ) : (
                <EmptyState
                  title="No items scheduled for this day"
                  description="Use recommendations or regenerate to populate activities."
                  actionLabel="Add Experiences"
                  onAction={() => navigate('/recommendations')}
                />
              )}
            </div>

          </div>

          {/* Sidebar Analytics & AI Assistant (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Trip Summary Card */}
            <Card className="p-5 bg-white border-sand-200 shadow-soft-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-sand-100">
                <h3 className="font-serif font-bold text-base text-charcoal-950">
                  Trip Operational Summary
                </h3>
                <Badge variant="spark" size="sm">Active Sync</Badge>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center text-charcoal-700">
                  <span className="text-muted-foreground">Journey Fit Alignment:</span>
                  <span className="font-serif font-bold text-terracotta-600 text-sm">92%</span>
                </div>

                <div className="flex justify-between items-center text-charcoal-700">
                  <span className="text-muted-foreground">Estimated Total Cost:</span>
                  <span className="font-serif font-bold text-charcoal-950 text-sm">{formatCurrency(summary.totalCost)}</span>
                </div>

                <div className="flex justify-between items-center text-charcoal-700">
                  <span className="text-muted-foreground">Budget Buffer Remaining:</span>
                  <span className="font-serif font-bold text-emerald-700 text-sm">{formatCurrency(summary.remainingBudget)}</span>
                </div>

                <div className="flex justify-between items-center text-charcoal-700">
                  <span className="text-muted-foreground">Curated Experiences:</span>
                  <span className="font-semibold">{summary.metrics?.experienceCount || 5} stops</span>
                </div>

                <div className="flex justify-between items-center text-charcoal-700">
                  <span className="text-muted-foreground">Private Transfers:</span>
                  <span className="font-semibold">{summary.metrics?.transferCount || 4} routes</span>
                </div>

                <div className="flex justify-between items-center text-charcoal-700 pt-2 border-t border-sand-100">
                  <span className="text-muted-foreground">Journey Flexibility:</span>
                  <span className="font-bold text-purple-700">{flexibility.percentage}% ({flexibility.bufferFormatted} buffer)</span>
                </div>
              </div>
            </Card>

            {/* TripSaathi Assistant Panel */}
            <Card className="p-5 bg-terracotta-50/70 border border-terracotta-200/80 shadow-soft-xs space-y-3">
              <div className="flex items-center gap-2 text-terracotta-900 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-terracotta-600" />
                <span>✦ TripSaathi Assistant</span>
              </div>
              <p className="text-xs text-charcoal-700 leading-relaxed">
                Your itinerary is balanced across adventure, authentic cuisine and recovery downtime.
              </p>

              {/* Quick Assistant Prompts */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta-800 block">
                  Quick Rebalancing Actions:
                </span>
                {[
                  "Make Day 2 more relaxed",
                  "Reduce my transit spending",
                  "Add more food experiences",
                  "Show me what's flexible"
                ].map((prompt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleAssistantAction(prompt)}
                    className="w-full p-2 text-left rounded-lg bg-white/80 hover:bg-white text-[11px] font-medium text-charcoal-800 border border-terracotta-200/60 hover:border-terracotta-400 transition-colors flex items-center justify-between"
                  >
                    <span>{prompt}</span>
                    <ArrowRight className="w-3 h-3 text-terracotta-600 shrink-0" />
                  </button>
                ))}
              </div>
            </Card>

            {/* Disruption Safety Net Bridge */}
            <Card className="p-5 bg-charcoal-900 text-white border-charcoal-800 space-y-3">
              <div className="flex items-center gap-2 text-terracotta-400 font-bold text-sm">
                <ShieldCheck className="w-4 h-4" />
                <span>Dynamic Disruption Engine</span>
              </div>
              <p className="text-xs text-charcoal-300 leading-relaxed">
                Every node in this schedule is monitored. If a flight delay or weather anomaly strikes, TripSaathi dynamically shifts downstream dependencies.
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate('/trip')}
                className="w-full bg-charcoal-800 text-sand-100 border-charcoal-700 hover:bg-charcoal-700 text-xs"
              >
                Inspect Live Recovery Stream →
              </Button>
            </Card>

          </div>

        </div>

      </div>

      {/* Node Detail & Time Slot Modification Dialog */}
      <ItineraryItemDetailDialog
        item={activeItemModal}
        dayNumber={selectedDayNumber}
        isOpen={Boolean(activeItemModal)}
        onClose={() => setActiveItemModal(null)}
        onUpdateTime={updateItineraryItemTime}
        onRemoveItem={removeItineraryItem}
        allItemsInDay={currentDay.items || []}
      />

    </div>
    </PageTransition>
  )
}

export default Itinerary
