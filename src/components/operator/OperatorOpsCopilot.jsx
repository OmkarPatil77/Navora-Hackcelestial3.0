import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bot, Sparkles, Send, X, ShieldCheck, Check, 
  Store, AlertTriangle, ArrowRight, RefreshCw, UserCheck 
} from 'lucide-react'
import { useTripPlan } from '@/context/TripPlanningContext'
import { isGeminiConfigured, sendCopilotMessage, buildCopilotContext } from '@/services/geminiService'
import { executeOperatorAction } from '@/services/operatorActionExecutor'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

export const OperatorOpsCopilot = () => {
  const context = useTripPlan()
  const {
    tripPreferences,
    selectedExperiences,
    itinerary,
    activeDisruption,
    disruptionAnalysis,
    recoveryPlans,
    appliedRecovery,
    operatorVendors,
    operatorAttentionItems,
    confirmOperatorVendor,
    resolveOperatorAttentionItem,
    sendOperatorTravelerNotification,
    applyDisruptionRecovery,
    addOperatorEvent,
    journeyHealth,
    journeyMemory
  } = context

  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [isThinking, setIsThinking] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: "ops-welcome",
      role: "assistant",
      text: "Hello Dispatcher! I am **TripSaathi Ops Copilot**.\n\nI am monitoring 12 active tours, vendor dispatch schedules, and live anomaly streams with real-time operational health assessment. How can I assist your operations today?",
      highlights: ["Fleet Context Active", "Health Telemetry Sync", "Zero-Latency Anomaly Traversal"],
      source: "TripSaathi Deterministic Engine"
    }
  ])

  const messagesEndRef = useRef(null)
  const isAiActive = isGeminiConfigured()

  const quickPrompts = [
    { label: "How healthy is this tour?", query: "How healthy is this tour?" },
    { label: "Why was scuba replaced?", query: "Why was scuba replaced on Tour GOA-2048?" },
    { label: "What risks remain?", query: "What operational risks remain for this journey?" },
    { label: "Summarize today's operations", query: "Summarize today's fleet operations" },
    { label: "Which vendors need action?", query: "Which vendors need action for the Goa disruption?" },
    { label: "Prepare a traveler update", query: "Prepare a traveler update notification for Tour GOA-2048" },
    { label: "Show lowest-cost recovery", query: "Show me the lowest-cost recovery strategy" }
  ]

  // Auto-scroll
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isThinking, isOpen])

  const contextMethods = {
    confirmOperatorVendor,
    resolveOperatorAttentionItem,
    sendOperatorTravelerNotification,
    applyDisruptionRecovery,
    addOperatorEvent
  }

  const handleSendMessage = async (textToSend) => {
    const userQuery = textToSend || inputValue.trim()
    if (!userQuery || isThinking) return

    const userMsg = {
      id: `ops-user-${Date.now()}`,
      role: "user",
      text: userQuery
    }

    setMessages(prev => [...prev, userMsg])
    setInputValue("")
    setIsThinking(true)

    const copilotContext = buildCopilotContext(
      tripPreferences,
      selectedExperiences,
      itinerary,
      "/operator",
      { activeDisruption, disruptionAnalysis, appliedRecovery, recoveryPlans },
      journeyHealth,
      journeyMemory
    )

    try {
      const response = await sendCopilotMessage(userQuery, copilotContext, messages)

      const assistantMsg = {
        id: `ops-assistant-${Date.now()}`,
        role: "assistant",
        text: response.message || "I have analyzed your operational request.",
        actions: response.actions || [],
        highlights: response.highlights || [],
        source: response.source,
        fallbackNotice: response.fallbackNotice
      }

      setMessages(prev => [...prev, assistantMsg])
    } catch (e) {
      console.error("Ops Copilot Error:", e)
      setMessages(prev => [
        ...prev,
        {
          id: `ops-err-${Date.now()}`,
          role: "assistant",
          text: "TripSaathi Ops Engine is operating in guarded local mode. All fleet records and vendor allocations remain protected.",
          highlights: ["Local Ops Engine Guarded"]
        }
      ])
    } finally {
      setIsThinking(false)
    }
  }

  const handleApplyAction = (action, messageId) => {
    const result = executeOperatorAction(action, contextMethods, context)

    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        return {
          ...msg,
          actionApplied: true,
          actionResultText: result.message
        }
      }
      return msg
    }))
  }

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-charcoal-900 text-white shadow-soft-md border border-charcoal-700 hover:bg-charcoal-950 transition-all select-none"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-terracotta-600 text-white">
            <Bot className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-xs tracking-wide">Ops Assistant</span>
          {activeDisruption && (
            <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[10px] font-bold">
              1 Alert
            </span>
          )}
        </motion.button>
      </div>

      {/* Slide-out Drawer / Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end p-0 sm:p-6 pointer-events-none">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-charcoal-950/30 backdrop-blur-xs pointer-events-auto"
            />

            {/* Chat Container */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="relative z-50 w-full sm:max-w-md h-[88vh] sm:h-[620px] bg-white rounded-t-2xl sm:rounded-2xl border border-sand-200 shadow-soft-2xl flex flex-col pointer-events-auto overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-sand-100 bg-sand-50/60 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-charcoal-900 text-white shadow-soft-xs">
                    <Bot className="w-4 h-4 text-terracotta-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-serif font-bold text-sm text-charcoal-950">
                        TripSaathi Ops Copilot
                      </h3>
                      <Badge variant="spark" size="sm">
                        {isAiActive ? "Gemini Ops" : "Demo Engine"}
                      </Badge>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      Real-time tour operations & constraint solver
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:bg-sand-200 hover:text-charcoal-900 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
                {messages.map((msg) => {
                  const isUser = msg.role === 'user'

                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-2`}
                    >
                      <div
                        className={`p-3.5 rounded-2xl max-w-[88%] leading-relaxed ${
                          isUser
                            ? 'bg-charcoal-900 text-white rounded-tr-none'
                            : 'bg-sand-50/90 text-charcoal-900 border border-sand-200 rounded-tl-none space-y-2 shadow-soft-xs'
                        }`}
                      >
                        <div className="whitespace-pre-wrap font-sans text-xs">
                          {msg.text}
                        </div>

                        {/* Highlights */}
                        {msg.highlights?.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1.5 border-t border-sand-200/60">
                            {msg.highlights.map((h, i) => (
                              <span key={i} className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-white border border-sand-200 text-charcoal-700">
                                {h}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* AI Provenance / Source Metadata */}
                        {!isUser && msg.source && (
                          <div className="flex items-center gap-1 text-[10px] text-charcoal-400 italic pt-1">
                            <Sparkles className="w-2.5 h-2.5 text-terracotta-500" />
                            <span>{msg.source}</span>
                          </div>
                        )}

                        {/* Action Buttons proposed by AI */}
                        {msg.actions?.length > 0 && !msg.actionApplied && (
                          <div className="pt-2 border-t border-sand-200/80 space-y-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta-700 block">
                              Proposed Action:
                            </span>
                            {msg.actions.map((act, actIdx) => (
                              <Button
                                key={actIdx}
                                size="sm"
                                onClick={() => handleApplyAction(act, msg.id)}
                                className="w-full text-xs bg-terracotta-600 hover:bg-terracotta-700 text-white shadow-soft-xs"
                                leftIcon={<Sparkles className="w-3.5 h-3.5" />}
                              >
                                {act.type === 'CONFIRM_VENDOR' ? "Confirm Vendor Dispatch" :
                                 act.type === 'PREPARE_NOTIFICATION' ? "Dispatch Traveler Notification" :
                                 act.type === 'APPLY_RECOVERY' ? "Apply Balanced Recovery" :
                                 "Execute Proposed Action"}
                              </Button>
                            ))}
                          </div>
                        )}

                        {msg.actionApplied && (
                          <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-medium flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{msg.actionResultText || "Action executed successfully."}</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )
                })}

                {isThinking && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground italic p-2 bg-sand-50 rounded-lg w-fit">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-terracotta-600" />
                    <span>Ops Copilot querying fleet state...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts */}
              <div className="px-3 py-2 bg-sand-50/50 border-t border-sand-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {quickPrompts.map((qp, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(qp.query)}
                    className="px-2.5 py-1 rounded-full bg-white border border-sand-200 text-[11px] font-medium text-charcoal-700 hover:border-terracotta-400 hover:text-terracotta-700 shrink-0 transition-colors shadow-soft-xs"
                  >
                    {qp.label}
                  </button>
                ))}
              </div>

              {/* Input Box */}
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSendMessage()
                }}
                className="p-3 border-t border-sand-100 bg-white flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask Ops Copilot about tours, vendors, or disruptions..."
                  className="flex-1 px-3 py-2 rounded-xl border border-sand-200 bg-sand-50/40 text-xs focus:outline-hidden focus:border-terracotta-500 focus:bg-white"
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={!inputValue.trim() || isThinking}
                  className="bg-charcoal-900 text-white hover:bg-charcoal-800 p-2"
                >
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
