import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  AlertTriangle, Search, Filter, Plane, CloudRain, AlertCircle, 
  Clock, CheckCircle2, ArrowRight, Zap, TrendingUp, Activity,
  Calendar, MapPin, Users
} from 'lucide-react'
import { initialDisruptions } from '@/data/operatorData'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { StatusIndicator } from '@/components/ui/StatusIndicator'
import PageTransition from '@/components/motion/PageTransition'

export const OperatorDisruptions = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [severityFilter, setSeverityFilter] = useState("All")

  const getDisruptionIcon = (type) => {
    switch(type) {
      case 'flight_delay': return Plane
      case 'weather_warning': return CloudRain
      case 'vendor_issue': return AlertCircle
      default: return AlertTriangle
    }
  }

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'high': return 'text-rose-700 bg-rose-50 border-rose-200'
      case 'medium': return 'text-amber-700 bg-amber-50 border-amber-200'
      case 'low': return 'text-sky-700 bg-sky-50 border-sky-200'
      default: return 'text-charcoal-700 bg-sand-50 border-sand-200'
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'text-rose-700 bg-rose-50 border-rose-200'
      case 'monitoring': return 'text-amber-700 bg-amber-50 border-amber-200'
      case 'resolved': return 'text-emerald-700 bg-emerald-50 border-emerald-200'
      default: return 'text-charcoal-700 bg-sand-50 border-sand-200'
    }
  }

  const filteredDisruptions = initialDisruptions.filter(disruption => {
    const matchesSearch = disruption.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          disruption.tourId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          disruption.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "All" || disruption.status === statusFilter.toLowerCase()
    const matchesSeverity = severityFilter === "All" || disruption.severity === severityFilter.toLowerCase()

    return matchesSearch && matchesStatus && matchesSeverity
  })

  const activeCount = initialDisruptions.filter(d => d.status === 'active').length
  const monitoringCount = initialDisruptions.filter(d => d.status === 'monitoring').length
  const resolvedCount = initialDisruptions.filter(d => d.status === 'resolved').length

  return (
    <PageTransition>
      <div className="py-8 md:py-10 px-4 sm:px-6 lg:px-8 space-y-6 max-w-7xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-sand-200/80">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-terracotta-600">
                Disruption Management
              </span>
              <span className="text-xs text-muted-foreground">• Incident Response</span>
            </div>
            <h1 className="text-3xl font-bold font-serif text-charcoal-950">
              Disruptions Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-600 mt-1">
              Monitor, analyze, and resolve travel disruptions with AI-powered recovery.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="text-xs bg-white border-sand-300 hover:bg-sand-100"
              leftIcon={<Activity className="w-3.5 h-3.5" />}
            >
              View Analytics
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <Card className="p-4 bg-white border-sand-200 shadow-soft-xs space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-medium">Active Disruptions</span>
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold font-serif text-charcoal-950">{activeCount}</p>
            <p className="text-[11px] text-rose-700 font-medium">Immediate Action</p>
          </Card>

          <Card className="p-4 bg-white border-sand-200 shadow-soft-xs space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-medium">Under Monitoring</span>
              <TrendingUp className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold font-serif text-charcoal-950">{monitoringCount}</p>
            <p className="text-[11px] text-amber-700 font-medium">Watch List</p>
          </Card>

          <Card className="p-4 bg-white border-sand-200 shadow-soft-xs space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-medium">Resolved Today</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold font-serif text-charcoal-950">{resolvedCount}</p>
            <p className="text-[11px] text-emerald-700 font-medium">Closed Cases</p>
          </Card>

          <Card className="p-4 bg-white border-sand-200 shadow-soft-xs space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-medium">Resolution Rate</span>
              <Zap className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold font-serif text-charcoal-950">98.5%</p>
            <p className="text-[11px] text-emerald-700 font-medium">Success Rate</p>
          </Card>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center bg-white p-3.5 rounded-xl border border-sand-200 shadow-soft-xs">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-charcoal-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by disruption title, tour ID, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-sand-50/50 border border-sand-200 rounded-lg text-xs text-charcoal-900 placeholder:text-muted-foreground focus:outline-hidden focus:border-terracotta-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 bg-sand-50/50 border border-sand-200 rounded-lg text-xs text-charcoal-900 focus:outline-hidden focus:border-terracotta-500"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Monitoring">Monitoring</option>
              <option value="Resolved">Resolved</option>
            </select>

            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-3 py-1.5 bg-sand-50/50 border border-sand-200 rounded-lg text-xs text-charcoal-900 focus:outline-hidden focus:border-terracotta-500"
            >
              <option value="All">All Severity</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        {/* Disruptions List */}
        <div className="space-y-4">
          {filteredDisruptions.map((disruption) => {
            const DisruptionIcon = getDisruptionIcon(disruption.type)
            return (
              <Card
                key={disruption.id}
                className={`p-5 bg-white border transition-all hover:shadow-soft-md ${
                  disruption.status === 'active' 
                    ? "border-rose-300 ring-1 ring-rose-300/50" 
                    : disruption.status === 'monitoring'
                    ? "border-amber-300"
                    : "border-sand-200"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    {/* Header */}
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        disruption.status === 'active' 
                          ? "bg-rose-50 text-rose-600" 
                          : disruption.status === 'monitoring'
                          ? "bg-amber-50 text-amber-600"
                          : "bg-emerald-50 text-emerald-600"
                      }`}>
                        <DisruptionIcon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-bold text-charcoal-900">{disruption.id}</span>
                          <Badge
                            variant="outline"
                            size="sm"
                            className={getSeverityColor(disruption.severity)}
                          >
                            {disruption.severity.charAt(0).toUpperCase() + disruption.severity.slice(1)}
                          </Badge>
                          <Badge
                            variant="outline"
                            size="sm"
                            className={getStatusColor(disruption.status)}
                          >
                            {disruption.status.charAt(0).toUpperCase() + disruption.status.slice(1)}
                          </Badge>
                        </div>
                        <h3 className="text-lg font-serif font-bold text-charcoal-950">
                          {disruption.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">{disruption.description}</p>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-sand-100">
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-muted-foreground block">Tour ID</span>
                        <span className="text-xs font-semibold text-charcoal-900">{disruption.tourId}</span>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-muted-foreground block">Detected At</span>
                        <span className="text-xs font-semibold text-charcoal-900">{disruption.detectedAt}</span>
                      </div>
                      {disruption.originalTime !== 'N/A' && (
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-muted-foreground block">Time Change</span>
                          <span className="text-xs font-semibold text-amber-700">
                            {disruption.originalTime} → {disruption.newTime}
                          </span>
                        </div>
                      )}
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-muted-foreground block">Resolution ETA</span>
                        <span className="text-xs font-semibold text-charcoal-900">{disruption.resolutionETA}</span>
                      </div>
                    </div>

                    {/* Affected Items */}
                    <div className="flex flex-wrap gap-1.5">
                      {disruption.affectedItems.map((item, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[10px] font-medium bg-sand-100 text-charcoal-700 border border-sand-200"
                        >
                          {item}
                        </span>
                      ))}
                    </div>

                    {/* Recovery Plan */}
                    {disruption.recoveryPlan && (
                      <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                        <div className="flex items-center gap-2 mb-1">
                          <Zap className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                            AI Recovery Plan
                          </span>
                        </div>
                        <p className="text-xs text-emerald-900">{disruption.recoveryPlan}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col items-center gap-2 shrink-0">
                    {disruption.status === 'active' && (
                      <Button
                        size="sm"
                        onClick={() => navigate(`/operator/tours/${disruption.tourId}`)}
                        className="bg-terracotta-600 hover:bg-terracotta-700 text-white text-xs shadow-soft-xs"
                        rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                      >
                        Resolve Now
                      </Button>
                    )}
                    {disruption.status === 'monitoring' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs bg-amber-50 border-amber-200 hover:bg-amber-100 text-amber-800"
                      >
                        Monitor
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/operator/tours/${disruption.tourId}`)}
                      className="text-xs bg-sand-50 border-sand-200 hover:bg-sand-100"
                    >
                      View Tour
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {filteredDisruptions.length === 0 && (
          <Card className="p-8 bg-white border-sand-200 shadow-soft-sm text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-charcoal-950 mb-1">No disruptions found</h3>
            <p className="text-sm text-muted-foreground">All systems are operating normally</p>
          </Card>
        )}
      </div>
    </PageTransition>
  )
}

export default OperatorDisruptions