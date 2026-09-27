/**
 * Centralized mock data and constants for TripSaathi Operator Command Center
 */

export const operatorInfo = {
  id: "OP-001",
  name: "Apex Coastal Operations",
  hub: "Goa Hub (GOI-DABOLIM)",
  leadDispatcher: "Devendra Verma",
  role: "Lead Tour Operations Director",
  shift: "Morning Shift (07:00 – 19:00 IST)",
  systemHealth: "Optimal",
  lastSync: "Just now"
}

export const initialOperatorKPIs = {
  activeTours: 12,
  totalTravelers: 28,
  vendorConfirmationsPct: 94,
  openActions: 3,
  activeDisruptions: 1,
  onTimeRate: "97.4%",
  csatScore: "4.92 / 5.0"
}

export const initialOperatorTours = [
  {
    id: "GOA-2048",
    title: "Goa Coastal Escape",
    destination: "Goa, India",
    travelersCount: 2,
    travelersName: "Aryan & Riya Sharma",
    startDate: "12 Oct 2026",
    endDate: "15 Oct 2026",
    durationDays: 4,
    budgetTotal: 35000,
    status: "disruption_active", // dynamically synced with TripPlanningContext
    leadGuide: "Rajesh Naik",
    hotel: "Casa Sol Heritage Villa, Panjim",
    flightRef: "6E-204 (BOM → GOI)",
    pacing: "Balanced",
    tags: ["Active", "Coastal", "Culinary"]
  },
  {
    id: "JAIPUR-1021",
    title: "Royal Rajputana Palaces",
    destination: "Jaipur, Rajasthan",
    travelersCount: 4,
    travelersName: "Kulkarni Family (4 Pax)",
    startDate: "12 Oct 2026",
    endDate: "16 Oct 2026",
    durationDays: 5,
    budgetTotal: 68000,
    status: "on_track",
    leadGuide: "Vikram Rathore",
    hotel: "Alsisar Haveli, Jaipur",
    flightRef: "AI-481 (DEL → JAI)",
    pacing: "Moderate",
    tags: ["Heritage", "Architecture"]
  },
  {
    id: "KERALA-3382",
    title: "Kerala Backwaters & Tea Trails",
    destination: "Munnar & Alleppey",
    travelersCount: 6,
    travelersName: "Mehta Corporate Retreat",
    startDate: "13 Oct 2026",
    endDate: "18 Oct 2026",
    durationDays: 6,
    budgetTotal: 112000,
    status: "on_track",
    leadGuide: "Mathew George",
    hotel: "Spice Tree Munnar & Luxury Houseboat",
    flightRef: "6E-512 (BLR → COK)",
    pacing: "Relaxed",
    tags: ["Nature", "Wellness"]
  },
  {
    id: "LADAKH-4190",
    title: "High Altitude Nubra & Pangong",
    destination: "Leh Ladakh",
    travelersCount: 3,
    travelersName: "Aditya & Friends",
    startDate: "14 Oct 2026",
    endDate: "20 Oct 2026",
    durationDays: 7,
    budgetTotal: 84000,
    status: "on_track",
    leadGuide: "Stanzin Norbu",
    hotel: "Grand Dragon Leh",
    flightRef: "AI-445 (DEL → IXL)",
    pacing: "Active",
    tags: ["Adventure", "Photography"]
  },
  {
    id: "VARANASI-5012",
    title: "Spiritual Ghats & Sarnath Walk",
    destination: "Varanasi, UP",
    travelersCount: 2,
    travelersName: "Dr. Arvind Gupta & Spouse",
    startDate: "12 Oct 2026",
    endDate: "14 Oct 2026",
    durationDays: 3,
    budgetTotal: 29000,
    status: "on_track",
    leadGuide: "Pandit Ramkishan",
    hotel: "BrijRama Palace Varanasi",
    flightRef: "6E-219 (BOM → VNS)",
    pacing: "Gentle",
    tags: ["Culture", "Spiritual"]
  },
  {
    id: "COORG-6110",
    title: "Coffee Estate & Wilderness Trail",
    destination: "Coorg, Karnataka",
    travelersCount: 2,
    travelersName: "Sneha & Rohan",
    startDate: "13 Oct 2026",
    endDate: "16 Oct 2026",
    durationDays: 4,
    budgetTotal: 42000,
    status: "on_track",
    leadGuide: "Bopanna K.",
    hotel: "Evolve Back Kabini / Coorg",
    flightRef: "Self Drive (BLR)",
    pacing: "Relaxed",
    tags: ["Nature", "Couples"]
  }
]

