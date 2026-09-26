import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, MapPin, Clock, AlertTriangle, Sparkles, 
  CheckCircle2, Check, Compass, Sun, Wallet, Users, ArrowRight, 
  ShieldCheck, Edit3, RefreshCw, Plus, Layers, Zap, Info, X 
} from 'lucide-react'
import { useTripPlan } from '@/context/TripPlanningContext'
import { formatCurrency } from '@/lib/utils'
import PageTransition from '@/components/motion/PageTransition'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

// Modular Itinerary Experience Components
import { ItineraryHeader } from '@/components/traveler/itinerary/ItineraryHeader'
import { ItinerarySummaryCards } from '@/components/traveler/itinerary/ItinerarySummaryCards'
import { ItineraryActivityCard } from '@/components/traveler/itinerary/ItineraryActivityCard'
import { ItineraryTransitNode } from '@/components/traveler/itinerary/ItineraryTransitNode'
import { ItineraryContextualSuggestion } from '@/components/traveler/itinerary/ItineraryContextualSuggestion'
import { DynamicDisruptionSection } from '@/components/traveler/itinerary/DynamicDisruptionSection'
import { AlternativeComparisonModal } from '@/components/traveler/itinerary/AlternativeComparisonModal'
import { ImpactAnalysisModal } from '@/components/traveler/itinerary/ImpactAnalysisModal'
import { OptimizeDayModal } from '@/components/traveler/itinerary/OptimizeDayModal'
import { WhatIfSimulationModal } from '@/components/traveler/itinerary/WhatIfSimulationModal'
import { ScheduleConflictModal } from '@/components/traveler/itinerary/ScheduleConflictModal'
import { ActivityDetailModal } from '@/components/traveler/itinerary/ActivityDetailModal'
import { ItineraryMapView } from '@/components/traveler/itinerary/ItineraryMapView'
import { ItineraryBudgetView } from '@/components/traveler/itinerary/ItineraryBudgetView'

