import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageSquare, X, Send, Sparkles, Minimize2, Maximize2, 
  Clock, Shield, Zap, Compass, Utensils, Wallet, RefreshCw 
} from 'lucide-react'
import { useChatbot } from '@/context/ChatbotContext'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

/**
 * TripSaathi Chatbot - AI-powered itinerary assistant
 * Provides intelligent suggestions and disruption adaptation
 */
export const TripSaathiChatbot = ({ tripContext }) => {
  const {
    messages,
    isLoading,
    isOpen,
    quickSuggestions,
    sendMessage,
    clearMessages,
    closeChat,
    toggleChat,
    updateSuggestions
  } = useChatbot()

  const [inputValue, setInputValue] = useState('')
  const [isMinimized, setIsMinimized] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Update suggestions when trip context changes
  useEffect(() => {
    if (tripContext && isOpen) {
      updateSuggestions(tripContext)
    }
  }, [tripContext, isOpen, updateSuggestions])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus()
    }
  }, [isOpen, isMinimized])

  const handleSendMessage = async (e) => {
    e.preventDefault()

    if (!inputValue.trim() || isLoading) return

    const message = inputValue.trim()
    setInputValue('')

    await sendMessage(message, tripContext)
  }

  const handleQuickSuggestion = async (suggestion) => {
    if (isLoading) return

    await sendMessage(suggestion.text, tripContext)
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)

    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getSuggestionIcon = (iconName) => {
    const icons = {
      compass: <Compass className="w-4 h-4" />,
      utensils: <Utensils className="w-4 h-4" />,
      shield: <Shield className="w-4 h-4" />,
      wallet: <Wallet className="w-4 h-4" />,
      clock: <Clock className="w-4 h-4" />,
      zap: <Zap className="w-4 h-4" />,
      refresh: <RefreshCw className="w-4 h-4" />
    }

    return icons[iconName] || <Sparkles className="w-4 h-4" />
  }

  // Floating trigger button
  if (!isOpen) {
    return (
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 bg-white hover:bg-sand-50 text-charcoal-900 p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group border border-sand-200"
        aria-label="Open TripSaathi Assistant"
      >
        <MessageSquare className="w-6 h-6 text-terracotta-600" />
        <span className="absolute -top-1 -right-1 bg-terracotta-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-pulse font-bold">
          AI
        </span>
        <span className="absolute right-full mr-3 bg-charcoal-900 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Ask TripSaathi
        </span>
      </motion.button>
    )
  }

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.9, opacity: 0, y: 20 }}
      className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] max-h-[80vh] shadow-2xl flex flex-col"
    >
      <Card className="overflow-hidden border-terracotta-200 bg-white flex flex-col max-h-[80vh]">

        {/* Header */}
        <div className="bg-gradient-to-r from-terracotta-600 to-terracotta-700 p-4 text-white">
          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Sparkles className="w-5 h-5" />
              </div>

              <div>
                <h3 className="font-serif font-bold text-base">
                  TripSaathi Assistant
                </h3>

                <p className="text-xs text-terracotta-100">
                  AI-powered trip guidance
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">

              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                aria-label={isMinimized ? "Expand" : "Minimize"}
              >
                {isMinimized ? (
                  <Maximize2 className="w-4 h-4" />
                ) : (
                  <Minimize2 className="w-4 h-4" />
                )}
              </button>

              <button
                onClick={closeChat}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>

            </div>
          </div>
        </div>

        {!isMinimized && (
          <>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-sand-50/50 min-h-0">

              {messages.length === 0 ? (

                <div className="text-center py-8">

                  <div className="w-16 h-16 bg-terracotta-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-terracotta-600" />
                  </div>

                  <h4 className="font-serif font-bold text-charcoal-950 mb-2">
                    Welcome to TripSaathi
                  </h4>

                  <p className="text-sm text-charcoal-600 mb-4">
                    I can help you with itinerary suggestions, handle disruptions, and optimize your trip based on your interests.
                  </p>

                  <Badge variant="spark" size="sm">
                    AI Ready
                  </Badge>

                </div>

              ) : (

                messages.map((msg, idx) => (

                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex gap-3",
                      msg.role === 'user'
                        ? 'justify-end'
                        : 'justify-start'
                    )}
                  >

                    {msg.role === 'assistant' && (
                      <div className="w-8 h-8 bg-terracotta-100 rounded-full flex items-center justify-center shrink-0">
                        <Sparkles className="w-4 h-4 text-terracotta-600" />
                      </div>
                    )}

                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl px-4 py-3",
                        msg.role === 'user'
                          ? 'bg-terracotta-600 text-white rounded-br-sm'
                          : 'bg-white border border-sand-200 text-charcoal-800 rounded-bl-sm'
                      )}
                    >

                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </p>

                      <div className="flex items-center justify-between mt-2 gap-2">

                        <span className="text-[10px] opacity-70">
                          {formatTimestamp(msg.timestamp)}
                        </span>

                        {msg.source && msg.role === 'assistant' && (
                          <Badge
                            variant="outline"
                            size="sm"
                            className="text-[10px]"
                          >
                            {msg.source}
                          </Badge>
                        )}

                      </div>
                    </div>

                  </motion.div>

                ))
              )}

              {/* Loading Indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 justify-start"
                >

                  <div className="w-8 h-8 bg-terracotta-100 rounded-full flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-terracotta-600" />
                  </div>

                  <div className="bg-white border border-sand-200 rounded-2xl rounded-bl-sm px-4 py-3">

                    <div className="flex gap-1.5">

                      <div
                        className="w-2 h-2 bg-terracotta-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0ms' }}
                      />

                      <div
                        className="w-2 h-2 bg-terracotta-400 rounded-full animate-bounce"
                        style={{ animationDelay: '150ms' }}
                      />

                      <div
                        className="w-2 h-2 bg-terracotta-400 rounded-full animate-bounce"
                        style={{ animationDelay: '300ms' }}
                      />

                    </div>
                  </div>

                </motion.div>
              )}

              <div ref={messagesEndRef} />

            </div>

            {/* Quick Suggestions */}
            {quickSuggestions.length > 0 && messages.length > 0 && (
              <div className="px-4 pb-2">

                <div className="flex flex-wrap gap-2">

                  {quickSuggestions.map((suggestion, idx) => (

                    <button
                      key={idx}
                      onClick={() => handleQuickSuggestion(suggestion)}
                      disabled={isLoading}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-sand-100 hover:bg-terracotta-50 text-charcoal-700 hover:text-terracotta-700 rounded-full text-xs border border-sand-200 hover:border-terracotta-200 transition-colors disabled:opacity-50"
                    >
                      {getSuggestionIcon(suggestion.icon)}
                      <span>{suggestion.text}</span>
                    </button>

                  ))}

                </div>

              </div>
            )}

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-sand-200">

              <form
                onSubmit={handleSendMessage}
                className="flex gap-2"
              >

                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask about your trip..."
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 bg-sand-50 border border-sand-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent disabled:opacity-50"
                />

                <Button
                  type="submit"
                  size="icon"
                  isLoading={isLoading}
                  disabled={!inputValue.trim()}
                  className="bg-terracotta-600 hover:bg-terracotta-700 text-white shrink-0"
                >
                  <Send className="w-4 h-4" />
                </Button>

              </form>

              {messages.length > 1 && (
                <button
                  onClick={clearMessages}
                  className="mt-2 text-xs text-charcoal-500 hover:text-terracotta-600 transition-colors"
                >
                  Clear conversation
                </button>
              )}

            </div>

          </>
        )}

      </Card>
    </motion.div>
  )
}

export default TripSaathiChatbot