export const initialVendors = [
  {
    id: "VEN-001",
    name: "Goa Transfers Fleet",
    category: "Transport",
    service: "Airport Transfer (Innova Crysta)",
    contactPerson: "Rajesh Naik",
    phone: "+91 98221 44021",
    rating: 4.9,
    status: "requires_action", // "requires_action" | "confirmed" | "updated"
    tourId: "GOA-2048",
    scheduledTime: "10:55",
    updatedTime: "12:15",
    note: "Delayed flight touchdown. Gate pickup re-timed to 12:15."
  },
  {
    id: "VEN-002",
    name: "Casa Sol Heritage Villa",
    category: "Accommodation",
    service: "Villa Check-in & Beach Suite",
    contactPerson: "Maria D'Souza",
    phone: "+91 98223 99182",
    rating: 4.8,
    status: "updated",
    tourId: "GOA-2048",
    scheduledTime: "12:00",
    updatedTime: "13:15",
    note: "Check-in window adjusted for delayed arrival. Welcome drinks held."
  },
  {
    id: "VEN-003",
    name: "Oceanic Adventures",
    category: "Experience / Water Sports",
    service: "Grand Island Scuba Expedition",
    contactPerson: "Captain Vikram",
    phone: "+91 98112 33412",
    rating: 4.7,
    status: "replaced", // "replaced" | "confirmed"
    tourId: "GOA-2048",
    scheduledTime: "12:30",
    updatedTime: "16:00",
    note: "Afternoon slot cancelled without penalty. Replaced with Fontainhas Cultural Walk."
  },
  {
    id: "VEN-004",
    name: "Fontainhas Heritage Guild",
    category: "Experience / Cultural Walk",
    service: "Latin Quarter Heritage & Culinary Walk",
    contactPerson: "Luis Fernandes",
    phone: "+91 98220 11982",
    rating: 4.9,
    status: "scheduled",
    tourId: "GOA-2048",
    scheduledTime: "16:00",
    updatedTime: "16:00",
    note: "Confirmed for 2 pax late afternoon cultural walk & feni sommelier tasting."
  },
  {
    id: "VEN-005",
    name: "Mandovi Luxury Cruises",
    category: "Experience / Cruise",
    service: "Mandovi River Catamaran Sunset Cruise",
    contactPerson: "Jetty Master",
    phone: "+91 98224 88371",
    rating: 4.8,
    status: "confirmed",
    tourId: "GOA-2048",
    scheduledTime: "18:45",
    updatedTime: "18:45",
    note: "Guarded evening golden-hour slot. Zero conflict."
  },
  {
    id: "VEN-006",
    name: "Fisherman's Wharf Panjim",
    category: "Dining / Culinary",
    service: "Candlelight Riverside Table",
    contactPerson: "Maitre D' Desk",
    phone: "+91 832 242 1100",
    rating: 4.9,
    status: "confirmed",
    tourId: "GOA-2048",
    scheduledTime: "20:30",
    updatedTime: "20:30",
    note: "Table reservation guarded. Coastal Goan set menu pre-arranged."
  }
]

export const initialAttentionItems = [
  {
    id: "ATTN-001",
    type: "VENDOR_CONFIRMATION",
    title: "Airport Transfer Gate Re-timing",
    vendorName: "Goa Transfers Fleet",
    vendorId: "VEN-001",
    tourId: "GOA-2048",
    time: "12:15 Pickup",
    description: "Confirm delayed flight pickup window with driver Rajesh Naik.",
    status: "pending", // "pending" | "resolved"
    actionLabel: "Confirm Vendor"
  },
  {
    id: "ATTN-002",
    type: "ACTIVITY_REPLACEMENT",
    title: "Slot Replacement Review",
    vendorName: "Oceanic Adventures",
    vendorId: "VEN-003",
    tourId: "GOA-2048",
    time: "16:00 Shift",
    description: "Scuba dive replaced with Fontainhas Walk to avoid daylight conflict.",
    status: "pending",
    actionLabel: "Review Replacement"
  },
  {
    id: "ATTN-003",
    type: "TRAVELER_NOTIFICATION",
    title: "Traveler Journey Update",
    vendorName: "Guest Communication",
    tourId: "GOA-2048",
    time: "Immediate",
    description: "Dispatch simulated WhatsApp / In-App notification with adapted Day 1 timetable.",
    status: "pending",
    actionLabel: "Send Notification"
  }
]

export const initialOperatorEventLog = [
  { time: "08:30", text: "Fleet monitoring initialized across 12 active tours.", type: "SYSTEM" },
  { time: "09:00", text: "Tour GOA-2048 scheduled. Inbound flight 6E-204 departing Mumbai.", type: "TOUR" },
  { time: "09:20", text: "All Day 1 vendor allocations confirmed across Goa network.", type: "VENDOR" }
]

