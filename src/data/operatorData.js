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
