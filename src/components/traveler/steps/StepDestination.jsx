import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Search, Sparkles, Check, Globe } from 'lucide-react'
import { mockDestinations } from '@/data/mockData'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'

export const StepDestination = ({ destination, onSelectDestination }) => {
  const [searchQuery, setSearchQuery] = useState(destination.name || "Goa, India")

  const filteredSuggestions = mockDestinations.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.region.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selectedItem = mockDestinations.find(d => 
    d.name.toLowerCase() === destination.name?.toLowerCase() ||
    d.city.toLowerCase() === destination.city?.toLowerCase()
  ) || mockDestinations[0]

  const handleSelect = (item) => {
    setSearchQuery(item.name)
    onSelectDestination({
      name: item.name,
      city: item.city,
      country: item.country,
      region: item.region,
      image: item.image,
      tagline: item.tagline,
      description: item.description,
      vibes: item.vibes
    })
  }

  return (
    <div className="space-y-6">
      {/* Header & Context */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-terracotta-50 text-terracotta-800 text-[11px] font-semibold border border-terracotta-200/70 mb-2">
          <Sparkles className="w-3 h-3 text-terracotta-600" />
          <span>Step 01 • Destination</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-serif text-charcoal-950">
          Where are you going?
        </h2>
        <p className="text-sm text-charcoal-600 mt-1">
          Tell TripSaathi where your journey begins.
        </p>
        <div className="mt-3 p-3 rounded-xl bg-sand-100/60 border border-sand-200/80 text-xs text-charcoal-700 leading-relaxed">
          <span className="font-semibold text-charcoal-900">Why this matters: </span>
          Knowing your destination helps TripSaathi calibrate regional weather patterns, seasonal logistics, and authentic neighborhood gems.
        </div>
      </div>

      {/* Destination Input & Quick Pills */}
      <div className="space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700">
          Search Destination
        </label>
        <div className="relative">
          <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-terracotta-600 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="e.g. Goa, India or Jaipur..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-sand-300 bg-white text-sm font-medium text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500 shadow-soft-xs"
          />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-semibold text-muted-foreground mr-1">Popular:</span>
          {mockDestinations.map((item) => {
            const isSelected = selectedItem.id === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item)}
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-charcoal-900 text-white font-semibold shadow-soft-xs"
                    : "bg-white border border-sand-200 text-charcoal-700 hover:bg-sand-100"
                }`}
              >
                {isSelected && <Check className="w-3 h-3 text-terracotta-400" />}
                <span>{item.city}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Destination Preview Card */}
      <motion.div
        key={selectedItem.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <Card className="overflow-hidden border-sand-200/90 shadow-soft-sm bg-white">
          <div className="relative h-48 sm:h-56 overflow-hidden bg-charcoal-950">
            <img
              src={selectedItem.image}
              alt={selectedItem.name}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/85 via-charcoal-950/30 to-transparent" />
            
            <div className="absolute top-3 left-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold border border-white/20">
                <Globe className="w-3 h-3 text-terracotta-400" />
                {selectedItem.region}
              </span>
            </div>

            <div className="absolute bottom-3 left-4 right-4 text-white">
              <h3 className="text-xl sm:text-2xl font-bold font-serif">{selectedItem.name}</h3>
              <p className="text-xs text-sand-200 mt-0.5 line-clamp-1">{selectedItem.tagline}</p>
            </div>
          </div>

          <div className="p-4 sm:p-5 space-y-3">
            <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed">
              {selectedItem.description}
            </p>

            {/* Travel Vibe Tags */}
            <div className="pt-2 border-t border-sand-100 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-semibold text-muted-foreground mr-1">Travel Vibes:</span>
              {selectedItem.vibes.map((vibe, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-sand-100 text-charcoal-800 border border-sand-200/60"
                >
                  {vibe}
                </span>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
