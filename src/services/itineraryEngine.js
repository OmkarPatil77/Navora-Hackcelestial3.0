import { goaExperiences } from '@/data/experiences'

/**
 * Calculates geographic distance (in kilometers) between two coordinates
 */
export function calculateDistanceKm(coord1, coord2) {
  if (!coord1?.lat || !coord1?.lng || !coord2?.lat || !coord2?.lng) return 12.0
  const R = 6371 // Earth's radius in km
  const dLat = (coord2.lat - coord1.lat) * (Math.PI / 180)
  const dLng = (coord2.lng - coord1.lng) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(coord1.lat * (Math.PI / 180)) *
      Math.cos(coord2.lat * (Math.PI / 180)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(R * c * 10) / 10
}

/**
 * Estimates transfer duration (minutes) and private transit cost
 */
export function estimateTransfer(fromCoord, toCoord, fromName, toName) {
  const distKm = calculateDistanceKm(fromCoord, toCoord)
  // Average coastal speed ~30 km/h + 10 min buffer
  const durationMinutes = Math.max(20, Math.round((distKm / 30) * 60 + 10))
  // Approx ₹30/km base cab fare with min ₹400
  const cost = Math.max(450, Math.round(distKm * 28 + 250))

  return {
    distKm,
    durationMinutes,
    cost,
    title: `Transfer: ${fromName || 'Origin'} → ${toName || 'Destination'}`,
    description: `Private AC sedan transfer via coastal highway (${distKm} km • ~${durationMinutes} min)`
  }
}

/**
 * Generates a normalized day-by-day connected itinerary graph from preferences & staged experiences
 */
export function generateItinerary(tripPreferences, selectedExperiences = []) {
  const daysCount = tripPreferences?.duration?.days || 4
  const adultCount = Math.max(1, tripPreferences?.travelers?.adults || 2)
  const baseBudget = tripPreferences?.budget?.total || 35000
  const destName = tripPreferences?.destination?.city || "Goa"

  // Resolve experience objects
  const stagedExperiences = selectedExperiences.map(sel => {
    const found = goaExperiences.find(e => e.id === sel.experienceId || e.id === sel.id)
    return found || goaExperiences[0]
  })

  // Fallback pool if traveler selected few items
  const fallbackPool = goaExperiences.filter(exp => 
    !stagedExperiences.some(s => s.id === exp.id)
  )

  // Combined pool of experiences to place
  const pool = [...stagedExperiences, ...fallbackPool]

  // Default Hotel Node for Goa
  const defaultHotel = {
    name: "Heritage Boutique Villa & Resort",
    location: "Panjim Riverside / Candolim",
    coordinates: { lat: 15.501, lng: 73.815 },
    costPerNight: Math.round((baseBudget * 0.35) / Math.max(1, daysCount - 1) / 2) // Per room approx
  }

  const airportCoord = { lat: 15.38, lng: 73.83 } // Dabolim Airport

  const days = []
  let experiencePointer = 0

  for (let d = 1; d <= daysCount; d++) {
    const isFirstDay = d === 1
    const isLastDay = d === daysCount
    const items = []

    let dayTitle = "Coastal Discovery"
    let dayTheme = "Exploration"

    if (isFirstDay) {
      dayTitle = "Arrival & Latin Quarter Sunset"
      dayTheme = "Arrival"

      // 1. Flight Node
      const flightId = `item-d${d}-flight`
      const transferArrId = `item-d${d}-arr-transfer`
      const checkinId = `item-d${d}-checkin`
      const lunchId = `item-d${d}-lunch`
      const exp1Id = `item-d${d}-exp-sunset`
      const dinnerId = `item-d${d}-dinner`

      items.push({
        id: flightId,
        type: "flight",
        title: "Inbound Flight: Mumbai (BOM) → Goa (GOI)",
        startTime: "09:20",
        endTime: "10:35",
        location: "Dabolim International Terminal",
        durationMinutes: 75,
        cost: 4200 * adultCount,
        status: "confirmed",
        movable: false,
        critical: true,
        intensity: "low",
        coordinates: airportCoord,
        dependencies: [],
        downstream: [transferArrId, checkinId]
      })

      // 2. Airport Transfer
      const transferEstimate = estimateTransfer(airportCoord, defaultHotel.coordinates, "Airport", "Villa")
      items.push({
        id: transferArrId,
        type: "transport",
        title: "Airport Transfer to Boutique Villa",
        startTime: "11:00",
        endTime: "11:55",
        location: "Goa Airport → Panjim Riverside",
        durationMinutes: 55,
        cost: transferEstimate.cost,
        status: "confirmed",
        movable: true,
        critical: true,
        intensity: "low",
        coordinates: defaultHotel.coordinates,
        dependencies: [flightId],
        downstream: [checkinId]
      })

      // 3. Hotel Check-in
      items.push({
        id: checkinId,
        type: "hotel",
        title: `Check-in at ${defaultHotel.name}`,
        startTime: "12:15",
        endTime: "13:00",
        location: defaultHotel.location,
        durationMinutes: 45,
        cost: 0,
        status: "confirmed",
        movable: false,
        critical: true,
        intensity: "low",
        coordinates: defaultHotel.coordinates,
        dependencies: [transferArrId],
        downstream: [lunchId, exp1Id]
      })

      // 4. Welcome Lunch
      items.push({
        id: lunchId,
        type: "meal",
        title: "Welcome Traditional Goan Lunch",
        startTime: "13:15",
        endTime: "14:30",
        location: "Panjim Heritage Bistro",
        durationMinutes: 75,
        cost: 650 * adultCount,
        status: "scheduled",
        movable: true,
        critical: false,
        intensity: "low",
        coordinates: { lat: 15.498, lng: 73.827 },
        dependencies: [checkinId],
        downstream: [exp1Id]
      })

      // 5. Buffer
      items.push({
        id: `item-d${d}-buffer-1`,
        type: "buffer",
        title: "Flexibility & Rest Buffer",
        startTime: "14:30",
        endTime: "15:30",
        location: "Hotel Grounds",
        durationMinutes: 60,
        cost: 0,
        status: "scheduled",
        movable: true,
        critical: false,
        intensity: "none",
        dependencies: [lunchId],
        downstream: [exp1Id]
      })

      // 6. Day 1 Sunset Experience (Pulls from pool)
      const day1Exp = pool[experiencePointer++] || goaExperiences[1]
      items.push({
        id: exp1Id,
        type: "experience",
        title: day1Exp.title,
        startTime: "16:00",
        endTime: "18:45",
        location: day1Exp.location,
        durationMinutes: Math.round(day1Exp.durationHours * 60),
        cost: day1Exp.pricePerPerson * adultCount,
        status: "scheduled",
        movable: true,
        critical: false,
        intensity: day1Exp.intensity || "medium",
        category: day1Exp.category,
        image: day1Exp.image,
        coordinates: day1Exp.coordinates,
        dependencies: [checkinId],
        downstream: [dinnerId]
      })

      // 7. Dinner
      items.push({
        id: dinnerId,
        type: "meal",
        title: "Riverside Candlelight Dinner",
        startTime: "19:45",
        endTime: "21:30",
        location: "Viva Panjim / Waterfront",
        durationMinutes: 105,
        cost: 900 * adultCount,
        status: "scheduled",
        movable: true,
        critical: false,
        intensity: "low",
        coordinates: { lat: 15.498, lng: 73.827 },
        dependencies: [exp1Id],
        downstream: []
      })

    } else if (isLastDay) {
      dayTitle = "Heritage Souvenirs & Departure"
      dayTheme = "Departure"

      const bfastId = `item-d${d}-bfast`
      const expMorningId = `item-d${d}-exp-morning`
      const checkoutId = `item-d${d}-checkout`
      const lunchId = `item-d${d}-lunch`
      const transferDepId = `item-d${d}-dep-transfer`
      const flightOutId = `item-d${d}-flight-out`

      // 1. Breakfast
      items.push({
        id: bfastId,
        type: "meal",
        title: "Villa Buffet Breakfast",
        startTime: "08:30",
        endTime: "09:45",
        location: defaultHotel.name,
        durationMinutes: 75,
        cost: 350 * adultCount,
        status: "scheduled",
        movable: true,
        critical: false,
        intensity: "low",
        coordinates: defaultHotel.coordinates,
        dependencies: [],
        downstream: [expMorningId]
      })

      // 2. Morning Souvenirs / Light Experience
      const lastDayExp = pool[experiencePointer++] || goaExperiences[9]
      items.push({
        id: expMorningId,
        type: "experience",
        title: lastDayExp.title,
        startTime: "10:00",
        endTime: "12:00",
        location: lastDayExp.location,
        durationMinutes: 120,
        cost: lastDayExp.pricePerPerson * adultCount,
        status: "scheduled",
        movable: true,
        critical: false,
        intensity: "low",
        category: lastDayExp.category,
        image: lastDayExp.image,
        coordinates: lastDayExp.coordinates,
        dependencies: [bfastId],
        downstream: [checkoutId]
      })

      // 3. Checkout
      items.push({
        id: checkoutId,
        type: "hotel",
        title: `Check-out from ${defaultHotel.name}`,
        startTime: "12:15",
        endTime: "12:45",
        location: defaultHotel.location,
        durationMinutes: 30,
        cost: 0,
        status: "confirmed",
        movable: false,
        critical: true,
        intensity: "low",
        coordinates: defaultHotel.coordinates,
        dependencies: [expMorningId],
        downstream: [lunchId, transferDepId]
      })

      // 4. Farewell Lunch
      items.push({
        id: lunchId,
        type: "meal",
        title: "Coastal Farewell Seafood Lunch",
        startTime: "13:00",
        endTime: "14:15",
        location: "Panjim Bistro",
        durationMinutes: 75,
        cost: 700 * adultCount,
        status: "scheduled",
        movable: true,
        critical: false,
        intensity: "low",
        coordinates: defaultHotel.coordinates,
        dependencies: [checkoutId],
        downstream: [transferDepId]
      })

      // 5. Transfer to Airport
      const transferOutEstimate = estimateTransfer(defaultHotel.coordinates, airportCoord, "Villa", "Airport")
      items.push({
        id: transferDepId,
        type: "transport",
        title: "Airport Drop Transfer",
        startTime: "14:45",
        endTime: "15:40",
        location: "Hotel → Goa International Airport",
        durationMinutes: 55,
        cost: transferOutEstimate.cost,
        status: "confirmed",
        movable: false,
        critical: true,
        intensity: "low",
        coordinates: airportCoord,
        dependencies: [checkoutId, lunchId],
        downstream: [flightOutId]
      })

      // 6. Outbound Flight
      items.push({
        id: flightOutId,
        type: "flight",
        title: "Outbound Flight: Goa (GOI) → Mumbai (BOM)",
        startTime: "17:15",
        endTime: "18:30",
        location: "Dabolim International Terminal",
        durationMinutes: 75,
        cost: 4100 * adultCount,
        status: "confirmed",
        movable: false,
        critical: true,
        intensity: "low",
        coordinates: airportCoord,
        dependencies: [transferDepId],
        downstream: []
      })

    } else {
      // Mid-trip Days (Adventure / Culture / Experiences)
      dayTitle = d === 2 ? "Adventure & Coastal Waters" : "Culture, Spice & Heritage Trail"
      dayTheme = d === 2 ? "Adventure" : "Culture"

      const bfastId = `item-d${d}-bfast`
      const expMorningId = `item-d${d}-exp-morning`
      const lunchId = `item-d${d}-lunch`
      const bufferMidId = `item-d${d}-buffer-mid`
      const expEveningId = `item-d${d}-exp-evening`
      const dinnerId = `item-d${d}-dinner`

      // 1. Breakfast
      items.push({
        id: bfastId,
        type: "meal",
        title: "Tropical Villa Breakfast",
        startTime: "08:00",
        endTime: "09:00",
        location: defaultHotel.name,
        durationMinutes: 60,
        cost: 350 * adultCount,
        status: "scheduled",
        movable: true,
        critical: false,
        intensity: "low",
        coordinates: defaultHotel.coordinates,
        dependencies: [],
        downstream: [expMorningId]
      })

      // 2. Morning Experience
      const morningExp = pool[experiencePointer++] || goaExperiences[0]
      items.push({
        id: expMorningId,
        type: "experience",
        title: morningExp.title,
        startTime: "09:30",
        endTime: "13:00",
        location: morningExp.location,
        durationMinutes: Math.min(210, Math.round(morningExp.durationHours * 60)),
        cost: morningExp.pricePerPerson * adultCount,
        status: "scheduled",
        movable: true,
        critical: false,
        intensity: morningExp.intensity || "high",
        category: morningExp.category,
        image: morningExp.image,
        coordinates: morningExp.coordinates,
        dependencies: [bfastId],
        downstream: [lunchId]
      })

      // 3. Lunch
      items.push({
        id: lunchId,
        type: "meal",
        title: "Artisan Lunch & Coconut Drinks",
        startTime: "13:15",
        endTime: "14:30",
        location: "Beachside Shacks / Garden Bistro",
        durationMinutes: 75,
        cost: 600 * adultCount,
        status: "scheduled",
        movable: true,
        critical: false,
        intensity: "low",
        coordinates: morningExp.coordinates || defaultHotel.coordinates,
        dependencies: [expMorningId],
        downstream: [bufferMidId]
      })

      // 4. Free time / Buffer (30 - 60 min)
      items.push({
        id: bufferMidId,
        type: "buffer",
        title: "Downtime & Route Flexibility Buffer",
        startTime: "14:30",
        endTime: "15:45",
        location: "Relaxation Zone / Hotel Poolside",
        durationMinutes: 75,
        cost: 0,
        status: "scheduled",
        movable: true,
        critical: false,
        intensity: "none",
        dependencies: [lunchId],
        downstream: [expEveningId]
      })

      // 5. Afternoon / Sunset Experience
      const eveningExp = pool[experiencePointer++] || goaExperiences[2]
      items.push({
        id: expEveningId,
        type: "experience",
        title: eveningExp.title,
        startTime: "16:15",
        endTime: "18:45",
        location: eveningExp.location,
        durationMinutes: Math.min(150, Math.round(eveningExp.durationHours * 60)),
        cost: eveningExp.pricePerPerson * adultCount,
        status: "scheduled",
        movable: true,
        critical: false,
        intensity: eveningExp.intensity || "low",
        category: eveningExp.category,
        image: eveningExp.image,
        coordinates: eveningExp.coordinates,
        dependencies: [bufferMidId],
        downstream: [dinnerId]
      })

      // 6. Dinner
      items.push({
        id: dinnerId,
        type: "meal",
        title: "Chef's Curated Goan Dinner",
        startTime: "19:45",
        endTime: "21:45",
        location: "Cliffside / Latin Quarter",
        durationMinutes: 120,
        cost: 850 * adultCount,
        status: "scheduled",
        movable: true,
        critical: false,
        intensity: "low",
        coordinates: eveningExp.coordinates || defaultHotel.coordinates,
        dependencies: [expEveningId],
        downstream: []
      })
    }

    days.push({
      day: d,
      date: calculateDayDate(tripPreferences?.startDate || "2026-10-12", d - 1),
      title: dayTitle,
      theme: dayTheme,
      status: "Optimized",
      items
    })
  }

  const summary = calculateItinerarySummary(days, baseBudget)
  const flexibility = calculateFlexibilityScore(days)

  return {
    tripId: "TS-GOA-108",
    destination: destName,
    daysCount,
    days,
    summary,
    flexibility
  }
}

/**
 * Computes calendar date for a given day offset
 */
function calculateDayDate(startStr, offsetDays) {
  try {
    const d = new Date(startStr)
    d.setDate(d.getDate() + offsetDays)
    const options = { day: 'numeric', month: 'short', year: 'numeric' }
    return d.toLocaleDateString('en-GB', options)
  } catch (e) {
    return `Day ${offsetDays + 1}`
  }
}

/**
 * Calculates budget summaries across all days and nodes
 */
export function calculateItinerarySummary(days = [], totalBudget = 35000) {
  let activityCost = 0
  let transportCost = 0
  let flightCost = 0
  let mealCost = 0
  let experienceCount = 0
  let transferCount = 0

  days.forEach(day => {
    day.items?.forEach(item => {
      const c = Number(item.cost) || 0
      if (item.type === "experience") {
        activityCost += c
        experienceCount++
      } else if (item.type === "transport") {
        transportCost += c
        transferCount++
      } else if (item.type === "flight") {
        flightCost += c
      } else if (item.type === "meal") {
        mealCost += c
      }
    })
  })

  // Estimated boutique accommodation for (days - 1) nights
  const nights = Math.max(1, days.length - 1)
  const accommodationCost = Math.round(totalBudget * 0.35)

  const totalCost = activityCost + transportCost + flightCost + mealCost + accommodationCost
  const remainingBudget = Math.max(0, totalBudget - totalCost)
  const isOverBudget = totalCost > totalBudget
  const budgetDelta = Math.abs(totalCost - totalBudget)

  return {
    totalCost,
    totalBudget,
    remainingBudget,
    isOverBudget,
    budgetDelta,
    breakdown: {
      activities: activityCost,
      accommodation: accommodationCost,
      transport: transportCost + flightCost,
      flights: flightCost,
      meals: mealCost,
      estimatedBuffer: remainingBudget
    },
    metrics: {
      experienceCount,
      transferCount,
      totalDays: days.length
    }
  }
}

/**
 * Calculates Journey Flexibility Score based on buffers and movable items
 */
export function calculateFlexibilityScore(days = []) {
  let totalItems = 0
  let movableItems = 0
  let bufferMinutes = 0

  days.forEach(day => {
    day.items?.forEach(item => {
      totalItems++
      if (item.movable) movableItems++
      if (item.type === "buffer") bufferMinutes += (item.durationMinutes || 0)
    })
  })

  const movableRatio = totalItems > 0 ? (movableItems / totalItems) : 0.7
  const bufferScore = Math.min(30, Math.round((bufferMinutes / 180) * 30))
  const flexibilityPercentage = Math.min(94, Math.max(55, Math.round(movableRatio * 65 + bufferScore)))

  const hours = Math.floor(bufferMinutes / 60)
  const mins = bufferMinutes % 60
  const bufferFormatted = hours > 0 ? `${hours}h ${mins > 0 ? mins + 'm' : ''}` : `${mins}m`

  return {
    percentage: flexibilityPercentage,
    rating: flexibilityPercentage >= 75 ? "High Flexibility" : "Moderate Flexibility",
    totalBufferMinutes: bufferMinutes,
    bufferFormatted,
    movableCount: movableItems,
    fixedCount: totalItems - movableItems
  }
}

/**
 * Builds the Itinerary Directed Dependency Graph for anomaly propagation
 */
export function buildItineraryGraph(itinerary) {
  const nodes = []
  const edges = []

  itinerary?.days?.forEach(day => {
    day.items?.forEach(item => {
      nodes.push({
        id: item.id,
        day: day.day,
        type: item.type,
        title: item.title,
        startTime: item.startTime,
        endTime: item.endTime,
        location: item.location,
        critical: item.critical,
        movable: item.movable
      })

      // Construct directional edges from dependencies
      if (item.dependencies && item.dependencies.length > 0) {
        item.dependencies.forEach(depId => {
          edges.push({
            from: depId,
            to: item.id,
            dependencyType: item.type === "transport" ? "arrival_trigger" : "schedule_sequence"
          })
        })
      }
    })
  })

  return {
    nodes,
    edges,
    totalNodes: nodes.length,
    totalEdges: edges.length
  }
}

/**
 * Regenerates a single day with reshuffled/rebalanced experience candidates
 */
export function regenerateDay(currentItinerary, dayNumber, tripPreferences, selectedExperiences = []) {
  const freshItinerary = generateItinerary(tripPreferences, selectedExperiences)
  const targetFreshDay = freshItinerary.days.find(d => d.day === dayNumber) || freshItinerary.days[0]

  const updatedDays = currentItinerary.days.map(d => {
    if (d.day === dayNumber) {
      return {
        ...targetFreshDay,
        status: "Rebalanced"
      }
    }
    return d
  })

  const summary = calculateItinerarySummary(updatedDays, tripPreferences?.budget?.total || 35000)
  const flexibility = calculateFlexibilityScore(updatedDays)

  return {
    ...currentItinerary,
    days: updatedDays,
    summary,
    flexibility
  }
}
