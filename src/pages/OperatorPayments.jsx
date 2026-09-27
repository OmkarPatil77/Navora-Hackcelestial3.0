import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  CreditCard, Search, Filter, Download, ArrowRight, IndianRupee, 
  CheckCircle2, Clock, AlertCircle, Calendar, Receipt, 
  Building2, Smartphone, Wallet, TrendingUp
} from 'lucide-react'
import { initialPayments, initialBookings } from '@/data/operatorData'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { StatusIndicator } from '@/components/ui/StatusIndicator'
import PageTransition from '@/components/motion/PageTransition'

export const OperatorPayments = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [methodFilter, setMethodFilter] = useState("All")

  const getPaymentMethodIcon = (method) => {
    switch(method) {
      case 'UPI': return Smartphone
      case 'Credit Card': return CreditCard
      case 'Bank Transfer': return Building2
      case 'Cash': return Wallet
      default: return Receipt
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'text-emerald-700 bg-emerald-50 border-emerald-200'
      case 'pending': return 'text-amber-700 bg-amber-50 border-amber-200'
      case 'failed': return 'text-rose-700 bg-rose-50 border-rose-200'
      default: return 'text-charcoal-700 bg-sand-50 border-sand-200'
    }
  }

  const filteredPayments = initialPayments.filter(payment => {
    const matchesSearch = payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          payment.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          payment.tourId.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "All" || payment.status === statusFilter.toLowerCase()
    const matchesMethod = methodFilter === "All" || payment.paymentMethod === methodFilter

    return matchesSearch && matchesStatus && matchesMethod
  })

  const totalRevenue = initialPayments.filter(p => p.status === 'completed').reduce((acc, p) => acc + p.amount, 0)
  const pendingAmount = initialPayments.filter(p => p.status === 'pending').reduce((acc, p) => acc + p.amount, 0)
  const completedPayments = initialPayments.filter(p => p.status === 'completed').length
  const pendingPayments = initialPayments.filter(p => p.status === 'pending').length

  return (
    <PageTransition>
      <div className="py-8 md:py-10 px-4 sm:px-6 lg:px-8 space-y-6 max-w-7xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-sand-200/80">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-terracotta-600">
                Payment Management
              </span>
              <span className="text-xs text-muted-foreground">• Financial Operations</span>
            </div>
            <h1 className="text-3xl font-bold font-serif text-charcoal-950">
              Payments & Transactions
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-600 mt-1">
              Track payments, manage invoices, and monitor financial transactions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="text-xs bg-white border-sand-300 hover:bg-sand-100"
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Export Report
            </Button>
            <Button
              size="sm"
              className="bg-terracotta-600 hover:bg-terracotta-700 text-white text-xs shadow-soft-xs"
              leftIcon={<Receipt className="w-3.5 h-3.5" />}
            >
              Generate Invoice
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <Card className="p-4 bg-white border-sand-200 shadow-soft-xs space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-medium">Total Revenue</span>
              <IndianRupee className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold font-serif text-charcoal-950">
              {totalRevenue.toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] text-emerald-700 font-medium">Collected Amount</p>
          </Card>

          <Card className="p-4 bg-white border-sand-200 shadow-soft-xs space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-medium">Pending Amount</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold font-serif text-charcoal-950">
              {pendingAmount.toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] text-amber-700 font-medium">Awaiting Payment</p>
          </Card>

          <Card className="p-4 bg-white border-sand-200 shadow-soft-xs space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-medium">Completed</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold font-serif text-charcoal-950">{completedPayments}</p>
            <p className="text-[11px] text-emerald-700 font-medium">Successful Transactions</p>
          </Card>

          <Card className="p-4 bg-white border-sand-200 shadow-soft-xs space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-medium">Pending</span>
              <AlertCircle className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold font-serif text-charcoal-950">{pendingPayments}</p>
            <p className="text-[11px] text-amber-700 font-medium">Awaiting Processing</p>
          </Card>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center bg-white p-3.5 rounded-xl border border-sand-200 shadow-soft-xs">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-charcoal-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by transaction ID, booking ID, or tour ID..."
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
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>

            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="px-3 py-1.5 bg-sand-50/50 border border-sand-200 rounded-lg text-xs text-charcoal-900 focus:outline-hidden focus:border-terracotta-500"
            >
              <option value="All">All Methods</option>
              <option value="UPI">UPI</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cash">Cash</option>
            </select>
          </div>
        </div>

        {/* Payments Table */}
        <Card className="bg-white border-sand-200 shadow-soft-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-sand-200/80 text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-sand-50/50">
                  <th className="py-3 px-4">Transaction ID</th>
                  <th className="py-3 px-4">Booking ID</th>
                  <th className="py-3 px-4">Tour ID</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100">
                {filteredPayments.map((payment) => {
                  const MethodIcon = getPaymentMethodIcon(payment.paymentMethod)
                  return (
                    <tr key={payment.id} className="hover:bg-sand-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <span className="font-mono font-bold text-charcoal-900">{payment.id}</span>
                          {payment.transactionId !== 'N/A' && (
                            <span className="block text-[10px] text-muted-foreground">{payment.transactionId}</span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-mono text-charcoal-900">{payment.bookingId}</span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-semibold text-charcoal-900">{payment.tourId}</span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-bold text-charcoal-900">₹{payment.amount.toLocaleString('en-IN')}</span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <MethodIcon className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="text-charcoal-700">{payment.paymentMethod}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="text-charcoal-700">{payment.paymentDate}</span>
                      </td>

                      <td className="py-3 px-4">
                        <Badge
                          variant="outline"
                          size="sm"
                          className="text-charcoal-700 bg-sand-50 border-sand-200"
                        >
                          {payment.paymentType.charAt(0).toUpperCase() + payment.paymentType.slice(1)}
                        </Badge>
                      </td>

                      <td className="py-3 px-4">
                        <Badge
                          variant="outline"
                          size="sm"
                          className={getStatusColor(payment.status)}
                        >
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </Badge>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs bg-sand-50 border-sand-200 hover:bg-sand-100"
                          >
                            <Receipt className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => navigate(`/operator/tours/${payment.tourId}`)}
                            className="text-xs bg-charcoal-900 text-white hover:bg-charcoal-800"
                            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                          >
                            View
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {filteredPayments.length === 0 && (
          <Card className="p-8 bg-white border-sand-200 shadow-soft-sm text-center">
            <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-charcoal-950 mb-1">No payments found</h3>
            <p className="text-sm text-muted-foreground">Try adjusting your search or filter criteria</p>
          </Card>
        )}

        {/* Payment Summary by Tour */}
        <Card className="p-5 bg-white border-sand-200 shadow-soft-sm">
          <h3 className="font-serif font-bold text-base text-charcoal-950 mb-4">
            Payment Summary by Tour
          </h3>
          <div className="space-y-3">
            {initialBookings.map(booking => (
              <div key={booking.id} className="flex items-center justify-between p-3 rounded-lg bg-sand-50 border border-sand-100">
                <div className="space-y-0.5">
                  <span className="font-semibold text-charcoal-900">{booking.travelersName}</span>
                  <span className="block text-[10px] text-muted-foreground">{booking.tourId} • {booking.destination}</span>
                </div>
                <div className="text-right space-y-0.5">
                  <span className="font-bold text-charcoal-900">₹{booking.paidAmount.toLocaleString('en-IN')} / ₹{booking.totalAmount.toLocaleString('en-IN')}</span>
                  <span className="block text-[10px] text-muted-foreground">
                    {Math.round((booking.paidAmount / booking.totalAmount) * 100)}% paid
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageTransition>
  )
}

export default OperatorPayments