export const Itinerary = () => {
  const navigate = useNavigate()
  const {
    tripPreferences,
    selectedExperiences,
    itinerary,
    setItinerary,
    regenerateSingleDay,
    updateItineraryItemTime,
    removeItineraryItem,
    isTripBooked,
    bookTrip,
    cancelBooking
  } = useTripPlan()

  // Navigation Tabs: 'timeline' | 'map' | 'budget'
  const [activeTab, setActiveTab] = useState('timeline')

  // Selected Day in Itinerary
  const [selectedDayNumber, setSelectedDayNumber] = useState(1)

  // Interactive Modals State
  const [activeItemDetailModal, setActiveItemDetailModal] = useState(null)
  const [isWhatIfOpen, setIsWhatIfOpen] = useState(false)
  const [isOptimizeOpen, setIsOptimizeOpen] = useState(false)
  const [isComparisonOpen, setIsComparisonOpen] = useState(false)
  const [impactModalAlternative, setImpactModalAlternative] = useState(null)
  const [scheduleConflictData, setScheduleConflictData] = useState(null)
  const [highlightedMapStopId, setHighlightedMapStopId] = useState(null)

  // Toast / System Confirmation Alert
  const [confirmationNotice, setConfirmationNotice] = useState(null)

  // AI Contextual suggestion state (can be dismissed or added)
  const [isAiSuggestionVisible, setIsAiSuggestionVisible] = useState(true)

  // Dynamic Disruption demo state (can be replaced by user)
  const [disruptedActivityResolved, setDisruptedActivityResolved] = useState(false)
  const [activeAlternativeApplied, setActiveAlternativeApplied] = useState(null)

  // Destination and trip metadata
  const city = tripPreferences?.destination?.city || tripPreferences?.destination?.name || "Goa"
  const dateRange = tripPreferences?.dates?.startDate && tripPreferences?.dates?.endDate
    ? `${new Date(tripPreferences.dates.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} – ${new Date(tripPreferences.dates.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`
    : "12 Oct – 16 Oct"
  const daysCount = tripPreferences?.duration?.days || 5
  const travelersCount = tripPreferences?.travelers?.total || 2

  // Fallback days & items if itinerary is loading
  const daysList = itinerary?.days || [
    {
      day: 1,
      title: "Arrival & Coastal Exploration",
      theme: "Arrival",
      date: "12 Oct",
      items: [
        {
          id: "item-d1-arrival",
          title: "Arrival at Dabolim Airport (GOI)",
          type: "flight",
          startTime: "10:30 AM",
          endTime: "11:30 AM",
          durationMinutes: 60,
          cost: 0,
          location: "Dabolim Terminal",
          proximity: "Origin Airport",
          transitMode: "Flight arrived",
          status: "Confirmed",
          matches: ["Logistics", "Direct Flight"],
          reasons: [
            "Scheduled non-stop flight arrival from origin",
            "Pre-arranged express baggage clearance window",
            "Private chauffeur awaiting at Terminal Arrival Gate 3"
          ]
        },
        {
          id: "item-d1-checkin",
          title: "Heritage Boutique Villa & Resort Check-in",
          type: "hotel",
          startTime: "12:00 PM",
          endTime: "01:30 PM",
          durationMinutes: 90,
          cost: 12000,
          location: "Candolim / Panjim Riverside",
          proximity: "Central Base",
          transitMode: "Cab arranged (35 min)",
          status: "Confirmed",
          matches: ["Luxury Stay", "Riverside View"],
          reasons: [
            "Centrally located boutique property with top heritage ratings",
            "Early check-in approved with complimentary welcome drink",
            "Located within 15 min of scheduled dining stops"
          ]
        },
        {
          id: "item-d1-lunch",
          title: "Welcome Traditional Goan Thali Lunch",
          type: "meal",
          startTime: "02:00 PM",
          endTime: "03:30 PM",
          durationMinutes: 90,
          cost: 1300,
          location: "Panjim Heritage Bistro",
          proximity: "10 min from hotel",
          transitMode: "Cab arranged",
          status: "Confirmed",
          matches: ["Culinary", "Seafood"],
          reasons: [
            "Authentic Goan curry and Kokum Kadhi curated by local chef",
            "Pre-reserved waterfront table for 2 travelers",
            "Fits comfortably into your ₹30,000 allocated culinary budget"
          ]
        },
        {
          id: "item-d1-beach",
          title: "Baga Beach Sunset Experience",
          type: "experience",
          startTime: "04:30 PM",
          endTime: "06:30 PM",
          durationMinutes: 120,
          cost: 800,
          location: "Baga Beach, North Goa",
          proximity: "12 min from hotel",
          transitMode: "Cab arranged",
          status: "Confirmed",
          matches: ["Beaches", "Photography"],
          reasons: [
            "Matches your primary interest in beaches and photography",
            "Fits your ₹30,000 budget cap",
            "12 minutes from your hotel via private transfer",
            "Available on your selected travel date with prime sunset visibility",
            "Does not conflict with your downstream dinner reservation"
          ]
        },
        {
          id: "item-d1-dinner",
          title: "Riverside Candlelight Seafood Dinner",
          type: "meal",
          startTime: "08:00 PM",
          endTime: "10:00 PM",
          durationMinutes: 120,
          cost: 1800,
          location: "Waterfront Bistro, Panjim",
          proximity: "15 min from beach",
          transitMode: "Cab arranged",
          status: "Confirmed",
          matches: ["Romantic Dining", "Waterfront"],
          reasons: [
            "Curated sunset ambience along the Mandovi river",
            "Pre-confirmed table reservation",
            "No downstream dependencies"
          ]
        }
      ]
    },
    {
      day: 2,
      title: "Coastal Waters, Scuba & Coves",
      theme: "Adventure",
      date: "13 Oct",
      items: [
        {
          id: "item-d2-breakfast",
          title: "Tropical Villa Breakfast with Fresh Poi",
          type: "meal",
          startTime: "08:30 AM",
          endTime: "09:30 AM",
          durationMinutes: 60,
          cost: 700,
          location: "Villa Dining Pavilion",
          proximity: "At Hotel",
          transitMode: "Walking",
          status: "Confirmed",
          matches: ["Breakfast", "Continental & Local"],
          reasons: ["Complimentary artisan villa breakfast", "High energy fuel before water sports"]
        },
        {
          id: "item-d2-watersports",
          title: "Water Sports & Jet Ski Safari",
          type: "experience",
          startTime: "02:00 PM",
          endTime: "04:00 PM",
          durationMinutes: 120,
          cost: 2500,
          location: "Calangute Beach Coast",
          proximity: "15 min from hotel",
          transitMode: "Cab arranged",
          status: "Cancelled",
          matches: ["Water Adventure", "Thrill"],
          reasons: ["Vendor cancelled due to localized swell"]
        },
        {
          id: "item-d2-dinner",
          title: "Seafood Balchão Feast at Fisherman's Wharf",
          type: "meal",
          startTime: "07:30 PM",
          endTime: "09:30 PM",
          durationMinutes: 120,
          cost: 2200,
          location: "Fisherman's Wharf, Salcete",
          proximity: "20 min transit",
          transitMode: "Cab arranged",
          status: "Confirmed",
          matches: ["Culinary", "Traditional Goan"],
          reasons: ["Top rated coastal seafood experience", "Fits evening schedule buffer"]
        }
      ]
    }
  ]

  const currentDay = daysList.find(d => d.day === selectedDayNumber) || daysList[0]

  // Calculated or dynamic metrics
  const totalCost = (itinerary?.summary?.totalCost || 29450) + (activeAlternativeApplied?.priceDiff || 0)
  const targetBudget = tripPreferences?.budget?.total || 30000
  const remainingBudget = Math.max(0, targetBudget - totalCost)

  // Count activities across all days
  const totalActivitiesCount = daysList.reduce((acc, d) => {
    const act = (d.items || []).filter(item => item.type !== 'flight' && item.type !== 'buffer')
    return acc + act.length
  }, 0) || 12

  const totalBookingsCount = 4

  // Breakdown for Budget Tab
  const budgetBreakdown = {
    accommodation: 12000,
    transportation: 5500,
    activities: 6450 + (activeAlternativeApplied?.priceDiff || 0),
    food: 4000,
    other: 1500
  }

  // Handle Alternative selection & comparison
  const alternativesList = [
    {
      id: "alt-scuba",
      title: "Scuba Diving & Coral Reef Safari",
      type: "experience",
      priceDiff: 500,
      priceDiffText: "+₹500 extra",
      distance: "15 min away",
      duration: "2 hrs",
      preferenceMatch: 95,
      features: [
        "Matches Adventure preference",
        "Available on Oct 13",
        "Fits current schedule"
      ]
    },
    {
      id: "alt-kayak",
      title: "Guided Kayaking in Mangrove Estuary",
      type: "experience",
      priceDiff: 0,
      priceDiffText: "Same price (₹0)",
      distance: "10 min away",
      duration: "2 hrs",
      preferenceMatch: 88,
      features: [
        "Available on Oct 13",
        "No schedule conflict",
        "Calm water guarantee"
      ]
    },
    {
      id: "alt-cruise",
      title: "Sunset River Catamaran Cruise",
      type: "experience",
      priceDiff: 300,
      priceDiffText: "+₹300 extra",
      distance: "20 min away",
      duration: "2 hrs",
      preferenceMatch: 91,
      features: [
        "Matches Photography preference",
        "Available on Oct 13",
        "Complimentary beverages"
      ]
    }
  ]

  // Prompt Section 11 & 19: Apply Alternative Change
  const handleApplyAlternativeChange = (alternative, newTripCost) => {
    setActiveAlternativeApplied(alternative)
    setDisruptedActivityResolved(true)
    setImpactModalAlternative(null)
    setIsComparisonOpen(false)

    // Update the real itinerary state
    if (itinerary && itinerary.days) {
      const updatedDays = itinerary.days.map(d => {
        if (d.day === 2) {
          const updatedItems = d.items.map(item => {
            if (item.id === "item-d2-watersports" || item.title.toLowerCase().includes("water sports")) {
              return {
                ...item,
                title: alternative.title,
                cost: (item.cost || 2000) + alternative.priceDiff,
                status: "Confirmed",
                matches: ["Water Adventure", "Photography", "AI Replaced"],
                reasons: [
                  "Dynamically substituted following vendor cancellation",
                  "Verified zero downstream conflict with evening dining",
                  "Matches high preference compatibility"
                ]
              }
            }
            return item
          })
          return { ...d, items: updatedItems }
        }
        return d
      })

      setItinerary({
        ...itinerary,
        days: updatedDays,
        summary: {
          ...itinerary.summary,
          totalCost: newTripCost,
          remainingBudget: Math.max(0, targetBudget - newTripCost)
        }
      })
    }

    // Prompt Section 19: Confirmation notification
    setConfirmationNotice({
      title: "✓ Itinerary Updated",
      message: `Water Sports was replaced with ${alternative.title}. Trip cost updated: ${formatCurrency(totalCost)} → ${formatCurrency(newTripCost)}`
    })
  }

  // Prompt Section 12: Apply Optimization
  const handleApplyOptimization = (dayNum) => {
    setIsOptimizeOpen(false)
    setConfirmationNotice({
      title: "✓ Day Optimization Applied",
      message: `Day ${dayNum} itinerary successfully reordered. 38 minutes of transit time saved with zero booking conflicts!`
    })
  }

  // Prompt Section 13: Apply What-If
  const handleApplyWhatIf = (sim) => {
    setIsWhatIfOpen(false)
    setConfirmationNotice({
      title: "✓ Scenario Applied",
      message: `"${sim.title}" applied to itinerary. Estimated trip cost adjusted to ${formatCurrency(sim.tripCostAfter)}.`
    })
  }

  // Prompt Section 15: Add AI Suggestion into Day Itinerary
  const handleAddAiSuggestion = () => {
    setIsAiSuggestionVisible(false)
    const newItem = {
      id: `item-ai-sunset-${Date.now()}`,
      title: "Sunset Point & Coastal Cliffs",
      type: "experience",
      startTime: "03:00 PM",
      endTime: "04:30 PM",
      durationMinutes: 90,
      cost: 300,
      location: "Aguada Rocky Cliffs",
      proximity: "12 min from hotel",
      transitMode: "Cab arranged",
      status: "AI Suggested",
      matches: ["Beach", "Photography"],
      reasons: [
        "Fills 2-hour idle relaxation window between afternoon and evening",
        "Exceptional golden-hour photography spot",
        "Minimal cost (+₹300) well within budget cushion"
      ]
    }

    if (itinerary?.days) {
      const updatedDays = itinerary.days.map(d => {
        if (d.day === selectedDayNumber) {
          const items = [...(d.items || [])]
          items.splice(items.length - 1, 0, newItem)
          return { ...d, items }
        }
        return d
      })
      setItinerary({
        ...itinerary,
        days: updatedDays,
        summary: {
          ...itinerary.summary,
          totalCost: totalCost + 300
        }
      })
    }

    setConfirmationNotice({
      title: "✓ Added to Itinerary",
      message: "Sunset Point (₹300) added between 3:00 PM and 4:30 PM. Transit arranged."
    })
  }

  // Prompt Section 14: Change Time with Schedule Conflict Warning
  const handleInitiateChangeTime = (item) => {
    // Show conflict simulation if user changes time to 5:00 PM (which conflicts with dinner)
    setScheduleConflictData({
      activityTitle: item.title,
      requestedTime: "5:00 PM",
      conflictingActivity: "Dinner at Fisherman's Wharf — 5:30 PM",
      item
    })
  }

  const handleResolveConflictMoveDownstream = () => {
    setScheduleConflictData(null)
    setConfirmationNotice({
      title: "✓ Schedule Adjusted",
      message: "Activity shifted to 5:00 PM. Dinner reservation smoothly moved downstream to 7:30 PM with zero conflict."
    })
  }

  const handleResolveConflictKeepTime = () => {
    setScheduleConflictData(null)
    setConfirmationNotice({
      title: "✓ Schedule Preserved",
      message: "Activity scheduled for 4:00 PM. Dinner remains at 5:30 PM."
    })
  }

  return (
    <PageTransition>
      <div className="py-8 md:py-12 bg-sand-50/50 min-h-[calc(100vh-4rem)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
          
          {/* 1. Trip Header (Prompt Section 2) */}
          <ItineraryHeader
            city={city}
            dateRange={dateRange}
            daysCount={daysCount}
            travelersCount={travelersCount}
            onOpenWhatIf={() => setIsWhatIfOpen(true)}
            onOpenOptimize={() => setIsOptimizeOpen(true)}
          />

          {/* 2. Trip Summary Metrics Cards (Prompt Section 3) */}
          <ItinerarySummaryCards
            estimatedCost={totalCost}
            activitiesCount={totalActivitiesCount}
            bookingsCount={totalBookingsCount}
            travelTimePerDay="2.4 hrs/day"
            planCompatibility={92}
          />

          {/* Confirmation Notice Toast Banner */}
          <AnimatePresence>
            {confirmationNotice && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 rounded-xl bg-emerald-50 border-2 border-emerald-300 text-emerald-950 text-xs flex items-center justify-between shadow-soft-sm"
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold block text-sm">{confirmationNotice.title}</span>
                    <span className="text-emerald-900">{confirmationNotice.message}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setConfirmationNotice(null)}
                  className="text-emerald-800 hover:text-emerald-950 font-bold p-1 rounded-md hover:bg-emerald-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 3. Navigation Tabs: [ Timeline ] [ Map ] [ Budget ] (Prompt Section 4) */}
          <div className="flex items-center justify-between gap-4 border-b border-sand-200 pb-2">
            <div className="flex items-center gap-2 bg-sand-100/80 p-1.5 rounded-2xl border border-sand-200">
              {[
                { id: 'timeline', label: 'Timeline', icon: Clock },
                { id: 'map', label: 'Map', icon: MapPin },
                { id: 'budget', label: 'Budget', icon: Wallet }
              ].map(tab => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-white text-charcoal-950 shadow-soft-xs border border-sand-200/80'
                        : 'text-charcoal-600 hover:text-charcoal-900 hover:bg-white/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-terracotta-600' : 'text-charcoal-400'}`} />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Quick Trip Booking Status Badge */}
            <div className="hidden sm:flex items-center gap-2">
              {isTripBooked ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Trip Confirmed & Synchronized</span>
                </span>
              ) : (
                <Button
                  size="sm"
                  onClick={() => {
                    bookTrip()
                    setConfirmationNotice({
                      title: "🎉 Trip Booked Successfully",
                      message: `Your trip to ${city} is now confirmed. All vouchers and bookings are live.`
                    })
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-soft-xs h-9 px-3.5"
                  leftIcon={<Check className="w-3.5 h-3.5" />}
                >
                  Confirm & Book Trip
                </Button>
              )}
            </div>
          </div>

          {/* Day Selector Pill Bar (visible in Timeline and Map views) */}
          {activeTab !== 'budget' && (
            <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1 scrollbar-none">
              <div className="flex items-center gap-2">
                {daysList.map((dObj) => {
                  const isActive = dObj.day === selectedDayNumber
                  return (
                    <button
                      key={dObj.day}
                      type="button"
                      onClick={() => setSelectedDayNumber(dObj.day)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-semibold shrink-0 transition-all ${
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
                        {dObj.date || `Day ${dObj.day}`}
                      </span>
                    </button>
                  )
                })}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => regenerateSingleDay(selectedDayNumber)}
                  className="text-xs bg-white text-charcoal-800 border-sand-300 hover:bg-sand-50"
                  leftIcon={<RefreshCw className="w-3.5 h-3.5 text-terracotta-600" />}
                >
                  Regenerate Day ✦
                </Button>
              </div>
            </div>
          )}

          {/* TAB 1: TIMELINE VIEW (Prompt Section 5, 6, 7, 8, 9, 14, 15, 18) */}
          {activeTab === 'timeline' && (
            <div className="space-y-6">
              
              {/* Day Focus Header Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-sand-200 shadow-soft-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold text-terracotta-600 uppercase tracking-wider block">
                    Day 0{currentDay.day} Intelligent Sequence
                  </span>
                  <h3 className="font-serif font-bold text-lg sm:text-xl text-charcoal-950 mt-0.5">
                    {currentDay.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Time → Activity → Location → Travel → Next Activity
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="success" size="sm">
                    Constraints Verified ✓
                  </Badge>
                </div>
              </div>

              {/* Dynamic Disruption Alert & AI Alternative Section (Day 2 Demo) */}
              {selectedDayNumber === 2 && !disruptedActivityResolved && (
                <DynamicDisruptionSection
                  onCompareOptions={() => setIsComparisonOpen(true)}
                  onSelectAlternative={(alt) => setImpactModalAlternative(alt)}
                />
              )}

              {/* Connected Vertical Timeline Track */}
              <div className="space-y-1 relative ml-2 sm:ml-4">
                {currentDay.items && currentDay.items.length > 0 ? (
                  currentDay.items.map((item, idx) => {
                    const isDisruptedWaterSports = item.id === "item-d2-watersports" && selectedDayNumber === 2 && !disruptedActivityResolved
                    if (isDisruptedWaterSports) return null

                    return (
                      <React.Fragment key={item.id || idx}>
                        {/* Connected Vertical Line + Activity Card */}
                        <div className="relative pl-10 sm:pl-14 py-2">
                          {/* Continuous Vertical Connecting Line */}
                          <div className="absolute left-[19px] sm:left-[27px] top-0 bottom-0 w-0.5 bg-sand-300" />
                          
                          {/* Activity Node Dot */}
                          <div className="absolute left-[13px] sm:left-[21px] top-7 w-3.5 h-3.5 rounded-full bg-white border-2 border-terracotta-600 shadow-xs z-10" />

                          {/* Rich Activity Card */}
                          <ItineraryActivityCard
                            item={item}
                            index={idx}
                            isSelected={highlightedMapStopId === item.id}
                            onViewDetails={(item) => setActiveItemDetailModal(item)}
                            onChangeTime={(item) => handleInitiateChangeTime(item)}
                            onReplaceActivity={(item) => setIsComparisonOpen(true)}
                            onRemoveActivity={(item) => removeItineraryItem(selectedDayNumber, item.id)}
                          />
                        </div>

                        {/* Prompt Section 15: Contextual AI Suggestion (Shown between Afternoon & Sunset on Day 1) */}
                        {selectedDayNumber === 1 && idx === 2 && isAiSuggestionVisible && (
                          <ItineraryContextualSuggestion
                            timeWindow="between 3 PM and 5 PM"
                            interests={tripPreferences?.interests?.length > 0 ? tripPreferences.interests.slice(0, 2) : ["Beach", "Photography"]}
                            onAdd={handleAddAiSuggestion}
                            onIgnore={() => setIsAiSuggestionVisible(false)}
                          />
                        )}

                        {/* Transit Connector between consecutive activities */}
                        {idx < currentDay.items.length - 1 && (
                          <ItineraryTransitNode
                            durationMinutes={idx === 0 ? 35 : idx === 1 ? 15 : 20}
                            mode={idx === 0 ? "Cab" : "Private Sedan"}
                            distanceKm={idx === 0 ? 14 : idx === 1 ? 6 : 8}
                          />
                        )}
                      </React.Fragment>
                    )
                  })
                ) : (
                  <div className="p-8 text-center bg-white rounded-2xl border border-sand-200">
                    <p className="text-sm text-charcoal-600 font-medium">No items scheduled for Day {selectedDayNumber}.</p>
                    <Button
                      size="sm"
                      onClick={() => regenerateSingleDay(selectedDayNumber)}
                      className="mt-3 bg-terracotta-600 text-white"
                    >
                      Generate Day Schedule
                    </Button>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 2: MAP VIEW (Prompt Section 4 & 16) */}
          {activeTab === 'map' && (
            <ItineraryMapView
              dayItems={currentDay.items || []}
              dayTitle={currentDay.title}
              dayNumber={selectedDayNumber}
              city={city}
              selectedItemId={highlightedMapStopId}
              onSelectStop={(stop) => setHighlightedMapStopId(stop.id)}
            />
          )}

          {/* TAB 3: BUDGET VIEW (Prompt Section 4 & 17) */}
          {activeTab === 'budget' && (
            <ItineraryBudgetView
              totalEstimatedCost={totalCost}
              targetBudget={targetBudget}
              breakdown={budgetBreakdown}
              proposedChange={{
                active: true,
                activityTitle: activeAlternativeApplied?.title || "Scuba Diving Alternative",
                currentCost: 29450,
                afterCost: totalCost,
                difference: activeAlternativeApplied?.priceDiff || 500
              }}
            />
          )}

        </div>

        {/* MODAL 1: Activity Detail Dialog with Explainable 'Why we selected this' (Section 7) */}
        <ActivityDetailModal
          isOpen={Boolean(activeItemDetailModal)}
          onClose={() => setActiveItemDetailModal(null)}
          item={activeItemDetailModal}
          dayNumber={selectedDayNumber}
          totalBudget={targetBudget}
          onChangeTimeClick={(item) => handleInitiateChangeTime(item)}
          onRemoveItem={removeItineraryItem}
        />

        {/* MODAL 2: Compare Alternative Options Matrix (Section 10) */}
        <AlternativeComparisonModal
          isOpen={isComparisonOpen}
          onClose={() => setIsComparisonOpen(false)}
          alternatives={alternativesList}
          onSelectOption={(option) => {
            setIsComparisonOpen(false)
            setImpactModalAlternative(option)
          }}
        />

        {/* MODAL 3: Impact Analysis Modal before applying change (Section 11) */}
        <ImpactAnalysisModal
          isOpen={Boolean(impactModalAlternative)}
          onClose={() => setImpactModalAlternative(null)}
          originalActivity="Water Sports & Jet Ski Safari"
          selectedAlternative={impactModalAlternative}
          currentTripCost={totalCost}
          onApplyChange={handleApplyAlternativeChange}
        />

        {/* MODAL 4: ✨ Optimize My Day (Section 12) */}
        <OptimizeDayModal
          isOpen={isOptimizeOpen}
          onClose={() => setIsOptimizeOpen(false)}
          dayNumber={selectedDayNumber}
          onApplyOptimization={handleApplyOptimization}
        />

        {/* MODAL 5: What-If Simulation (Section 13) */}
        <WhatIfSimulationModal
          isOpen={isWhatIfOpen}
          onClose={() => setIsWhatIfOpen(false)}
          currentTripCost={totalCost}
          currentHotelCost={10000}
          currentCompatibility={92}
          onApplySimulation={handleApplyWhatIf}
        />

        {/* MODAL 6: Interactive Schedule Conflict Warning (Section 14) */}
        <ScheduleConflictModal
          isOpen={Boolean(scheduleConflictData)}
          onClose={() => setScheduleConflictData(null)}
          activityTitle={scheduleConflictData?.activityTitle}
          requestedTime={scheduleConflictData?.requestedTime}
          conflictingActivity={scheduleConflictData?.conflictingActivity}
          onResolveMoveDownstream={handleResolveConflictMoveDownstream}
          onResolveAdjustTime={handleResolveConflictKeepTime}
        />

      </div>
    </PageTransition>
  )
}

export default Itinerary
