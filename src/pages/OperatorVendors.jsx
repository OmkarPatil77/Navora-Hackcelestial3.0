import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Store, Search, Filter, Plus, Phone, Mail, MapPin, Star, 
  CheckCircle2, Clock, AlertCircle, Layers, Building2, Car, 
  Utensils, Mountain, Waves 
} from 'lucide-react'
import { extendedVendors } from '@/data/operatorData'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { StatusIndicator } from '@/components/ui/StatusIndicator'
import PageTransition from '@/components/motion/PageTransition'

export const OperatorVendors = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("All")

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Transport': return Car
      case 'Accommodation': return Building2
      case 'Dining': return Utensils
      case 'Experience': return Mountain
      default: return Store
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return 'text-emerald-700 bg-emerald-50 border-emerald-200'
      case 'updated': return 'text-amber-700 bg-amber-50 border-amber-200'
      case 'replaced': return 'text-rose-700 bg-rose-50 border-rose-200'
      case 'requires_action': return 'text-rose-700 bg-rose-50 border-rose-200'
      case 'scheduled': return 'text-sky-700 bg-sky-50 border-sky-200'
      default: return 'text-charcoal-700 bg-sand-50 border-sand-200'
    }
  }

  const filteredVendors = extendedVendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          vendor.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          vendor.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === "All" || vendor.category === categoryFilter
    const matchesStatus = statusFilter === "All" || vendor.status === statusFilter.toLowerCase()

    return matchesSearch && matchesCategory && matchesStatus
  })

  const categories = ["All", "Transport", "Accommodation", "Experience", "Dining"]
  const statuses = ["All", "Confirmed", "Updated", "Replaced", "Requires Action", "Scheduled"]

  return (
    <PageTransition>
      <div className="py-8 md:py-10 px-4 sm:px-6 lg:px-8 space-y-6 max-w-7xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-sand-200/80">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-terracotta-600">
                Vendor Network
              </span>
              <span className="text-xs text-muted-foreground">• Partner Management</span>
            </div>
            <h1 className="text-3xl font-bold font-serif text-charcoal-950">
              Vendor Directory
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-600 mt-1">
              Manage service providers, track performance, and coordinate operations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="bg-terracotta-600 hover:bg-terracotta-700 text-white text-xs shadow-soft-xs"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Add Vendor
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <Card className="p-4 bg-white border-sand-200 shadow-soft-xs space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-medium">Total Vendors</span>
              <Store className="w-4 h-4 text-terracotta-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold font-serif text-charcoal-950">{extendedVendors.length}</p>
            <p className="text-[11px] text-emerald-700 font-medium">Active Partners</p>
          </Card>

          <Card className="p-4 bg-white border-sand-200 shadow-soft-xs space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-medium">Confirmed</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold font-serif text-charcoal-950">
              {extendedVendors.filter(v => v.status === 'confirmed').length}
            </p>
            <p className="text-[11px] text-emerald-700 font-medium">Ready to Serve</p>
          </Card>

          <Card className="p-4 bg-white border-sand-200 shadow-soft-xs space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-medium">Action Required</span>
              <AlertCircle className="w-4 h-4 text-rose-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold font-serif text-charcoal-950">
              {extendedVendors.filter(v => v.status === 'requires_action').length}
            </p>
            <p className="text-[11px] text-rose-700 font-medium">Needs Attention</p>
          </Card>

          <Card className="p-4 bg-white border-sand-200 shadow-soft-xs space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-medium">Avg Rating</span>
              <Star className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold font-serif text-charcoal-950">
              {(extendedVendors.reduce((acc, v) => acc + v.rating, 0) / extendedVendors.length).toFixed(1)}
            </p>
            <p className="text-[11px] text-emerald-700 font-medium">Quality Score</p>
          </Card>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center bg-white p-3.5 rounded-xl border border-sand-200 shadow-soft-xs">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-charcoal-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by vendor name, service, or contact..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-sand-50/50 border border-sand-200 rounded-lg text-xs text-charcoal-900 placeholder:text-muted-foreground focus:outline-hidden focus:border-terracotta-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 bg-sand-50/50 border border-sand-200 rounded-lg text-xs text-charcoal-900 focus:outline-hidden focus:border-terracotta-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 bg-sand-50/50 border border-sand-200 rounded-lg text-xs text-charcoal-900 focus:outline-hidden focus:border-terracotta-500"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Vendors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVendors.map((vendor) => {
            const CategoryIcon = getCategoryIcon(vendor.category)
            return (
              <Card
                key={vendor.id}
                className="p-5 bg-white border-sand-200 shadow-soft-sm hover:shadow-soft-md transition-all"
              >
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-terracotta-50 text-terracotta-600">
                        <CategoryIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                          {vendor.category}
                        </span>
                        <h3 className="font-serif font-bold text-charcoal-950 text-sm">
                          {vendor.name}
                        </h3>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      size="sm"
                      className={getStatusColor(vendor.status)}
                    >
                      {vendor.status.replace('_', ' ').charAt(0).toUpperCase() + vendor.status.replace('_', ' ').slice(1)}
                    </Badge>
                  </div>

                  {/* Service */}
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-charcoal-900">{vendor.service}</p>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span className="font-semibold">{vendor.rating}</span>
                      <span>• {vendor.tourId}</span>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="space-y-1.5 pt-2 border-t border-sand-100">
                    <div className="flex items-center gap-2 text-xs text-charcoal-700">
                      <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="font-mono">{vendor.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-charcoal-700">
                      <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>{vendor.contactPerson}</span>
                    </div>
                  </div>

                  {/* Schedule */}
                  <div className="flex items-center justify-between pt-2 border-t border-sand-100">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-muted-foreground">Scheduled</span>
                      <span className="text-xs font-semibold text-charcoal-900">{vendor.scheduledTime}</span>
                    </div>
                    {vendor.updatedTime !== vendor.scheduledTime && (
                      <div className="space-y-0.5 text-right">
                        <span className="text-[10px] text-muted-foreground">Updated</span>
                        <span className="text-xs font-semibold text-amber-700">{vendor.updatedTime}</span>
                      </div>
                    )}
                  </div>

                  {/* Note */}
                  {vendor.note && (
                    <div className="p-2 rounded-lg bg-sand-50 border border-sand-100">
                      <p className="text-[10px] text-charcoal-600 leading-tight">{vendor.note}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-xs bg-sand-50 border-sand-200 hover:bg-sand-100"
                    >
                      View Details
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 text-xs bg-charcoal-900 text-white hover:bg-charcoal-800"
                    >
                      Contact
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {filteredVendors.length === 0 && (
          <Card className="p-8 bg-white border-sand-200 shadow-soft-sm text-center">
            <Store className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-charcoal-950 mb-1">No vendors found</h3>
            <p className="text-sm text-muted-foreground">Try adjusting your search or filter criteria</p>
          </Card>
        )}
      </div>
    </PageTransition>
  )
}

export default OperatorVendors