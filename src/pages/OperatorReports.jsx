import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  BarChart3, TrendingUp, Users, CalendarCheck, AlertTriangle, 
  IndianRupee, Download, Filter, ArrowRight, Plane, MapPin, 
  Star, Clock, CheckCircle2, Activity, Target, Zap
} from 'lucide-react'
import { initialReports, initialBookings, initialDisruptions } from '@/data/operatorData'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import PageTransition from '@/components/motion/PageTransition'

export const OperatorReports = () => {
  const navigate = useNavigate()
  const [timeRange, setTimeRange] = useState("30")
  const [reportType, setReportType] = useState("overview")

  const renderRevenueChart = () => {
    const data = initialReports.revenue.revenueByDestination
    const maxValue = Math.max(...data.map(d => d.revenue))
    
    return (
      <div className="space-y-3">
        {data.map((item, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-charcoal-900">{item.destination}</span>
              <span className="font-bold text-charcoal-900">₹{item.revenue.toLocaleString('en-IN')}</span>
            </div>
            <div className="h-2 bg-sand-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-terracotta-500 rounded-full transition-all duration-500"
                style={{ width: `${(item.revenue / maxValue) * 100}%` }}
              />
            </div>
            <span className="text-[10px] text-muted-foreground">{item.percentage}% of total revenue</span>
          </div>
        ))}
      </div>
    )
  }

  const renderPerformanceMetrics = () => {
    const metrics = [
      { label: "On-Time Rate", value: initialReports.performance.onTimeRate, icon: Clock, color: "text-emerald-600" },
      { label: "Customer Satisfaction", value: initialReports.performance.customerSatisfaction, icon: Star, color: "text-amber-600" },
      { label: "Vendor Reliability", value: initialReports.performance.vendorReliability, icon: CheckCircle2, color: "text-emerald-600" },
      { label: "Disruption Resolution", value: initialReports.performance.disruptionResolutionRate, icon: Zap, color: "text-terracotta-600" },
      { label: "Avg Response Time", value: initialReports.performance.averageResponseTime, icon: Activity, color: "text-sky-600" }
    ]

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon
          return (
            <div key={idx} className="p-3 rounded-lg bg-sand-50 border border-sand-100 space-y-1">
              <div className="flex items-center gap-1.5">
                <Icon className={`w-3.5 h-3.5 ${metric.color}`} />
                <span className="text-[10px] text-muted-foreground">{metric.label}</span>
              </div>
              <span className="text-lg font-bold font-serif text-charcoal-950">{metric.value}</span>
            </div>
          )
        })}
      </div>
    )
  }

  const renderBookingStats = () => {
    const stats = [
      { label: "Total Bookings", value: initialReports.bookings.totalBookings, icon: CalendarCheck, change: "+12%" },
      { label: "Monthly Bookings", value: initialReports.bookings.monthlyBookings, icon: CalendarCheck, change: "+8%" },
      { label: "Cancellation Rate", value: `${initialReports.bookings.cancellationRate}%`, icon: AlertTriangle, change: "-2%" },
      { label: "Avg Booking Value", value: `₹${initialReports.bookings.averageBookingValue}`, icon: IndianRupee, change: "+15%" },
      { label: "Peak Month", value: initialReports.bookings.peakBookingMonth, icon: Target, change: "N/A" }
    ]

    return (
      <div className="space-y-2">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          const isPositive = stat.change !== "N/A" && (stat.change.startsWith('+') || stat.change.startsWith('-'))
          return (
            <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-sand-100">
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-medium text-charcoal-900">{stat.label}</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-charcoal-900 text-sm">{stat.value}</span>
                {stat.change !== "N/A" && (
                  <span className={`block text-[10px] font-semibold ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {stat.change}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const renderDisruptionStats = () => {
    const stats = [
      { label: "Total Disruptions", value: initialReports.disruptions.totalDisruptions, icon: AlertTriangle },
      { label: "Resolved", value: initialReports.disruptions.resolvedDisruptions, icon: CheckCircle2 },
      { label: "Active", value: initialReports.disruptions.activeDisruptions, icon: Activity },
      { label: "Avg Resolution Time", value: initialReports.disruptions.averageResolutionTime, icon: Clock }
    ]

    return (
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <div key={idx} className="p-3 rounded-lg bg-sand-50 border border-sand-100 space-y-1">
              <div className="flex items-center gap-1.5">
                <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">{stat.label}</span>
              </div>
              <span className="text-lg font-bold font-serif text-charcoal-950">{stat.value}</span>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <PageTransition>
      <div className="py-8 md:py-10 px-4 sm:px-6 lg:px-8 space-y-6 max-w-7xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-sand-200/80">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-terracotta-600">
                Analytics & Reports
              </span>
              <span className="text-xs text-muted-foreground">• Business Intelligence</span>
            </div>
            <h1 className="text-3xl font-bold font-serif text-charcoal-950">
              Operations Reports
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-600 mt-1">
              Comprehensive analytics and performance metrics for tour operations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-1.5 bg-white border border-sand-300 rounded-lg text-xs text-charcoal-900 focus:outline-hidden focus:border-terracotta-500"
            >
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
              <option value="365">Last Year</option>
            </select>
            <Button
              size="sm"
              variant="outline"
              className="text-xs bg-white border-sand-300 hover:bg-sand-100"
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Export Report
            </Button>
          </div>
        </div>

        {/* Main KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <Card className="p-4 bg-white border-sand-200 shadow-soft-xs space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-medium">Total Revenue</span>
              <IndianRupee className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold font-serif text-charcoal-950">
              {initialReports.revenue.totalRevenue.toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] text-emerald-700 font-medium">+{initialReports.revenue.growthRate}% growth</p>
          </Card>

          <Card className="p-4 bg-white border-sand-200 shadow-soft-xs space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-medium">Monthly Revenue</span>
              <TrendingUp className="w-4 h-4 text-terracotta-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold font-serif text-charcoal-950">
              {initialReports.revenue.monthlyRevenue.toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] text-emerald-700 font-medium">Current month</p>
          </Card>

          <Card className="p-4 bg-white border-sand-200 shadow-soft-xs space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-medium">Total Bookings</span>
              <CalendarCheck className="w-4 h-4 text-terracotta-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold font-serif text-charcoal-950">
              {initialReports.bookings.totalBookings}
            </p>
            <p className="text-[11px] text-emerald-700 font-medium">{initialReports.bookings.monthlyBookings} this month</p>
          </Card>

          <Card className="p-4 bg-white border-sand-200 shadow-soft-xs space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-medium">CSAT Score</span>
              <Star className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold font-serif text-charcoal-950">
              {initialReports.performance.customerSatisfaction}
            </p>
            <p className="text-[11px] text-emerald-700 font-medium">Customer satisfaction</p>
          </Card>
        </div>

        {/* Report Type Tabs */}
        <div className="flex items-center gap-2 border-b border-sand-200">
          {['overview', 'revenue', 'performance', 'bookings', 'disruptions'].map(type => (
            <button
              key={type}
              onClick={() => setReportType(type)}
              className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors ${
                reportType === type
                  ? "border-terracotta-500 text-terracotta-700"
                  : "border-transparent text-charcoal-600 hover:text-charcoal-900"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Report Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Analysis */}
          <Card className="p-5 bg-white border-sand-200 shadow-soft-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif font-bold text-base text-charcoal-950">
                Revenue by Destination
              </h3>
              <Badge variant="outline" size="sm" className="text-terracotta-700 bg-terracotta-50 border-terracotta-200">
                Top: {initialReports.revenue.topDestination}
              </Badge>
            </div>
            {renderRevenueChart()}
          </Card>

          {/* Performance Metrics */}
          <Card className="p-5 bg-white border-sand-200 shadow-soft-sm">
            <h3 className="font-serif font-bold text-base text-charcoal-950 mb-4">
              Performance Metrics
            </h3>
            {renderPerformanceMetrics()}
          </Card>

          {/* Booking Statistics */}
          <Card className="p-5 bg-white border-sand-200 shadow-soft-sm">
            <h3 className="font-serif font-bold text-base text-charcoal-950 mb-4">
              Booking Statistics
            </h3>
            {renderBookingStats()}
          </Card>

          {/* Disruption Analytics */}
          <Card className="p-5 bg-white border-sand-200 shadow-soft-sm">
            <h3 className="font-serif font-bold text-base text-charcoal-950 mb-4">
              Disruption Analytics
            </h3>
            {renderDisruptionStats()}
            <div className="mt-4 pt-4 border-t border-sand-100">
              <h4 className="text-xs font-semibold text-charcoal-900 mb-2">Common Disruption Types</h4>
              <div className="flex flex-wrap gap-1.5">
                {initialReports.disruptions.commonTypes.map((type, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded text-[10px] font-medium bg-rose-50 text-rose-700 border border-rose-200"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Activity Timeline */}
        <Card className="p-5 bg-white border-sand-200 shadow-soft-sm">
          <h3 className="font-serif font-bold text-base text-charcoal-950 mb-4">
            Recent Activity
          </h3>
          <div className="space-y-3">
            {[
              { action: "New booking received", detail: "GOA-2048 - Aryan & Riya Sharma", time: "2 hours ago", type: "booking" },
              { action: "Payment completed", detail: "₹21,000 via UPI for BK-2024-0892", time: "3 hours ago", type: "payment" },
              { action: "Disruption resolved", detail: "Guide schedule conflict for JAIPUR-1021", time: "5 hours ago", type: "disruption" },
              { action: "Vendor confirmed", detail: "Casa Sol Heritage Villa check-in", time: "6 hours ago", type: "vendor" },
              { action: "Tour completed", detail: "VARANASI-5012 - Spiritual Ghats Tour", time: "1 day ago", type: "tour" }
            ].map((activity, idx) => {
              const getIcon = (type) => {
                switch(type) {
                  case 'booking': return CalendarCheck
                  case 'payment': return IndianRupee
                  case 'disruption': return AlertTriangle
                  case 'vendor': return CheckCircle2
                  case 'tour': return Plane
                  default: return Activity
                }
              }
              const Icon = getIcon(activity.type)
              return (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-sand-50 border border-sand-100">
                  <div className="p-2 rounded-full bg-white border border-sand-200">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <span className="text-xs font-semibold text-charcoal-900">{activity.action}</span>
                    <span className="text-[10px] text-muted-foreground">{activity.detail}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">{activity.time}</span>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-5 bg-white border-sand-200 shadow-soft-sm">
          <h3 className="font-serif font-bold text-base text-charcoal-950 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate('/operator/bookings')}
              className="text-xs bg-sand-50 border-sand-200 hover:bg-sand-100 flex flex-col items-center gap-2 py-3"
            >
              <CalendarCheck className="w-5 h-5" />
              <span>View Bookings</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate('/operator/payments')}
              className="text-xs bg-sand-50 border-sand-200 hover:bg-sand-100 flex flex-col items-center gap-2 py-3"
            >
              <IndianRupee className="w-5 h-5" />
              <span>Manage Payments</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate('/operator/disruptions')}
              className="text-xs bg-sand-50 border-sand-200 hover:bg-sand-100 flex flex-col items-center gap-2 py-3"
            >
              <AlertTriangle className="w-5 h-5" />
              <span>Disruptions</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate('/operator/tours')}
              className="text-xs bg-sand-50 border-sand-200 hover:bg-sand-100 flex flex-col items-center gap-2 py-3"
            >
              <Plane className="w-5 h-5" />
              <span>Active Tours</span>
            </Button>
          </div>
        </Card>
      </div>
    </PageTransition>
  )
}

export default OperatorReports