// Bookings Data
export const initialBookings = [
  {
    id: "BK-2024-0892",
    tourId: "GOA-2048",
    bookingDate: "2024-09-15",
    travelersName: "Aryan & Riya Sharma",
    travelersCount: 2,
    destination: "Goa, India",
    travelDates: "12 Oct 2026 - 15 Oct 2026",
    totalAmount: 35000,
    paidAmount: 21000,
    pendingAmount: 14000,
    paymentStatus: "partial",
    bookingStatus: "confirmed",
    source: "Web App",
    specialRequests: "Early check-in requested, vegetarian meals preferred"
  },
  {
    id: "BK-2024-0893",
    tourId: "JAIPUR-1021",
    bookingDate: "2024-09-14",
    travelersName: "Kulkarni Family (4 Pax)",
    travelersCount: 4,
    destination: "Jaipur, Rajasthan",
    travelDates: "12 Oct 2026 - 16 Oct 2026",
    totalAmount: 68000,
    paidAmount: 68000,
    pendingAmount: 0,
    paymentStatus: "paid",
    bookingStatus: "confirmed",
    source: "Travel Agent",
    specialRequests: "Wheelchair accessibility required"
  },
  {
    id: "BK-2024-0894",
    tourId: "KERALA-3382",
    bookingDate: "2024-09-16",
    travelersName: "Mehta Corporate Retreat",
    travelersCount: 6,
    destination: "Munnar & Alleppey",
    travelDates: "13 Oct 2026 - 18 Oct 2026",
    totalAmount: 112000,
    paidAmount: 56000,
    pendingAmount: 56000,
    paymentStatus: "partial",
    bookingStatus: "confirmed",
    source: "Corporate Portal",
    specialRequests: "Conference room booking for Day 3"
  },
  {
    id: "BK-2024-0895",
    tourId: "LADAKH-4190",
    bookingDate: "2024-09-18",
    travelersName: "Aditya & Friends",
    travelersCount: 3,
    destination: "Leh Ladakh",
    travelDates: "14 Oct 2026 - 20 Oct 2026",
    totalAmount: 84000,
    paidAmount: 0,
    pendingAmount: 84000,
    paymentStatus: "pending",
    bookingStatus: "pending",
    source: "Web App",
    specialRequests: "Oxygen cylinders required for high altitude"
  },
  {
    id: "BK-2024-0896",
    tourId: "VARANASI-5012",
    bookingDate: "2024-09-10",
    travelersName: "Dr. Arvind Gupta & Spouse",
    travelersCount: 2,
    destination: "Varanasi, UP",
    travelDates: "12 Oct 2026 - 14 Oct 2026",
    totalAmount: 29000,
    paidAmount: 29000,
    pendingAmount: 0,
    paymentStatus: "paid",
    bookingStatus: "confirmed",
    source: "Direct Call",
    specialRequests: "Private boat for Ganga Aarti"
  }
]

// Extended Vendors Data
export const extendedVendors = [
  ...initialVendors,
  {
    id: "VEN-007",
    name: "Rajasthan Royal Transport",
    category: "Transport",
    service: "Heritage Tour Bus (AC Coach)",
    contactPerson: "Mahendra Singh",
    phone: "+91 98291 55432",
    rating: 4.7,
    status: "confirmed",
    tourId: "JAIPUR-1021",
    scheduledTime: "09:00",
    updatedTime: "09:00",
    note: "Daily pickup confirmed for 5-day tour"
  },
  {
    id: "VEN-008",
    name: "Alsisar Haveli",
    category: "Accommodation",
    service: "Heritage Suite (2 Rooms)",
    contactPerson: "Reception Desk",
    phone: "+91 141 237 0301",
    rating: 4.8,
    status: "confirmed",
    tourId: "JAIPUR-1021",
    scheduledTime: "14:00",
    updatedTime: "14:00",
    note: "Welcome ceremony with traditional refreshments"
  },
  {
    id: "VEN-009",
    name: "Kerala Houseboat Operators",
    category: "Experience",
    service: "Premium Houseboat (1 Night)",
    contactPerson: "Captain Thomas",
    phone: "+91 484 236 1234",
    rating: 4.9,
    status: "confirmed",
    tourId: "KERALA-3382",
    scheduledTime: "12:00",
    updatedTime: "12:00",
    note: "Alleppey backwaters cruise with chef onboard"
  },
  {
    id: "VEN-010",
    name: "Spice Tree Plantation",
    category: "Experience",
    service: "Tea Estate Tour & Stay",
    contactPerson: "Plantation Manager",
    phone: "+91 486 253 7890",
    rating: 4.8,
    status: "confirmed",
    tourId: "KERALA-3382",
    scheduledTime: "10:00",
    updatedTime: "10:00",
    note: "Spice tour and plantation stay confirmed"
  }
]

