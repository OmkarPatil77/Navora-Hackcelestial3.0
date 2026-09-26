import { goaExperiences } from '../data/experiences.js'
import { minutesToTime, timeToMinutes, shiftTime } from './disruptionEngine.js'

/**
 * Validates whether a proposed recovery plan meets all integrity constraints
 */
export function validateRecoveryPlan(plan, itinerary) {
  if (!plan || !plan.id || !plan.modifiedItems) {
    return { valid: false, errors: ['Plan data structure is invalid'] }
  }

  const errors = []

  // 1. Check for time overlaps among modified/preserved items
  const sortedItems = [...plan.modifiedItems].sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime))
  for (let i = 0; i < sortedItems.length - 1; i++) {
    const current = sortedItems[i]
    const next = sortedItems[i + 1]
    const currentEnd = timeToMinutes(current.endTime)
    const nextStart = timeToMinutes(next.startTime)

    if (currentEnd > nextStart) {
      errors.push(`Overlap detected between "${current.title}" (ends ${current.endTime}) and "${next.title}" (starts ${next.startTime})`)
    }
  }

  // 2. Ensure protected fixed nodes remain present
  if (itinerary?.days?.[0]) {
    const originalDay1 = itinerary.days[0]
    const flightPresent = plan.modifiedItems.some(i => i.type === 'flight')
    if (!flightPresent) {
      errors.push('Inbound flight transit node is missing')
    }
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Generates 3 intelligent recovery options based on impact analysis and preferences
 */
export function generateRecoveryPlans(itinerary, impactAnalysis, tripPreferences = {}, selectedExperiences = []) {
  if (!itinerary || !impactAnalysis) return []

  const day1 = itinerary.days?.find(d => d.day === 1) || itinerary.days?.[0]
  if (!day1) return []

  const delayMins = impactAnalysis.disruption?.delayMinutes || 90
  const conflictNode = impactAnalysis.conflictNodes?.[0] || impactAnalysis.impactedNodes?.find(i => i.type === 'experience')
  const originalItems = day1.items || []

  // Find candidate replacement experience (e.g., Fontainhas Heritage Walk)
  const fontainhasExp = goaExperiences.find(e => e.id === 'goa-fontainhas-heritage-walk') || {
    id: "goa-fontainhas-heritage-walk",
    title: "Fontainhas Latin Quarter Heritage & Culinary Walk",
    pricePerPerson: 1600,
    durationHours: 2.5,
    location: "Panjim, North Goa",
    intensity: "low"
  }

  const origExpCost = conflictNode ? (selectedExperiences.find(e => e.id === conflictNode.nodeId)?.pricePerPerson || 2800) : 2800
  const replacementCost = fontainhasExp.pricePerPerson || 1600
  const costDiff = origExpCost - replacementCost // e.g. 2800 - 1600 = 1200

  // --------------------------------------------------------------------------
  // PLAN A — PRESERVE: Preserve Your Experiences (Compact schedule, shift windows)
  // --------------------------------------------------------------------------
  const planA_items = [
    {
      id: "item-d1-flight",
      type: "flight",
      title: "Inbound Flight: Mumbai (BOM) → Goa (GOI)",
      startTime: impactAnalysis.disruption.newStartTime,
      endTime: impactAnalysis.disruption.newEndTime,
      location: "Dabolim International Terminal"
    },
    {
      id: "item-d1-arr-transfer",
      type: "transport",
      title: "Private Airport Cab Transfer (Expedited)",
      startTime: "12:15",
      endTime: "13:00",
      durationMinutes: 45,
      location: "Dabolim → Panjim"
    },
    {
      id: "item-d1-checkin",
      type: "hotel",
      title: "Express Check-in @ Heritage Villa",
      startTime: "13:00",
      endTime: "13:30",
      durationMinutes: 30,
      location: "Panjim Waterfront Villa"
    },
    {
      id: "item-d1-lunch",
      type: "meal",
      title: "Express Coastal Welcome Lunch",
      startTime: "13:30",
      endTime: "14:15",
      durationMinutes: 45,
      location: "Fontainhas, Panjim"
    },
    {
      id: "item-d1-exp-1",
      type: "experience",
      experienceId: "goa-scuba-grand-island",
      title: "Grand Island Scuba (Express Afternoon Slot)",
      startTime: "14:30",
      endTime: "18:00",
      durationMinutes: 210,
      cost: origExpCost,
      pricePerPerson: origExpCost,
      intensity: "high",
      location: "Grande Island, South Goa"
    },
    {
      id: "item-d1-sunset",
      type: "experience",
      experienceId: "goa-mandovi-sunset-cruise",
      title: "Mandovi River Luxury Catamaran Sunset Cruise",
      startTime: "18:30",
      endTime: "20:00",
      durationMinutes: 90,
      cost: 1800,
      pricePerPerson: 1800,
      location: "Mandovi River Jetty, Panjim"
    },
    {
      id: "item-d1-dinner",
      type: "meal",
      title: "Candlelight Riverside Dinner @ Fisherman's Wharf",
      startTime: "20:15",
      endTime: "22:15",
      durationMinutes: 120,
      location: "Fisherman's Wharf, Panjim"
    }
  ]

  const planA = {
    id: "PLAN-A-PRESERVE",
    strategy: "PRESERVE",
    badge: "Maximum Activities",
    title: "Preserve All Experiences",
    subtitle: "Compress buffer windows to keep the original Grand Island dive expedition.",
    description: "Shifts your transfers and converts welcome lunch into an express seaside meal so you can still attend Scuba Diving without missing dinner.",
    experiencesPreserved: "5 of 5",
    flexibilityImpact: "42 min remaining",
    flexibilityDelta: -30,
    costImpact: "₹0 extra cost",
    costDelta: 0,
    intensity: "High Pace",
    tags: ["No Lost Bookings", "Express Transitions", "Full Itinerary"],
    modifiedItems: planA_items,
    changes: [
      { type: "SHIFT", text: `Inbound flight shifted +${delayMins}m to ${impactAnalysis.disruption.newStartTime} arrival.` },
      { type: "SHIFT", text: "Airport transfer & check-in delayed to 12:15 → 13:30." },
      { type: "COMPRESS", text: "Lunch shortened to 45m express meal." },
      { type: "PRESERVED", text: "Scuba dive rescheduled to compact 14:30 – 18:00 window." },
      { type: "PROTECTED", text: "Dinner reservation shifted to 20:15." }
    ],
    recommended: false
  }

  // --------------------------------------------------------------------------
  // PLAN B — BALANCED (RECOMMENDED): Rebalance the Day with Cultural Replacement
  // --------------------------------------------------------------------------
  const planB_items = [
    {
      id: "item-d1-flight",
      type: "flight",
      title: "Inbound Flight: Mumbai (BOM) → Goa (GOI)",
      startTime: impactAnalysis.disruption.newStartTime,
      endTime: impactAnalysis.disruption.newEndTime,
      location: "Dabolim International Terminal"
    },
    {
      id: "item-d1-arr-transfer",
      type: "transport",
      title: "Private Airport Cab Transfer to Villa",
      startTime: "12:15",
      endTime: "13:10",
      durationMinutes: 55,
      location: "Dabolim → Panjim"
    },
    {
      id: "item-d1-checkin",
      type: "hotel",
      title: "Check-in & Villa Unpacking @ Heritage Villa",
      startTime: "13:15",
      endTime: "14:00",
      durationMinutes: 45,
      location: "Panjim Waterfront Villa"
    },
    {
      id: "item-d1-lunch",
      type: "meal",
      title: "Authentic Coastal Welcome Lunch @ Kokum Club",
      startTime: "14:00",
      endTime: "15:30",
      durationMinutes: 90,
      location: "Fontainhas, Panjim"
    },
    {
      id: "goa-fontainhas-heritage-walk",
      type: "experience",
      experienceId: "goa-fontainhas-heritage-walk",
      title: "Fontainhas Latin Quarter Heritage & Culinary Walk",
      category: "Food",
      cost: 1600,
      pricePerPerson: 1600,
      startTime: "16:00",
      endTime: "18:30",
      durationMinutes: 150,
      location: "Panjim, North Goa",
      intensity: "low",
      notes: "Seamless late afternoon stroll with zero rush and feni tasting."
    },
    {
      id: "item-d1-sunset",
      type: "experience",
      experienceId: "goa-mandovi-sunset-cruise",
      title: "Mandovi River Luxury Catamaran Sunset Cruise",
      startTime: "18:45",
      endTime: "20:15",
      durationMinutes: 90,
      cost: 1800,
      pricePerPerson: 1800,
      location: "Mandovi River Jetty, Panjim"
    },
    {
      id: "item-d1-dinner",
      type: "meal",
      title: "Candlelight Riverside Dinner @ Fisherman's Wharf",
      startTime: "20:30",
      endTime: "22:30",
      durationMinutes: 120,
      location: "Fisherman's Wharf, Panjim"
    }
  ]

  const planB = {
    id: "PLAN-B-BALANCED",
    strategy: "BALANCED",
    badge: "Recommended",
    title: "Rebalance the Afternoon",
    subtitle: "Swap high-intensity scuba for the relaxed Fontainhas Heritage Walk.",
    description: "Eliminates time pressure. Enjoy a relaxed seafood lunch, explore historic Latin Quarters, and save budget while protecting your evening sunset.",
    experiencesPreserved: "5 of 5 experiences",
    flexibilityImpact: "+45 min flexibility buffer",
    flexibilityDelta: 45,
    costImpact: `₹${costDiff.toLocaleString('en-IN')} saved`,
    costDelta: -costDiff,
    intensity: "Comfortable Pace",
    tags: ["Recommended", "Budget Saving", "Stress-Free", "Zero Conflict"],
    modifiedItems: planB_items,
    changes: [
      { type: "REPLACE", text: "Replace 4.5h Scuba Dive with 2.5h Fontainhas Latin Quarter Walk (16:00 – 18:30)." },
      { type: "SAVING", text: `Saves ₹${costDiff.toLocaleString('en-IN')} on activity admissions.` },
      { type: "BUFFER", text: "Expands lunch & check-in relaxation window by +45 minutes." },
      { type: "PROTECTED", text: "Guarantees on-time arrival for Mandovi evening dinner." }
    ],
    recommended: true
  }

  // --------------------------------------------------------------------------
  // PLAN C — RELAXED: Protect Your Journey (Drop high intensity, rest at hotel)
  // --------------------------------------------------------------------------
  const planC_items = [
    {
      id: "item-d1-flight",
      type: "flight",
      title: "Inbound Flight: Mumbai (BOM) → Goa (GOI)",
      startTime: impactAnalysis.disruption.newStartTime,
      endTime: impactAnalysis.disruption.newEndTime,
      location: "Dabolim International Terminal"
    },
    {
      id: "item-d1-arr-transfer",
      type: "transport",
      title: "Private Airport Cab Transfer to Villa",
      startTime: "12:15",
      endTime: "13:10",
      durationMinutes: 55,
      location: "Dabolim → Panjim"
    },
    {
      id: "item-d1-checkin",
      type: "hotel",
      title: "Resort Check-In & Beach Villa Unwinding",
      startTime: "13:15",
      endTime: "14:15",
      durationMinutes: 60,
      location: "Panjim Waterfront Villa"
    },
    {
      id: "item-d1-lunch",
      type: "meal",
      title: "Leisurely Poolside Lunch & Refreshments",
      startTime: "14:15",
      endTime: "15:30",
      durationMinutes: 75,
      location: "Poolside Terrace"
    },
    {
      id: "item-d1-rest-buffer",
      type: "buffer",
      title: "Rest & Sunset Beach Walk Buffer",
      startTime: "15:30",
      endTime: "18:30",
      durationMinutes: 180,
      location: "Villa Beachfront"
    },
    {
      id: "item-d1-sunset",
      type: "experience",
      experienceId: "goa-mandovi-sunset-cruise",
      title: "Mandovi River Luxury Catamaran Sunset Cruise",
      startTime: "18:45",
      endTime: "20:15",
      durationMinutes: 90,
      cost: 1800,
      pricePerPerson: 1800,
      location: "Mandovi River Jetty, Panjim"
    },
    {
      id: "item-d1-dinner",
      type: "meal",
      title: "Candlelight Riverside Dinner @ Fisherman's Wharf",
      startTime: "20:30",
      endTime: "22:30",
      durationMinutes: 120,
      location: "Fisherman's Wharf, Panjim"
    }
  ]

  const planC = {
    id: "PLAN-C-RELAXED",
    strategy: "RELAXED",
    badge: "Maximum Relaxation",
    title: "Protect Journey & Rest",
    subtitle: "Drop strenuous afternoon activity, prioritize villa rest, and maximize savings.",
    description: "Removes afternoon dive fatigue. Check in with zero rush, enjoy the resort pool, and keep full energy for dinner and Day 2.",
    experiencesPreserved: "4 of 5 activities",
    flexibilityImpact: "+90 min flexibility buffer",
    flexibilityDelta: 90,
    costImpact: `₹${origExpCost.toLocaleString('en-IN')} saved`,
    costDelta: -origExpCost,
    intensity: "Leisure Pace",
    tags: ["Max Buffer", "Zero Fatigue", "Resort Time"],
    modifiedItems: planC_items,
    changes: [
      { type: "REMOVE", text: "Remove Scuba Diving expedition to eliminate afternoon transit fatigue." },
      { type: "SAVING", text: `Saves full ₹${origExpCost.toLocaleString('en-IN')} activity cost.` },
      { type: "BUFFER", text: "Unlocks +90 min leisure pool and resort unwinding window." },
      { type: "PROTECTED", text: "Evening dinner and sunset walk 100% safeguarded." }
    ],
    recommended: false
  }

  // Validate all plans before returning
  const plans = [planB, planA, planC]
  return plans.map(p => ({
    ...p,
    validation: validateRecoveryPlan(p, itinerary)
  }))
}

/**
 * Applies a selected recovery plan to the master itinerary
 */
export function applyRecoveryPlanToItinerary(itinerary, recoveryPlan) {
  if (!itinerary || !recoveryPlan || !recoveryPlan.modifiedItems) {
    return itinerary
  }

  const updatedDays = itinerary.days.map(day => {
    if (day.day === 1) {
      return {
        ...day,
        items: recoveryPlan.modifiedItems,
        theme: `${day.theme || 'Arrival & Coastal Welcome'} (Adapted)`
      }
    }
    return day
  })

  return {
    ...itinerary,
    days: updatedDays,
    lastModified: new Date().toISOString(),
    adaptedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    adaptationSummary: recoveryPlan.title
  }
}
