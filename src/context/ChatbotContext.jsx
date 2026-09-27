import React, { createContext, useContext, useState, useCallback } from 'react'
import { processUserMessage, loadChatHistory, clearChatHistory, getQuickSuggestions } from '@/services/chatbotService'

const ChatbotContext = createContext(null)

export const ChatbotProvider = ({ children }) => {
  const [messages, setMessages] = useState(() => loadChatHistory())
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [quickSuggestions, setQuickSuggestions] = useState([])

  /**
   * Send a message to the chatbot
   */
  const sendMessage = useCallback(async (userMessage, tripContext) => {
    if (!userMessage.trim()) return

    // Add user message immediately
    const userMsg = {
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    }
    setMessages(prev => [...prev, userMsg])
    setIsLoading(true)

    try {
      // Build disruption context from individual properties
      const disruptionContext = {
        activeDisruption: tripContext.activeDisruption,
        disruptionAnalysis: tripContext.disruptionAnalysis,
        recoveryPlans: tripContext.recoveryPlans
      }

      const response = await processUserMessage(
        userMessage,
        tripContext.tripPreferences,
        tripContext.selectedExperiences,
        tripContext.itinerary,
        disruptionContext,
        tripContext.journeyHealth,
        tripContext.journeyMemory
      )

      // Add AI response
      const aiMsg = {
        role: 'assistant',
        content: response.message,
        timestamp: new Date().toISOString(),
        source: response.source,
        confidence: response.confidence,
        suggestions: response.suggestions,
        actions: response.actions
      }
      setMessages(prev => [...prev, aiMsg])

      // Always update quick suggestions after message completion
      const context = response.context || {
        trip: {
          interests: tripContext.tripPreferences?.interests || [],
          budget: { isOverBudget: false }
        },
        disruption: {
          isActive: Boolean(tripContext.activeDisruption)
        }
      }
      setQuickSuggestions(getQuickSuggestions(context))

      return response
    } catch (error) {
      console.error('Error in sendMessage:', error)
      
      // Add error message
      const errorMsg = {
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please try again.",
        timestamp: new Date().toISOString(),
        isError: true
      }
      setMessages(prev => [...prev, errorMsg])
      
      return { success: false, error }
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Clear all messages
   */
  const clearMessages = useCallback(() => {
    clearChatHistory()
    setMessages([])
    setQuickSuggestions([])
  }, [])

  /**
   * Open the chatbot
   */
  const openChat = useCallback(() => {
    setIsOpen(true)
  }, [])

  /**
   * Close the chatbot
   */
  const closeChat = useCallback(() => {
    setIsOpen(false)
  }, [])

  /**
   * Toggle chatbot open/close state
   */
  const toggleChat = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  /**
   * Update quick suggestions based on current trip context
   */
  const updateSuggestions = useCallback((tripContext) => {
    // Build context object from individual properties
    const context = {
      trip: {
        destination: tripContext.tripPreferences?.destination,
        interests: tripContext.tripPreferences?.interests || [],
        budget: {
          isOverBudget: tripContext.itinerary?.summary?.isOverBudget || false
        }
      },
      disruption: {
        isActive: Boolean(tripContext.activeDisruption),
        availableRecoveryStrategies: tripContext.recoveryPlans || []
      },
      flexibility: tripContext.itinerary?.flexibility || {}
    }
    setQuickSuggestions(getQuickSuggestions(context))
  }, [])

  const value = {
    messages,
    isLoading,
    isOpen,
    quickSuggestions,
    sendMessage,
    clearMessages,
    openChat,
    closeChat,
    toggleChat,
    updateSuggestions
  }

  return (
    <ChatbotContext.Provider value={value}>
      {children}
    </ChatbotContext.Provider>
  )
}

export const useChatbot = () => {
  const context = useContext(ChatbotContext)
  if (!context) {
    throw new Error('useChatbot must be used within a ChatbotProvider')
  }
  return context
}