// Disruptions Data
export const initialDisruptions = [
  {
    id: "DIS-2024-001",
    type: "flight_delay",
    severity: "high",
    tourId: "GOA-2048",
    title: "Flight 6E-204 Delayed",
    description: "Inbound flight Mumbai (BOM) → Goa (GOI) delayed by 90 minutes due to air traffic congestion",
    detectedAt: "2024-09-27 09:15",
    originalTime: "09:20",
    newTime: "10:50",
    status: "active",
    affectedItems: ["Airport Transfer", "Hotel Check-in", "Scuba Diving"],
    recoveryPlan: "Plan B - Balanced recovery applied",
    resolutionETA: "2024-09-27 12:00"
  },
  {
    id: "DIS-2024-002",
    type: "weather_warning",
    severity: "medium",
    tourId: "KERALA-3382",
    title: "Heavy Rain Alert",
    description: "IMD issued yellow alert for heavy rainfall in Alleppey region for next 48 hours",
    detectedAt: "2024-09-26 18:30",
    originalTime: "N/A",
    newTime: "N/A",
    status: "monitoring",
    affectedItems: ["Houseboat Cruise", "Backwater Activities"],
    recoveryPlan: "Contingency indoor activities planned",
    resolutionETA: "2024-09-28 18:00"
  },
  {
    id: "DIS-2024-003",
    type: "vendor_issue",
    severity: "low",
    tourId: "JAIPUR-1021",
    title: "Guide Schedule Conflict",
    description: "Lead guide Vikram Rathore has a minor scheduling conflict on Day 3 afternoon",
    detectedAt: "2024-09-25 14:20",
    originalTime: "15:00",
    newTime: "16:30",
    status: "resolved",
    affectedItems: ["City Walking Tour"],
    recoveryPlan: "Alternate guide arranged, tour shifted by 90 minutes",
    resolutionETA: "2024-09-25 16:00"
  }
]

// Payments Data
export const initialPayments = [
  {
    id: "PAY-2024-3421",
    bookingId: "BK-2024-0892",
    tourId: "GOA-2048",
    amount: 21000,
    paymentDate: "2024-09-15",
    paymentMethod: "UPI",
    transactionId: "UPI123456789",
    status: "completed",
    paymentType: "advance"
  },
  {
    id: "PAY-2024-3422",
    bookingId: "BK-2024-0893",
    tourId: "JAIPUR-1021",
    amount: 68000,
    paymentDate: "2024-09-14",
    paymentMethod: "Bank Transfer",
    transactionId: "NEFT987654321",
    status: "completed",
    paymentType: "full"
  },
  {
    id: "PAY-2024-3423",
    bookingId: "BK-2024-0894",
    tourId: "KERALA-3382",
    amount: 56000,
    paymentDate: "2024-09-16",
    paymentMethod: "Credit Card",
    transactionId: "CC456789123",
    status: "completed",
    paymentType: "advance"
  },
  {
    id: "PAY-2024-3424",
    bookingId: "BK-2024-0896",
    tourId: "VARANASI-5012",
    amount: 29000,
    paymentDate: "2024-09-10",
    paymentMethod: "UPI",
    transactionId: "UPI789123456",
    status: "completed",
    paymentType: "full"
  },
  {
    id: "PAY-2024-3425",
    bookingId: "BK-2024-0892",
    amount: 14000,
    paymentDate: "2024-09-27",
    paymentMethod: "Pending",
    transactionId: "N/A",
    status: "pending",
    paymentType: "balance"
  }
]

// Reports Data
export const initialReports = {
  revenue: {
    totalRevenue: 328000,
    monthlyRevenue: 145000,
    growthRate: 12.5,
    topDestination: "Goa",
    revenueByDestination: [
      { destination: "Goa", revenue: 85000, percentage: 26 },
      { destination: "Jaipur", revenue: 72000, percentage: 22 },
      { destination: "Kerala", revenue: 98000, percentage: 30 },
      { destination: "Ladakh", revenue: 45000, percentage: 14 },
      { destination: "Varanasi", revenue: 28000, percentage: 8 }
    ]
  },
  performance: {
    onTimeRate: 97.4,
    customerSatisfaction: 4.92,
    vendorReliability: 94.0,
    disruptionResolutionRate: 98.5,
    averageResponseTime: "15 minutes"
  },
  bookings: {
    totalBookings: 156,
    monthlyBookings: 42,
    cancellationRate: 3.2,
    averageBookingValue: 2100,
    peakBookingMonth: "October"
  },
  disruptions: {
    totalDisruptions: 8,
    resolvedDisruptions: 7,
    activeDisruptions: 1,
    averageResolutionTime: "2.5 hours",
    commonTypes: ["Flight Delays", "Weather", "Vendor Issues"]
  }
}
