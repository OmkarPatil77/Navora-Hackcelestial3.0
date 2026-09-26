import React, { useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, Send, X, Bot, User, Check, 
  ArrowRight, ShieldCheck, RefreshCw, Plus, 
  Wallet, Clock, MapPin, AlertCircle, MessageSquare 
} from 'lucide-react'
import { useTripPlan } from '@/context/TripPlanningContext'
import { isGeminiConfigured, buildCopilotContext, sendCopilotMessage } from '@/services/geminiService'
import { executeAiAction } from '@/services/aiActionExecutor'
import { goaExperiences, allExperiences } from '@/data/experiences'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency } from '@/lib/utils'

export const TripSaathiCopilot = () => {
  const location = useLocation()
  const context = useTripPlan()
  const {
    tripPreferences,
    selectedExperiences,
    itinerary,
    activeDisruption,
    disruptionAnalysis,
    recoveryPlans,
    appliedRecovery,
    applyDisruptionRecovery,
    addExperience,
    removeExperience,
    replaceExperience,
    setBudget,
    setTravelStyle,
    regenerateSingleDay,
    regenerateFullItinerary,
    journeyHealth,
    journeyMemory
  } = context

  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [isThinking, setIsThinking] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: "msg-welcome",
      role: "assistant",
      text: "Hello! I am **TripSaathi AI**.\n\nI have loaded your complete journey blueprint, preferences, live schedule, and trip health metrics. Ask me anything or explore explanations below.",
      highlights: ["Context Loaded", "Health Telemetry Sync"],
      source: "TripSaathi Deterministic Engine"
    }
  ])

  const messagesEndRef = useRef(null)
  const isAiActive = isGeminiConfigured()

  const defaultQuickPrompts = [
    { label: "How is my trip health?", query: "How is my trip health?" },
    { label: "What did you learn?", query: "What did you learn about my preferences?" },
    { label: "Why recommend these?", query: "Why do you recommend these experiences?" },
    { label: "Make Day 2 relaxed", query: "Make Day 2 more relaxed" },
    { label: "Find more food", query: "Find more local food experiences" },
    { label: "What's flexible?", query: "What's flexible in my itinerary and what's fixed?" }
  ]

  const disruptionQuickPrompts = [
    { label: "Why was scuba replaced?", query: "Why was scuba replaced?" },
    { label: "How is my trip health?", query: "How is my trip health?" },
    { label: "Why is sunset cruise safe?", query: "Why is the sunset cruise unchanged?" },
    { label: "Recover My Trip ✦", query: "Recover my trip and recommend the best plan" },
    { label: "Show lowest-cost plan", query: "Show me the lowest-cost recovery strategy" }
  ]

  const quickPrompts = activeDisruption ? disruptionQuickPrompts : defaultQuickPrompts

  // Auto-scroll on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isThinking, isOpen])

  // Context methods for action executor
  const contextMethods = {
    addExperience,
    removeExperience,
    replaceExperience,
    setBudget,
    setTravelStyle,
    regenerateSingleDay,
    regenerateFullItinerary
  }

  const handleSendMessage = async (textToSend) => {
    const userQuery = textToSend || inputValue.trim()
    if (!userQuery || isThinking) return

    // 1. Append user message
    const userMsg = {
      id: `user-${Date.now()}`,
      role: "user",
      text: userQuery
    }

    setMessages(prev => [...prev, userMsg])
    setInputValue("")
    setIsThinking(true)

    // 2. Build compact context payload
    const copilotContext = buildCopilotContext(
      tripPreferences,
      selectedExperiences,
      itinerary,
      location.pathname,
      { activeDisruption, disruptionAnalysis, appliedRecovery, recoveryPlans },
      journeyHealth,
      journeyMemory
    )

    // 3. Send to Gemini / Demo Intelligence
    try {
      const response = await sendCopilotMessage(userQuery, copilotContext, messages)
      
      const assistantMsg = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        text: response.message || "I have analyzed your request.",
        actions: response.actions || [],
        recommendedExperienceIds: response.recommendedExperienceIds || [],
        highlights: response.highlights || [],
        source: response.source,
        fallbackNotice: response.fallbackNotice
      }

      setMessages(prev => [...prev, assistantMsg])
    } catch (e) {
      console.error("Copilot Error:", e)
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          text: "TripSaathi is temporarily operating in protected mode. Your itinerary and bookings remain safe.",
          highlights: ["Local Engine Guarded"]
        }
      ])
    } finally {
      setIsThinking(false)
    }
  }

  // Handle User Approving an AI-proposed Action
  const handleApplyAction = (action, messageId) => {
    const result = executeAiAction(action, contextMethods, context)

    // Update message state to show action executed
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

    // Post confirmation message in chat
    setMessages(prev => [
      ...prev,
      {
        id: `sys-confirm-${Date.now()}`,
        role: "assistant",
        text: `✓ **Change Applied**: ${result.message}\n\nYour itinerary and financial metrics have been synchronized.`,
        highlights: ["Itinerary Updated", "Budget Recalibrated"]
      }
    ])
  }

  const handleDismissAction = (messageId) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        return { ...msg, actionDismissed: true }
      }
      return msg
    }))
  }

  const handleAddRecommended = (expId) => {
    const exp = allExperiences.find(e => e.id === expId)
    if (exp) {
      addExperience(exp)
      setMessages(prev => [
        ...prev,
        {
          id: `added-${Date.now()}`,
          role: "assistant",
          text: `✓ Added **${exp.title}** to your journey blueprint.`,
          highlights: ["Experience Added"]
        }
      ])
    }
  }

  // Do not render floating assistant widget on landing page to maintain clean, human editorial aesthetic
  if (location.pathname === '/') {
    return null
  }

  return (
    <>
      {/* Floating Concierge Toggle Trigger in Bottom Right */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          type="button"
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-navy-900 text-white border border-navy-800 shadow-soft-md hover:bg-navy-950 transition-all select-none group"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-coral-500 text-white">
            <MessageSquare className="w-3.5 h-3.5" />
          </div>

          <div className="text-left hidden sm:block">
            <span className="font-sans font-semibold text-xs block leading-tight">Trip Concierge</span>
            <span className="text-[10px] text-sand-300 block">
              24/7 Journey Support
            </span>
          </div>

          {isOpen && <X className="w-4 h-4 ml-1 text-sand-400 group-hover:text-white" />}
        </motion.button>
      </div>

      {/* Slide-out Concierge Assistant Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] max-h-[600px] h-[560px] rounded-3xl bg-white border border-sand-200/90 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Concierge Header */}
            <div className="p-4 bg-navy-900 text-white flex items-center justify-between border-b border-navy-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-coral-500 text-white flex items-center justify-center shadow-xs">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-serif font-bold text-sm text-white">Trip Concierge</h3>
                    <Badge variant="dark" size="sm" className="text-[9px] py-0 px-1.5 text-honey-400 border-navy-700">
                      Live Assistant
                    </Badge>
                  </div>
                  <p className="text-[10px] text-navy-300">
                    Your journey, understood.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-charcoal-400 hover:text-white hover:bg-charcoal-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Action Chips Bar */}
            <div className="p-2.5 bg-sand-50 border-b border-sand-200/80 overflow-x-auto scrollbar-none flex items-center gap-1.5 shrink-0">
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(p.query)}
                  disabled={isThinking}
                  className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white border border-sand-200 text-charcoal-800 hover:bg-terracotta-50 hover:border-terracotta-300 hover:text-terracotta-800 shrink-0 transition-all select-none disabled:opacity-50"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Message Stream */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs bg-sand-50/40">
              {messages.map((msg) => {
                const isUser = msg.role === 'user'

                return (
                  <div
                    key={msg.id}
                    className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isUser && (
                      <div className="w-7 h-7 rounded-lg bg-charcoal-900 text-terracotta-400 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                    )}

                    <div className={`space-y-2.5 max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
                      {/* Bubble */}
                      <div className={`p-3.5 rounded-2xl leading-relaxed whitespace-pre-line shadow-soft-xs ${
                        isUser
                          ? 'bg-charcoal-900 text-white rounded-tr-xs'
                          : 'bg-white border border-sand-200 text-charcoal-800 rounded-tl-xs'
                      }`}>
                        {msg.text}
                      </div>

                      {/* AI Provenance / Source Metadata */}
                      {!isUser && msg.source && (
                        <div className="flex items-center gap-1 text-[10px] text-charcoal-400 italic pl-1">
                          <Sparkles className="w-2.5 h-2.5 text-terracotta-500" />
                          <span>{msg.source}</span>
                        </div>
                      )}

                      {/* Highlights Pill Badges */}
                      {msg.highlights && msg.highlights.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {msg.highlights.map((h, i) => (
                            <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-sand-200 text-charcoal-700 border border-sand-300">
                              {h}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Proposed Action Card Preview */}
                      {msg.actions && msg.actions.length > 0 && !msg.actionApplied && !msg.actionDismissed && (
                        <div className="p-3.5 rounded-xl bg-terracotta-50/80 border border-terracotta-300 space-y-2.5 text-xs text-charcoal-900 shadow-soft-xs">
                          <div className="flex items-center gap-1.5 text-terracotta-900 font-serif font-bold">
                            <Sparkles className="w-3.5 h-3.5 text-terracotta-600" />
                            <span>Proposed Itinerary Adjustment</span>
                          </div>

                          {msg.actions.map((act, actIdx) => (
                            <div key={actIdx} className="space-y-1.5 text-[11px]">
                              {act.type === 'REPLACE_EXPERIENCE' && (
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between text-rose-800 bg-rose-50 p-1.5 rounded border border-rose-200">
                                    <span>REMOVE: Scuba Dive Activity</span>
                                    <span className="font-semibold">-₹2,800/pax</span>
                                  </div>
                                  <div className="flex items-center justify-between text-emerald-800 bg-emerald-50 p-1.5 rounded border border-emerald-200">
                                    <span>ADD: Fontainhas Heritage Walk</span>
                                    <span className="font-semibold">+₹1,600/pax</span>
                                  </div>
                                  <div className="flex justify-between text-[10px] text-muted-foreground pt-0.5">
                                    <span>Est. Savings: ₹1,200</span>
                                    <span className="text-purple-700 font-semibold">+45 min buffer</span>
                                  </div>
                                </div>
                              )}
                              {act.type === 'REMOVE_EXPERIENCE' && (
                                <p className="text-rose-700 font-semibold">Remove activity and free schedule slot</p>
                              )}
                            </div>
                          ))}

                          <div className="pt-2 border-t border-terracotta-200 flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDismissAction(msg.id)}
                              className="h-7 text-[11px] px-2.5 bg-white text-charcoal-700"
                            >
                              Keep Current
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleApplyAction(msg.actions[0], msg.id)}
                              className="h-7 text-[11px] px-3 bg-terracotta-600 hover:bg-terracotta-700 text-white"
                              leftIcon={<Check className="w-3 h-3" />}
                            >
                              Apply Change
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Recommended Experiences Mini Cards */}
                      {msg.recommendedExperienceIds && msg.recommendedExperienceIds.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          {msg.recommendedExperienceIds.map(expId => {
                            const exp = allExperiences.find(e => e.id === expId)
                            if (!exp) return null
                            return (
                              <div
                                key={exp.id}
                                className="p-2.5 rounded-xl bg-white border border-sand-200 flex items-center justify-between gap-2 text-xs shadow-xs"
                              >
                                <div>
                                  <span className="font-serif font-bold text-charcoal-900 block">{exp.title}</span>
                                  <span className="text-[10px] text-muted-foreground">{exp.category} • {formatCurrency(exp.pricePerPerson)}/pax</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleAddRecommended(exp.id)}
                                  className="px-2 py-1 rounded-lg bg-terracotta-50 hover:bg-terracotta-100 text-terracotta-700 text-[10px] font-bold border border-terracotta-200 flex items-center gap-1 shrink-0"
                                >
                                  <Plus className="w-3 h-3" /> Add
                                </button>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}

              {/* Thinking Indicator */}
              {isThinking && (
                <div className="flex items-center gap-2 text-xs text-charcoal-600 pl-9">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-terracotta-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-terracotta-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-terracotta-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="italic text-[11px]">TripSaathi is thinking...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white border-t border-sand-200">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSendMessage()
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask about schedule, food, budget..."
                  disabled={isThinking}
                  className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-sand-300 bg-sand-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500 text-charcoal-900 placeholder:text-muted-foreground/70"
                />

                <Button
                  type="submit"
                  size="sm"
                  disabled={!inputValue.trim() || isThinking}
                  className="bg-terracotta-600 hover:bg-terracotta-700 text-white h-9 px-3 rounded-xl shadow-soft-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </form>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
