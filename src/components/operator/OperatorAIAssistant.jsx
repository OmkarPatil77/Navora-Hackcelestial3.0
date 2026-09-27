import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bot, MessageSquare, X, Send, Sparkles, AlertTriangle, 
  CheckCircle2, Clock, TrendingUp, Lightbulb, Zap, 
  ArrowRight, ChevronUp, ChevronDown, MoreVertical
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useTripPlan } from '@/context/TripPlanningContext'

export const OperatorAIAssistant = () => {
  const { 
    activeDisruption, 
    disruptionAnalysis, 
    recoveryPlans, 
    appliedRecovery,
    itinerary,
    operatorVendors,
    operatorAttentionItems,
    journeyHealth,
    applyDisruptionRecovery,
    confirmOperatorVendor,
    triggerDisruption
  } = useTripPlan()

  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Hello! I'm your AI Operations Assistant. I'm here to help you manage disruptions, coordinate vendors, and optimize tour operations in real-time.",
      timestamp: new Date(),
      category: 'greeting'
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isOpen])

  // Proactive AI suggestions based on current state
  useEffect(() => {
    if (!isOpen) return

    const suggestActions = () => {
      const suggestions = []

      // Disruption alerts
      if (activeDisruption && !appliedRecovery) {
        suggestions.push({
          type: 'disruption',
          content: `⚠️ Active disruption detected: ${activeDisruption.reason}. I've analyzed ${disruptionAnalysis?.counts?.conflicts || 0} conflicts and ${disruptionAnalysis?.counts?.impacted || 0} impacted nodes. ${recoveryPlans?.length || 0} recovery strategies are ready for review.`,
          action: 'review_recovery',
          priority: 'high'
        })
      }

      // Vendor attention items
      const pendingVendors = operatorAttentionItems?.filter(item => item.status === 'pending') || []
      if (pendingVendors.length > 0) {
        suggestions.push({
          type: 'vendor',
          content: `📋 ${pendingVendors.length} vendor action${pendingVendors.length > 1 ? 's' : ''} pending confirmation. Quick response needed for optimal coordination.`,
          action: 'confirm_vendors',
          priority: 'medium'
        })
      }

      // Journey health alerts
      if (journeyHealth?.score < 80) {
        suggestions.push({
          type: 'health',
          content: `📊 Journey health score at ${journeyHealth?.score || 75}. ${journeyHealth?.risks?.[0] || 'Some optimization recommended'} for better traveler experience.`,
          action: 'optimize_journey',
          priority: 'medium'
        })
      }

      // Recovery applied confirmation
      if (appliedRecovery) {
        suggestions.push({
          type: 'success',
          content: `✅ Recovery plan "${appliedRecovery.title}" successfully applied. Itinerary adapted with ${appliedRecovery.flexibilityDelta || 0}min additional flexibility.`,
          action: 'review_adapted',
          priority: 'low'
        })
      }

      return suggestions
    }

    const suggestions = suggestActions()
    if (suggestions.length > 0 && messages[messages.length - 1]?.type !== 'ai') {
      const latestSuggestion = suggestions[0]
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now(),
          type: 'ai',
          content: latestSuggestion.content,
          timestamp: new Date(),
          category: latestSuggestion.type,
          action: latestSuggestion.action,
          priority: latestSuggestion.priority
        }])
      }, 1000)
    }
  }, [activeDisruption, appliedRecovery, operatorAttentionItems, journeyHealth, isOpen])

  const generateAIResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase()
    
    // Disruption-related queries
    if (lowerMessage.includes('disruption') || lowerMessage.includes('delay') || lowerMessage.includes('problem')) {
      if (activeDisruption) {
        return {
          content: `Current disruption: ${activeDisruption.reason}. Impact analysis shows ${disruptionAnalysis?.counts?.conflicts || 0} conflicts and ${disruptionAnalysis?.counts?.impacted || 0} impacted nodes. I recommend applying the "Balanced" recovery plan to minimize traveler impact while preserving key experiences.`,
          action: 'review_recovery'
        }
      } else {
        return {
          content: "No active disruptions detected. All tours are currently operating normally. I'll monitor for any issues and alert you immediately if something needs attention. Would you like me to simulate a disruption for testing?",
          action: 'simulate_disruption'
        }
      }
    }

    // Recovery-related queries
    if (lowerMessage.includes('recovery') || lowerMessage.includes('solution') || lowerMessage.includes('fix')) {
      if (recoveryPlans && recoveryPlans.length > 0) {
        const recommended = recoveryPlans.find(p => p.recommended) || recoveryPlans[0]
        return {
          content: `I have ${recoveryPlans.length} recovery strategies ready. Recommended: "${recommended.title}" - ${recommended.description}. This approach ${recommended.tags?.join(', ')}. Would you like me to apply this plan?`,
          action: 'apply_recovery',
          planId: recommended.id
        }
      } else {
        return {
          content: "No recovery plans currently available. Once a disruption is detected, I'll generate intelligent recovery options based on the impact analysis.",
          action: null
        }
      }
    }

    // Vendor-related queries
    if (lowerMessage.includes('vendor') || lowerMessage.includes('supplier') || lowerMessage.includes('partner')) {
      const pendingCount = operatorAttentionItems?.filter(item => item.status === 'pending').length || 0
      const confirmedCount = operatorVendors?.filter(v => v.status === 'confirmed').length || 0
      
      return {
        content: `Vendor status: ${confirmedCount} confirmed, ${pendingCount} pending action. ${pendingCount > 0 ? `I recommend confirming the pending vendors to ensure smooth operations. The most urgent is ${operatorAttentionItems[0]?.title || 'airport transfer'}.` : 'All vendors are confirmed and ready.'}`,
        action: pendingCount > 0 ? 'confirm_vendors' : null
      }
    }

    // Tour-related queries
    if (lowerMessage.includes('tour') || lowerMessage.includes('trip') || lowerMessage.includes('booking')) {
      return {
        content: `You have 12 active tours currently in operation. Journey health score is ${journeyHealth?.score || 92}/100. All tours are on schedule except for any active disruptions. Would you like me to provide details on a specific tour?`,
        action: 'view_tours'
      }
    }

    // Health-related queries
    if (lowerMessage.includes('health') || lowerMessage.includes('status') || lowerMessage.includes('performance')) {
      return {
        content: `Current journey health: ${journeyHealth?.score || 92}/100 (${journeyHealth?.status?.label || 'Excellent'}). Key metrics: Schedule resilience ${journeyHealth?.scheduleResilience || 92}%, Budget health ${journeyHealth?.budgetHealth || 95}%, Experience balance ${journeyHealth?.experienceBalance || 90}%. ${journeyHealth?.score < 80 ? 'Some optimization recommended.' : 'All systems performing optimally.'}`,
        action: journeyHealth?.score < 80 ? 'optimize_journey' : null
      }
    }

    // Help-related queries
    if (lowerMessage.includes('help') || lowerMessage.includes('assist') || lowerMessage.includes('what can you')) {
      return {
        content: "I can help you with: disruption analysis & recovery, vendor coordination, journey health monitoring, tour optimization, and real-time decision support. Just ask me about any operational aspect, and I'll provide data-driven recommendations.",
        action: null
      }
    }

    // Default response
    return {
      content: "I understand you're asking about operations. Based on current data, I can provide insights on disruptions, vendors, tours, or journey health. Could you be more specific about what you'd like to know?",
      action: null
    }
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue)
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponse.content,
        timestamp: new Date(),
        action: aiResponse.action,
        planId: aiResponse.planId
      }])
      setIsTyping(false)
    }, 1000 + Math.random() * 500)
  }

  const handleActionClick = (action, planId) => {
    // Execute actual actions
    if (action === 'apply_recovery' && planId && recoveryPlans) {
      const plan = recoveryPlans.find(p => p.id === planId)
      if (plan) {
        applyDisruptionRecovery(planId)
      }
    }
    
    if (action === 'simulate_disruption') {
      triggerDisruption(90)
    }

    const actionMessages = {
      'review_recovery': "I'll navigate you to the recovery options panel where you can review and apply the best strategy.",
      'apply_recovery': `✅ I've applied the recovery plan. The itinerary has been updated and all affected vendors have been notified of the schedule changes.`,
      'confirm_vendors': "I'll help you confirm the pending vendors. Let me navigate you to the vendor coordination panel.",
      'optimize_journey': "I'll analyze the journey and suggest optimizations to improve the health score.",
      'review_adapted': "Great! The adapted itinerary is working well. Travelers should experience minimal disruption.",
      'view_tours': "I'll show you the current tour operations roster with real-time status updates.",
      'simulate_disruption': "✅ I've simulated a 90-minute flight delay. The disruption analysis is complete and recovery plans are ready for your review."
    }

    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'ai',
      content: actionMessages[action] || "Processing your request...",
      timestamp: new Date()
    }])
  }

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'disruption': return AlertTriangle
      case 'vendor': return Bot
      case 'health': return TrendingUp
      case 'success': return CheckCircle2
      case 'greeting': return Sparkles
      default: return Lightbulb
    }
  }

  const getCategoryColor = (category) => {
    switch(category) {
      case 'disruption': return 'text-rose-600 bg-rose-50 border-rose-200'
      case 'vendor': return 'text-sky-600 bg-sky-50 border-sky-200'
      case 'health': return 'text-amber-600 bg-amber-50 border-amber-200'
      case 'success': return 'text-emerald-600 bg-emerald-50 border-emerald-200'
      case 'greeting': return 'text-terracotta-600 bg-terracotta-50 border-terracotta-200'
      default: return 'text-charcoal-600 bg-sand-50 border-sand-200'
    }
  }

  const getPriorityBadge = (priority) => {
    switch(priority) {
      case 'high': return <Badge variant="danger" size="sm">Urgent</Badge>
      case 'medium': return <Badge variant="outline" size="sm">Important</Badge>
      case 'low': return <Badge variant="default" size="sm">Info</Badge>
      default: return null
    }
  }

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full shadow-soft-xl ${
            isOpen 
              ? 'bg-charcoal-900 text-white hover:bg-charcoal-800' 
              : 'bg-terracotta-600 text-white hover:bg-terracotta-700'
          }`}
          size="icon"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
        </Button>

        {/* Unread indicator */}
        {!isOpen && activeDisruption && !appliedRecovery && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
        )}
      </motion.div>

      {/* AI Assistant Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)]"
          >
            <Card className="bg-white border-sand-200 shadow-soft-xl overflow-hidden">
              {/* Header */}
              <div className="p-4 border-b border-sand-100 bg-gradient-to-r from-terracotta-50 to-sand-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-terracotta-100 text-terracotta-600">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-charcoal-950 text-sm">AI Operations Assistant</h3>
                      <div className="flex items-center gap-1.5">
                        <span className="flex h-2 w-2 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-[10px] text-muted-foreground">Real-time Active</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setIsMinimized(!isMinimized)}
                      className="h-8 w-8 text-charcoal-500 hover:text-charcoal-900"
                    >
                      {isMinimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              {!isMinimized && (
                <div className="h-80 overflow-y-auto p-4 space-y-3 bg-sand-50/30">
                  {messages.map((message) => {
                    const CategoryIcon = getCategoryIcon(message.category)
                    return (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-2 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        {message.type === 'ai' && (
                          <div className={`p-2 rounded-lg ${getCategoryColor(message.category)} border shrink-0`}>
                            <CategoryIcon className="w-4 h-4" />
                          </div>
                        )}
                        <div className={`max-w-[80%] ${message.type === 'user' ? 'order-1' : ''}`}>
                          <div className={`p-3 rounded-lg ${
                            message.type === 'user'
                              ? 'bg-terracotta-600 text-white'
                              : 'bg-white border border-sand-200 text-charcoal-900'
                          }`}>
                            <p className="text-xs leading-relaxed whitespace-pre-wrap">{message.content}</p>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-muted-foreground">
                              {message.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {message.priority && getPriorityBadge(message.priority)}
                          </div>
                          {message.action && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleActionClick(message.action, message.planId)}
                              className="mt-2 text-xs bg-white border-sand-200 hover:bg-sand-100"
                              rightIcon={<ArrowRight className="w-3 h-3" />}
                            >
                              {message.action === 'review_recovery' && 'Review Recovery'}
                              {message.action === 'apply_recovery' && 'Apply Plan'}
                              {message.action === 'confirm_vendors' && 'Confirm Vendors'}
                              {message.action === 'optimize_journey' && 'Optimize Journey'}
                              {message.action === 'review_adapted' && 'View Details'}
                              {message.action === 'view_tours' && 'View Tours'}
                              {message.action === 'simulate_disruption' && 'Simulate Disruption'}
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    )
                  })}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-2"
                    >
                      <div className="p-2 rounded-lg bg-sand-100 border border-sand-200">
                        <Bot className="w-4 h-4 text-charcoal-400" />
                      </div>
                      <div className="bg-white border border-sand-200 p-3 rounded-lg">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-charcoal-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 bg-charcoal-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 bg-charcoal-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}

              {/* Input Area */}
              {!isMinimized && (
                <div className="p-4 border-t border-sand-100 bg-white">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Ask about disruptions, vendors, tours..."
                      className="flex-1 px-3 py-2 bg-sand-50 border border-sand-200 rounded-lg text-xs text-charcoal-900 placeholder:text-muted-foreground focus:outline-hidden focus:border-terracotta-500 focus:bg-white"
                    />
                    <Button
                      size="icon"
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isTyping}
                      className="bg-terracotta-600 hover:bg-terracotta-700 text-white"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Lightbulb className="w-3 h-3 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground">
                      Try: "What's the current disruption status?" or "Help me with vendor coordination"
                    </span>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default OperatorAIAssistant