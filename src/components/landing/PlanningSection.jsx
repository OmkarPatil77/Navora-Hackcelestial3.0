import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MapPin, Calendar, Users, Wallet, Search, ArrowRight, 
  Compass, ShieldCheck, Star, Heart, Check, ChevronDown, 
  Car, Hotel, Utensils, Mountain, Waves, Coffee, Camera 
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export const PlanningSection = () => {
  const navigate = useNavigate()

  // MMT-style Tab switcher
  const [activeTab, setActiveTab] = useState('holidays') // 'holidays' | 'getaways' | 'curated'
  const [destination, setDestination] = useState('Goa, India')
  const [duration, setDuration] = useState('4 Days / 3 Nights')
  const [travelers, setTravelers] = useState('2 Travelers • Balanced')
  const [budget, setBudget] = useState(35000)
  const [selectedFilter, setSelectedFilter] = useState('all')

  // Selected quick vibes
  const [activeVibes, setActiveVibes] = useState(['Beaches', 'Heritage & Food'])

  const vibeOptions = [
    { label: "Beaches", emoji: "🌊" },
    { label: "Heritage & Food", emoji: "🏛️" },
    { label: "Waterfalls & Trek", emoji: "⛰️" },
    { label: "Art Cafes & Nightlife", emoji: "🍹" },
    { label: "Wellness & Spa", emoji: "🧘" },
  ]

  const toggleVibe = (label) => {
    setActiveVibes(prev => 
      prev.includes(label) 
        ? (prev.length > 1 ? prev.filter(v => v !== label) : prev)
        : [...prev, label]
    )
  }

  // Handcrafted travel packages inspired by MMT Holiday collections
  const holidayPackages = [
    {
      id: "pkg-panjim-heritage",
      title: "Panjim Latin Quarter & Sunset Catamaran",
      tagline: "Colonial Portuguese villas, Mario Miranda art, authentic Goan bakeries & sunset cruise",
      duration: "4 Days / 3 Nights",
      category: "heritage",
      price: 15400,
      originalPrice: 19500,
      rating: 4.9,
      reviews: 342,
      badge: "Bestseller",
      badgeColor: "bg-coral-500 text-white",
      image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
      includes: ["Heritage Villa Stay", "Private Sedan + Chauffeur", "Sunset Cruise & Dinner", "Fontainhas Guide"],
      assured: true
    },
    {
      id: "pkg-south-goa-serenity",
      title: "South Goa Coastal Retreat & Kayaking",
      tagline: "Hidden coves in Palolem, bioluminescent night kayak, beach shack dining & yoga",
      duration: "4 Days / 3 Nights",
      category: "beach",
      price: 13800,
      originalPrice: 17200,
      rating: 4.8,
      reviews: 218,
      badge: "Popular Pick",
      badgeColor: "bg-emerald-600 text-white",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      includes: ["Seaside Eco-Resort", "Airport Pick & Drop", "Guided Sea Kayak", "Daily Breakfast"],
      assured: true
    },
    {
      id: "pkg-dudhsagar-adventure",
      title: "Dudhsagar Jungle & Spice Trail Expedition",
      tagline: "Jeep safari to Dudhsagar waterfall, organic spice farm banquet, Mandovi backwaters",
      duration: "3 Days / 2 Nights",
      category: "adventure",
      price: 12200,
      originalPrice: 15000,
      rating: 4.9,
      reviews: 189,
      badge: "Adventure Special",
      badgeColor: "bg-amber-600 text-white",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
      includes: ["Jungle Cottage Stay", "4x4 Safari Transport", "Spice Farm Lunch", "Grand Island Boat"],
      assured: true
    }
  ]

  const filteredPackages = selectedFilter === 'all' 
    ? holidayPackages 
    : holidayPackages.filter(p => p.category === selectedFilter)

  return (
    <section className="py-16 md:py-24 bg-[#FAF7F2] border-y border-[#F1ECE1] relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-coral-50 border border-coral-200 text-coral-600 text-xs font-bold uppercase tracking-wider mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>Smart Travel Planning</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-navy-900 font-serif leading-[1.18]">
              Where would you like to travel?
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#5E6282] max-w-xl">
              Configure your trip parameters below. TripSaathi builds your day-by-day itinerary and protects it with real-time automatic disruption recovery.
            </p>
          </div>

          {/* MMT-style Assured Guarantee Pill */}
          <div className="hidden lg:flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl border border-[#EFEAE0] shadow-soft-xs">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="text-xs text-left">
              <span className="font-bold text-navy-900 block font-sans">TripSaathi Assured</span>
              <span className="text-[11px] text-muted-foreground block">Free auto-rerouting on delays</span>
            </div>
          </div>
        </div>

        {/* 1. MMT-STYLE UNIVERSAL SEARCH & BOOKING CARD */}
        <div className="bg-white rounded-3xl shadow-soft-lg border border-[#EFEAE0] overflow-hidden mb-16">
          
          {/* Top Category Tabs (Like MMT Flights / Hotels / Holidays tabs) */}
          <div className="flex items-center border-b border-[#F1ECE1] bg-[#FFFDF9] px-4 sm:px-8 overflow-x-auto no-scrollbar">
            {[
              { id: 'holidays', label: 'Tailored Holiday Plans', icon: Compass },
              { id: 'getaways', label: 'Weekend Escapes', icon: Calendar },
              { id: 'curated', label: 'Curated Experiences', icon: Heart }
            ].map(tab => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-4 sm:px-6 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                    isActive
                      ? 'border-coral-500 text-coral-600 bg-white'
                      : 'border-transparent text-[#5E6282] hover:text-navy-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>

          {/* Booking Inputs Grid (Signature MMT Search Row) */}
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4 items-center">
              
              {/* Field 1: Destination */}
              <div 
                onClick={() => navigate('/plan')}
                className="lg:col-span-3 p-3.5 sm:p-4 rounded-2xl border border-[#EFEAE0] hover:border-coral-400 hover:bg-[#FFFDF9] transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-coral-500" />
                    Destination
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground group-hover:text-coral-500 transition-colors" />
                </div>
                <p className="text-base sm:text-lg font-bold font-serif text-navy-900 group-hover:text-coral-600 transition-colors">
                  {destination}
                </p>
                <p className="text-[11px] text-[#5E6282] truncate">
                  Panjim, Palolem, Calangute & beyond
                </p>
              </div>

              {/* Field 2: Duration & Dates */}
              <div 
                onClick={() => navigate('/plan')}
                className="lg:col-span-3 p-3.5 sm:p-4 rounded-2xl border border-[#EFEAE0] hover:border-coral-400 hover:bg-[#FFFDF9] transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-500" />
                    Trip Duration
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground group-hover:text-coral-500 transition-colors" />
                </div>
                <p className="text-base sm:text-lg font-bold font-serif text-navy-900 group-hover:text-coral-600 transition-colors">
                  {duration}
                </p>
                <p className="text-[11px] text-[#5E6282]">
                  Flexible departure dates
                </p>
              </div>

              {/* Field 3: Guests & Pace */}
              <div 
                onClick={() => navigate('/plan')}
                className="lg:col-span-2 p-3.5 sm:p-4 rounded-2xl border border-[#EFEAE0] hover:border-coral-400 hover:bg-[#FFFDF9] transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-sky-500" />
                    Travelers
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground group-hover:text-coral-500 transition-colors" />
                </div>
                <p className="text-base sm:text-lg font-bold font-serif text-navy-900 group-hover:text-coral-600 transition-colors">
                  2 Guests
                </p>
                <p className="text-[11px] text-[#5E6282]">
                  Balanced tempo
                </p>
              </div>

              {/* Field 4: Budget Range */}
              <div 
                className="lg:col-span-2 p-3.5 sm:p-4 rounded-2xl border border-[#EFEAE0] hover:border-coral-400 hover:bg-[#FFFDF9] transition-all"
              >
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  <span className="flex items-center gap-1.5">
                    <Wallet className="w-3.5 h-3.5 text-emerald-500" />
                    Budget
                  </span>
                </div>
                <p className="text-base sm:text-lg font-bold font-serif text-navy-900">
                  {formatCurrency(budget)}
                </p>
                <div className="pt-1">
                  <input
                    type="range"
                    min="20000"
                    max="70000"
                    step="5000"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full h-1 bg-sand-300 rounded appearance-none cursor-pointer accent-coral-500"
                  />
                </div>
              </div>

              {/* Big Action Button (Signature MMT Search Button) */}
              <div className="lg:col-span-2">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/plan')}
                  className="w-full h-full min-h-[58px] bg-gradient-to-r from-honey-500 to-amber-500 hover:from-honey-600 hover:to-amber-600 text-navy-950 font-bold text-sm sm:text-base rounded-2xl shadow-warm-honey transition-all flex items-center justify-center gap-2 px-4 py-3"
                >
                  <Search className="w-4 h-4 stroke-[2.5]" />
                  <span>Search & Plan</span>
                </motion.button>
              </div>

            </div>

            {/* Quick Filter Vibes Row */}
            <div className="mt-5 pt-5 border-t border-[#F5F2EA] flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[#5E6282] font-semibold">Select Vibes:</span>
                {vibeOptions.map(vibe => {
                  const isSelected = activeVibes.includes(vibe.label)
                  return (
                    <button
                      key={vibe.label}
                      type="button"
                      onClick={() => toggleVibe(vibe.label)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                        isSelected
                          ? 'bg-coral-500 text-white font-bold shadow-xs'
                          : 'bg-[#FAF6F0] text-navy-900 hover:bg-[#EFEAE0]'
                      }`}
                    >
                      <span>{vibe.emoji}</span>
                      <span>{vibe.label}</span>
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </button>
                  )
                })}
              </div>

              <div className="flex items-center gap-4 text-[#5E6282] text-[11px]">
                <span className="flex items-center gap-1">
                  <Hotel className="w-3.5 h-3.5 text-navy-700" /> Stays Included
                </span>
                <span className="flex items-center gap-1">
                  <Car className="w-3.5 h-3.5 text-navy-700" /> Cabs Included
                </span>
                <span className="flex items-center gap-1 text-emerald-700 font-bold">
                  <Check className="w-3.5 h-3.5" /> 100% Adaptive
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* 2. MMT-STYLE CURATED PACKAGES SHOWCASE */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <h3 className="font-serif font-bold text-2xl sm:text-3xl text-navy-900">
                Trending Handcrafted Goa Packages
              </h3>
              <p className="text-xs sm:text-sm text-[#5E6282] mt-1">
                Pre-calibrated itineraries with boutique stays, local transfers, and authentic experiences.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0">
              {[
                { id: 'all', label: 'All Packages' },
                { id: 'heritage', label: 'Heritage & Food' },
                { id: 'beach', label: 'Beaches & Kayak' },
                { id: 'adventure', label: 'Adventure' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFilter(f.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    selectedFilter === f.id
                      ? 'bg-navy-900 text-white shadow-soft-xs'
                      : 'bg-white border border-[#EFEAE0] text-[#5E6282] hover:text-navy-900 hover:bg-[#FAF6F0]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Packages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredPackages.map((pkg) => (
              <motion.div
                key={pkg.id}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 280 }}
                className="bg-white rounded-3xl border border-[#EFEAE0] overflow-hidden shadow-soft-md hover:shadow-soft-xl transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Image container */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-sand-200">
                    <img
                      src={pkg.image}
                      alt={pkg.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${pkg.badgeColor}`}>
                        {pkg.badge}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-navy-900 flex items-center gap-1 shadow-soft-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{pkg.rating}</span>
                      <span className="text-[10px] text-muted-foreground">({pkg.reviews})</span>
                    </div>

                    {/* Bottom duration pill on image */}
                    <div className="absolute bottom-3 left-3 bg-navy-950/80 backdrop-blur-md px-3 py-1 rounded-full text-white text-[11px] font-semibold">
                      {pkg.duration}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6 space-y-3">
                    <h4 className="font-serif font-bold text-lg text-navy-900 group-hover:text-coral-600 transition-colors">
                      {pkg.title}
                    </h4>
                    <p className="text-xs text-[#5E6282] line-clamp-2 leading-relaxed">
                      {pkg.tagline}
                    </p>

                    {/* What's Included Pills (Like MMT inclusion tags) */}
                    <div className="pt-2 border-t border-[#F5F2EA]">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                        Included in this package:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {pkg.includes.map((item, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FAF6F0] text-[11px] text-navy-900 font-medium"
                          >
                            <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer with Pricing & CTA */}
                <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-3 border-t border-[#F5F2EA] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold block">Starting from</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-serif font-bold text-xl text-navy-900">
                        {formatCurrency(pkg.price)}
                      </span>
                      <span className="text-xs text-muted-foreground line-through">
                        {formatCurrency(pkg.originalPrice)}
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-semibold">per traveler • all inclusive</span>
                  </div>

                  <button
                    onClick={() => navigate('/plan')}
                    className="bg-navy-900 hover:bg-navy-950 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-soft-xs transition-all flex items-center gap-1.5 group-hover:bg-coral-500"
                  >
                    <span>Customize</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom Link to full planner */}
          <div className="mt-12 text-center">
            <button
              onClick={() => navigate('/plan')}
              className="inline-flex items-center gap-2 text-sm font-bold text-coral-600 hover:text-coral-700 font-sans group"
            >
              <span>Explore all customizable destinations & build your custom route</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

      </div>
    </section>
  )
}
export default PlanningSection
