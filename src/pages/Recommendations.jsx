import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, Star, MapPin, Clock, Plus, Check, Filter, 
  ArrowRight, Compass, ShieldCheck, Calendar, Users, 
  Wallet, RefreshCw, Layers, SlidersHorizontal, AlertCircle 
} from 'lucide-react'
import { useTripPlan } from '@/context/TripPlanningContext'
import { interestCatalogue } from '@/data/mockData'
import { getRecommendations, getJourneyFitMetrics, optimizePicks } from '@/services/recommendationEngine'
import { JourneyFitWidget } from '@/components/traveler/JourneyFitWidget'
import { ExperienceDetailDialog } from '@/components/traveler/ExperienceDetailDialog'
import { OptimizePicksDialog } from '@/components/traveler/OptimizePicksDialog'
import ExplainabilityModal from '@/components/shared/ExplainabilityModal'
import { explainRecommendation } from '@/services/decisionExplanationEngine'
import PageTransition from '@/components/motion/PageTransition'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatCurrency } from '@/lib/utils'

export const Recommendations = () => {
  const navigate = useNavigate()
  const {
    tripPreferences,
    selectedExperiences,
    totalPlannedActivitiesCost,
    remainingBudget,
    toggleExperience,
    isExperienceSelected,
    replaceExperience,
    setDestination,
    journeyMemory
  } = useTripPlan()

  // Filter & Sort State
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedDuration, setSelectedDuration] = useState("Any")
  const [selectedPrice, setSelectedPrice] = useState("Any")
  const [sortBy, setSortBy] = useState("Best Match")
  const [showFiltersDrawer, setShowFiltersDrawer] = useState(false)

  // Dialog State
  const [activeExperienceModal, setActiveExperienceModal] = useState(null)
  const [showOptimizeModal, setShowOptimizeModal] = useState(false)
  const [explainModalData, setExplainModalData] = useState(null)

  const {
    destination,
    duration,
    travelers,
    interests = ["adventure", "food", "beaches"],
    budget,
    travelStyle
  } = tripPreferences

  const adultCount = Math.max(1, travelers.adults || travelers.total || 2)

  const formatInterestLabels = (ids) => {
    return ids.map(id => {
      const match = interestCatalogue.find(i => i.id === id)
      return match ? match.label : id.charAt(0).toUpperCase() + id.slice(1)
    }).join(', ')
  }

  // Generate Ranked Recommendations from Engine
  const recommendationResult = useMemo(() => {
    return getRecommendations(tripPreferences, {
      category: selectedCategory,
      duration: selectedDuration,
      price: selectedPrice,
      sortBy
    })
  }, [tripPreferences, selectedCategory, selectedDuration, selectedPrice, sortBy])

  // Compute Journey Fit Metrics
  const journeyFitMetrics = useMemo(() => {
    return getJourneyFitMetrics(tripPreferences, selectedExperiences, recommendationResult.experiences)
  }, [tripPreferences, selectedExperiences, recommendationResult.experiences])

  // Compute Deterministic Optimization Results
  const optimizationResults = useMemo(() => {
    return optimizePicks(tripPreferences, selectedExperiences, recommendationResult.experiences)
  }, [tripPreferences, selectedExperiences, recommendationResult.experiences])

  const categories = ["All", "Adventure", "Food", "Culture", "Nature", "Beaches", "Wellness", "Nightlife", "Shopping"]
  const durationOptions = ["Any", "< 2 hrs", "2–4 hrs", "4+ hrs"]
  const priceOptions = ["Any", "Under ₹1,000", "₹1,000–₹2,500", "₹2,500+"]
  const sortOptions = ["Best Match", "Lowest Price", "Highest Rated", "Shortest Duration"]

  const resetFilters = () => {
    setSelectedCategory("All")
    setSelectedDuration("Any")
    setSelectedPrice("Any")
    setSortBy("Best Match")
  }

  // Graceful handling for non-Goa destinations in prototype
  if (!recommendationResult.isSupportedDestination) {
    return (
      <div className="py-16 md:py-24 bg-sand-50/50 min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="mx-auto max-w-xl px-4 sm:px-6 text-center space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto border border-amber-300 shadow-soft-xs">
            <Compass className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <Badge variant="warning">Curated Demo Focus</Badge>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-charcoal-950">
              {destination.name} Inventory Pending
            </h1>
            <p className="text-sm text-charcoal-700 leading-relaxed">
              TripSaathi's curated live demo inventory currently focuses on <span className="font-semibold text-charcoal-950">Goa, India</span>. We are expanding inventory for {destination.name} in upcoming phases.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              onClick={() => {
                setDestination({
                  name: "Goa, India",
                  city: "Goa",
                  country: "India",
                  region: "West Coast, India",
                  image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80"
                })
              }}
              className="bg-terracotta-600 text-white shadow-soft-sm"
              leftIcon={<RefreshCw className="w-4 h-4" />}
            >
              Switch Destination to Goa
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate('/plan')}
              className="text-xs"
            >
              Back to Trip Builder
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <PageTransition>
      <div className="py-10 md:py-14 bg-sand-50/50 min-h-[calc(100vh-4rem)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Top Header & Dynamic Preference Message */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-sand-200/80">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sand-100 text-charcoal-800 text-xs font-medium border border-sand-200">
                  <Compass className="w-3.5 h-3.5 text-terracotta-600" />
                  <span>Personalized Selection</span>
                </span>
                <span className="text-xs text-muted-foreground">• {destination.name}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold font-serif text-charcoal-950">
                Your journey is taking shape.
              </h1>

              <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed">
                We matched experiences for your <span className="font-semibold text-charcoal-900">{duration.days}-day {destination.city || destination.name} journey</span>, keeping your <span className="font-semibold text-charcoal-900">{formatCurrency(budget.total)} budget</span> and interest in <span className="font-semibold text-terracotta-700">{formatInterestLabels(interests)}</span> balanced.
              </p>
            </div>

            {/* Quick Actions Header */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowOptimizeModal(true)}
                className="text-xs bg-white text-charcoal-800 border-sand-300 hover:bg-sand-50 shadow-soft-xs"
                leftIcon={<SlidersHorizontal className="w-3.5 h-3.5 text-charcoal-600" />}
              >
                Fine-Tune Picks
              </Button>

              <Button
                size="sm"
                onClick={() => navigate('/itinerary')}
                className="bg-terracotta-600 hover:bg-terracotta-700 text-white text-xs shadow-soft-sm px-5 font-semibold"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Lock In & Build Itinerary ({selectedExperiences.length})
              </Button>
            </div>
          </div>

        {/* AI Match Summary & Journey Fit Widget */}
        <JourneyFitWidget
          metrics={journeyFitMetrics}
          tripPreferences={tripPreferences}
          totalPlannedActivitiesCost={totalPlannedActivitiesCost}
          remainingBudget={remainingBudget}
        />

        {/* Filters & Sorting Section */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-sand-200/90 shadow-soft-xs">
            
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              <span className="text-xs font-bold text-charcoal-700 mr-2 flex items-center gap-1 shrink-0">
                <Filter className="w-3.5 h-3.5 text-terracotta-600" /> Category:
              </span>
              {categories.map(cat => {
                const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase()
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-all ${
                      isSelected
                        ? "bg-charcoal-900 text-white font-semibold shadow-soft-xs"
                        : "bg-sand-50 border border-sand-200 text-charcoal-700 hover:bg-sand-100"
                    }`}
                  >
                    {cat}
                  </button>
                )
              })}
            </div>

            {/* Toggle Filters Drawer / Sort By */}
            <div className="flex items-center gap-2.5 shrink-0 self-end md:self-auto">
              {/* Sort dropdown */}
              <div className="flex items-center gap-1.5 text-xs text-charcoal-700">
                <span className="text-muted-foreground font-medium hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-sand-200 bg-sand-50 text-xs font-semibold text-charcoal-900 focus:outline-none focus:border-terracotta-500"
                >
                  {sortOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* Filters toggle button */}
              <button
                type="button"
                onClick={() => setShowFiltersDrawer(!showFiltersDrawer)}
                className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 transition-colors ${
                  showFiltersDrawer || selectedDuration !== "Any" || selectedPrice !== "Any"
                    ? "bg-terracotta-50 border-terracotta-300 text-terracotta-800"
                    : "bg-white border-sand-200 text-charcoal-700 hover:bg-sand-50"
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Filters</span>
              </button>
            </div>

          </div>

          {/* Secondary Filters Collapsible Drawer (Duration & Price) */}
          <AnimatePresence>
            {showFiltersDrawer && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="p-4 rounded-xl bg-sand-100/70 border border-sand-200/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                  
                  {/* Duration Filter */}
                  <div className="space-y-1.5">
                    <span className="font-bold text-charcoal-800 uppercase text-[10px] tracking-wider block">
                      Duration Filter
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {durationOptions.map(dur => (
                        <button
                          key={dur}
                          onClick={() => setSelectedDuration(dur)}
                          className={`px-2.5 py-1 rounded-md border text-xs ${
                            selectedDuration === dur
                              ? "bg-charcoal-900 text-white font-semibold"
                              : "bg-white border-sand-200 text-charcoal-700 hover:bg-sand-50"
                          }`}
                        >
                          {dur}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Filter */}
                  <div className="space-y-1.5">
                    <span className="font-bold text-charcoal-800 uppercase text-[10px] tracking-wider block">
                      Price / Person
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {priceOptions.map(pr => (
                        <button
                          key={pr}
                          onClick={() => setSelectedPrice(pr)}
                          className={`px-2.5 py-1 rounded-md border text-xs ${
                            selectedPrice === pr
                              ? "bg-charcoal-900 text-white font-semibold"
                              : "bg-white border-sand-200 text-charcoal-700 hover:bg-sand-50"
                          }`}
                        >
                          {pr}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Reset Button */}
                  <div className="flex items-end justify-start sm:justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={resetFilters}
                      className="text-xs text-charcoal-600 hover:text-terracotta-600"
                      leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                    >
                      Reset All Filters
                    </Button>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Experience Inventory Grid */}
        {recommendationResult.experiences.length === 0 ? (
          <EmptyState
            title="No experiences match current filters"
            description="Try loosening your duration, price, or category filters to see more results."
            actionLabel="Reset Filters"
            onAction={resetFilters}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendationResult.experiences.map((item, idx) => {
              const isSelected = isExperienceSelected(item.id)

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: Math.min(0.3, idx * 0.04) }}
                  className="flex"
                >
                  <Card
                    onClick={() => setActiveExperienceModal(item)}
                    className="overflow-hidden bg-white border-sand-200 shadow-soft-xs hover:shadow-soft-md hover:border-sand-300 transition-all flex flex-col justify-between w-full cursor-pointer group"
                  >
                    <div>
                      {/* Card Image Banner */}
                      <div className="relative h-48 w-full overflow-hidden bg-charcoal-900">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/70 via-transparent to-black/20" />

                        {/* Top Match Badge */}
                        <div className="absolute top-3 left-3 flex items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold border border-white/10">
                            {item.matchScore}% Match
                          </span>
                        </div>

                        {/* Top Right Category Pill */}
                        <div className="absolute top-3 right-3">
                          <span className="px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-md text-charcoal-900 text-[10px] font-bold uppercase tracking-wider">
                            {item.category}
                          </span>
                        </div>

                        {/* Bottom Location & Duration on Image */}
                        <div className="absolute bottom-2.5 left-3 right-3 text-white flex items-center justify-between text-[11px]">
                          <span className="flex items-center gap-1 text-sand-200">
                            <MapPin className="w-3 h-3 text-terracotta-400 shrink-0" />
                            <span className="line-clamp-1">{item.location}</span>
                          </span>
                          <span className="flex items-center gap-1 shrink-0 font-medium">
                            <Clock className="w-3 h-3 text-terracotta-400" />
                            {item.durationHours}h
                          </span>
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="p-4 sm:p-5 space-y-3">
                        
                        {/* Title & Rating */}
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="font-serif font-bold text-base text-charcoal-950 leading-snug group-hover:text-terracotta-600 transition-colors line-clamp-1">
                              {item.title}
                            </h3>
                            <span className="flex items-center gap-1 text-xs font-semibold text-charcoal-900 shrink-0">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              {item.rating}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {item.description}
                          </p>
                        </div>

                        {/* Match Rationale Pill with Explainability Button */}
                        <div className="p-2.5 rounded-xl bg-sand-100/70 border border-sand-200/80 text-[11px] text-charcoal-800 leading-relaxed flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <span className="font-semibold text-charcoal-900">Why it matches: </span>
                            <span>{item.matchReasons?.[0] || "Strong alignment with your profile."}</span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              const exp = explainRecommendation(item, tripPreferences, journeyMemory)
                              setExplainModalData(exp)
                            }}
                            className="px-2 py-0.5 rounded-md bg-white border border-sand-300 text-charcoal-700 font-bold hover:bg-sand-50 hover:text-charcoal-900 transition-colors shrink-0 shadow-2xs text-[10px] uppercase tracking-wide cursor-pointer"
                          >
                            Why?
                          </button>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          {item.tags.slice(0, 3).map((tag, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded text-[10px] font-medium bg-sand-100 text-charcoal-700 capitalize"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                      </div>
                    </div>

                    {/* Footer Row */}
                    <div className="p-4 sm:p-5 pt-0 border-t border-sand-100 mt-2 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase block font-semibold">
                          Price / Person
                        </span>
                        <span className="text-base font-bold font-serif text-charcoal-950">
                          {formatCurrency(item.pricePerPerson)}
                        </span>
                      </div>

                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleExperience(item)
                        }}
                        className={
                          isSelected 
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 text-xs" 
                            : "bg-terracotta-600 hover:bg-terracotta-700 text-white text-xs shadow-soft-xs"
                        }
                        leftIcon={isSelected ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Plus className="w-3.5 h-3.5" />}
                      >
                        {isSelected ? "Added to Journey" : "Add to Journey"}
                      </Button>
                    </div>

                  </Card>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Bottom Itinerary Synthesis Navigation Bar */}
        <div className="p-6 rounded-2xl bg-charcoal-950 text-white border border-charcoal-800 shadow-soft-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-terracotta-400">Step 3 of 4 Complete</span>
              <span className="text-charcoal-500">•</span>
              <span className="text-xs text-charcoal-300">{selectedExperiences.length} Experiences Staged</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold font-serif text-white">
              Ready to construct your daily schedule?
            </h3>
            <p className="text-xs text-charcoal-400 max-w-lg">
              TripSaathi will assemble your selected experiences into a day-by-day itinerary with time buffers, transit routes, and dynamic disruption resilience.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              size="lg"
              onClick={() => navigate('/itinerary')}
              className="w-full sm:w-auto bg-terracotta-600 hover:bg-terracotta-700 text-white shadow-soft-lg px-8 font-semibold"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Build My Itinerary →
            </Button>
          </div>
        </div>

      </div>

      {/* Experience Detail Modal */}
      <ExperienceDetailDialog
        experience={activeExperienceModal}
        isOpen={Boolean(activeExperienceModal)}
        onClose={() => setActiveExperienceModal(null)}
        isSelected={activeExperienceModal ? isExperienceSelected(activeExperienceModal.id) : false}
        onToggleSelect={toggleExperience}
        adultCount={adultCount}
      />

      {/* Optimize My Picks Modal */}
      <OptimizePicksDialog
        isOpen={showOptimizeModal}
        onClose={() => setShowOptimizeModal(false)}
        optimizationResults={optimizationResults}
        onApplySwap={replaceExperience}
      />

      {/* Decision Explainability Modal */}
      <ExplainabilityModal
        isOpen={Boolean(explainModalData)}
        onClose={() => setExplainModalData(null)}
        explanation={explainModalData}
      />

    </div>
    </PageTransition>
  )
}

export default Recommendations
