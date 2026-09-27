import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  CalendarCheck, Search, Filter, ArrowRight, Download, Eye, 
  CheckCircle2, Clock, AlertCircle, IndianRupee, Users, MapPin 
} from 'lucide-react'
import { initialBookings } from '@/data/operatorData'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { StatusIndicator } from '@/components/ui/StatusIndicator'
import PageTransition from '@/components/motion/PageTransition'

export const OperatorBookings = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [paymentFilter, setPaymentFilter] = useState("All")

  const filteredBookings = initialBookings.filter(booking => {
    const matchesSearch = booking.travelersName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          booking.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          booking.tourId.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "All" || booking.bookingStatus === statusFilter.toLowerCase()
    const matchesPayment = paymentFilter === "All" || booking.paymentStatus === paymentFilter.toLowerCase()

    return matchesSearch && matchesStatus && matchesPayment
  })

  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return 'text-emerald-700 bg-emerald-50 border-emerald-200'
      case 'pending': return 'text-amber-700 bg-amber-50 border-amber-200'
      case 'cancelled': return 'text-rose-700 bg-rose-50 border-rose-200'
      default: return 'text-charcoal-700 bg-sand-50 border-sand-200'
    }
  }

  const getPaymentStatusColor = (status) => {
    switch(status) {
      case 'paid': return 'text-emerald-700 bg-emerald-50 border-emerald-200'
      case 'partial': return 'text-amber-700 bg-amber-50 border-amber-200'
      case 'pending': return 'text-rose-700 bg-rose-50 border-rose-200'
      default: return 'text-charcoal-700 bg-sand-50 border-sand-200'
    }
  }

  return (
    <PageTransition>
      <div className="py-8 md:py-10 px-4 sm:px-6 lg:px-8 space-y-6 max-w-7xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-sand-200/80">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-terracotta-600">
                Booking Management
              </span>
              <span className="text-xs text-muted-foreground">• Reservation Portal</span>
            </div>
            <h1 className="text-3xl font-bold font-serif text-charcoal-950">
              Tour Bookings
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-600 mt-1">
              Manage tour reservations, track payments, and handle special requests.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="text-xs bg-white border-sand-300 hover:bg-sand-100"
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Export Data
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <Card className="p-4 bg-white border-sand-200 shadow-soft-xs space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-medium">Total Bookings</span>
              <CalendarCheck className="w-4 h-4 text-terracotta-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold font-serif text-charcoal-950">{initialBookings.length}</p>
            <p className="text-[11px] text-emerald-700 font-medium">Active Reservations</p>
          </Card>

          <Card className="p-4 bg-white border-sand-200 shadow-soft-xs space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-medium">Confirmed</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold font-serif text-charcoal-950">
              {initialBookings.filter(b => b.bookingStatus === 'confirmed').length}
            </p>
            <p className="text-[11px] text-emerald-700 font-medium">Ready to Travel</p>
          </Card>

          <Card className="p-4 bg-white border-sand-200 shadow-soft-xs space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-medium">Pending</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold font-serif text-charcoal-950">
              {initialBookings.filter(b => b.bookingStatus === 'pending').length}
            </p>
            <p className="text-[11px] text-amber-700 font-medium">Awaiting Confirmation</p>
          </Card>

          <Card className="p-4 bg-white border-sand-200 shadow-soft-xs space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-medium">Total Revenue</span>
              <IndianRupee className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold font-serif text-charcoal-950">
              {initialBookings.reduce((acc, b) => acc + b.paidAmount, 0).toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] text-emerald-700 font-medium">Collected Amount</p>
          </Card>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center bg-white p-3.5 rounded-xl border border-sand-200 shadow-soft-xs">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-charcoal-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by booking ID, guest name, or destination..."
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
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="px-3 py-1.5 bg-sand-50/50 border border-sand-200 rounded-lg text-xs text-charcoal-900 focus:outline-hidden focus:border-terracotta-500"
            >
              <option value="All">All Payments</option>
              <option value="Paid">Paid</option>
              <option value="Partial">Partial</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>

        {/* Bookings Table */}
        <Card className="bg-white border-sand-200 shadow-soft-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-sand-200/80 text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-sand-50/50">
                  <th className="py-3 px-4">Booking ID</th>
                  <th className="py-3 px-4">Travelers</th>
                  <th className="py-3 px-4">Destination</th>
                  <th className="py-3 px-4">Travel Dates</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-sand-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        <span className="font-mono font-bold text-charcoal-900">{booking.id}</span>
                        <span className="block text-[10px] text-muted-foreground">{booking.bookingDate}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        <span className="font-semibold text-charcoal-900">{booking.travelersName}</span>
                        <span className="block text-[10px] text-muted-foreground flex items-center gap-1">
                          <Users className="w-3 h-3" /> {booking.travelersCount} Pax
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        <span className="font-semibold text-charcoal-900">{booking.destination}</span>
                        <span className="block text-[10px] text-muted-foreground">{booking.source}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-charcoal-700">{booking.travelDates}</span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        <span className="font-bold text-charcoal-900">₹{booking.totalAmount.toLocaleString('en-IN')}</span>
                        <span className="block text-[10px] text-muted-foreground">
                          ₹{booking.paidAmount.toLocaleString('en-IN')} paid
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <Badge
                        variant="outline"
                        size="sm"
                        className={getPaymentStatusColor(booking.paymentStatus)}
                      >
                        {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                      </Badge>
                    </td>

                    <td className="py-3 px-4">
                      <Badge
                        variant="outline"
                        size="sm"
                        className={getStatusColor(booking.bookingStatus)}
                      >
                        {booking.bookingStatus.charAt(0).toUpperCase() + booking.bookingStatus.slice(1)}
                      </Badge>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/operator/tours/${booking.tourId}`)}
                          className="text-xs bg-sand-50 border-sand-200 hover:bg-sand-100"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => navigate(`/operator/tours/${booking.tourId}`)}
                          className="text-xs bg-charcoal-900 text-white hover:bg-charcoal-800"
                          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                        >
                          View
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {filteredBookings.length === 0 && (
          <Card className="p-8 bg-white border-sand-200 shadow-soft-sm text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-charcoal-950 mb-1">No bookings found</h3>
            <p className="text-sm text-muted-foreground">Try adjusting your search or filter criteria</p>
          </Card>
        )}
      </div>
    </PageTransition>
  )
}

export default OperatorBookings