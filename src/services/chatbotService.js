import { isNugenConfigured, buildCopilotContext, sendCopilotMessage } from './nugenService'

/**
 * Chatbot Service for AI-powered itinerary suggestions and disruption adaptation
 * Handles conversation state, message processing, and AI integration
 */

const CHAT_HISTORY_KEY = 'tripsaathi_chat_history'
const MAX_HISTORY_LENGTH = 20

/**
 * Initialize a new conversation session
 */
export function initializeChatSession() {
  return {
    id: Date.now(),
    startedAt: new Date().toISOString(),
    messages: [],
    context: null
  }
}

/**
 * Load chat history from localStorage
 * Returns empty array to clear history on every refresh
 */
export function loadChatHistory() {
  // Clear history on every refresh as requested
  return []
}

/**
 * Save chat history to localStorage
 */
export function saveChatHistory(history) {
  try {
    // Keep only the last MAX_HISTORY_LENGTH messages
    const trimmedHistory = history.slice(-MAX_HISTORY_LENGTH)
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(trimmedHistory))
  } catch (e) {
    console.warn("Could not save chat history", e)
  }
}

/**
 * Clear chat history
 */
export function clearChatHistory() {
  localStorage.removeItem(CHAT_HISTORY_KEY)
}

/**
 * Process user message and generate AI response
 */
export async function processUserMessage(userMessage, tripPreferences, selectedExperiences, itinerary, disruptionContext = null, journeyHealth = null, journeyMemory = null) {
  const history = loadChatHistory()

  // Build context for AI
  const currentContext = buildCopilotContext(
    tripPreferences,
    selectedExperiences,
    itinerary,
    '/itinerary',
    disruptionContext || {},
    journeyHealth,
    journeyMemory
  )

  // Add user message to history
  const userMsg = {
    role: 'user',
    content: userMessage,
    timestamp: new Date().toISOString()
  }
  history.push(userMsg)

  try {
    // Get AI response - this will use Gemini API if configured
    const response = await sendCopilotMessage(userMessage, currentContext, history)

    // Add AI response to history
    const aiMsg = {
      role: 'assistant',
      content: response.message || response.text || response.response,
      timestamp: new Date().toISOString(),
      source: response.source,
      confidence: response.confidence,
      suggestions: response.suggestions || [],
      actions: response.actions || []
    }
    history.push(aiMsg)

    // Save updated history
    saveChatHistory(history)

    return {
      success: true,
      message: aiMsg.content,
      suggestions: aiMsg.suggestions,
      actions: aiMsg.actions,
      source: aiMsg.source,
      confidence: aiMsg.confidence,
      context: currentContext
    }
  } catch (error) {
    console.error('Error processing chat message:', error)

    // Only use fallback if Nugen API is not configured
    const isConfigured = isNugenConfigured()
    if (!isConfigured) {
      const fallbackMsg = {
        role: 'assistant',
        content: generateFallbackResponse(userMessage, currentContext),
        timestamp: new Date().toISOString(),
        source: 'fallback',
        confidence: 'low'
      }
      history.push(fallbackMsg)
      saveChatHistory(history)

      return {
        success: false,
        message: fallbackMsg.content,
        source: 'fallback',
        confidence: 'low',
        error: error.message
      }
    }

    // If API is configured but failed, show error message
    const errorMsg = {
      role: 'assistant',
      content: `I'm having trouble connecting to the AI service. Error: ${error.message}. Please check your API key configuration.`,
      timestamp: new Date().toISOString(),
      source: 'error',
      confidence: 'low',
      isError: true
    }
    history.push(errorMsg)
    saveChatHistory(history)

    return {
      success: false,
      message: errorMsg.content,
      source: 'error',
      confidence: 'low',
      error: error.message
    }
  }
}

/**
 * Generate fallback response when AI is unavailable
 */
function generateFallbackResponse(userMessage, context) {
  const lowerMessage = userMessage.toLowerCase()
  
  // Itinerary suggestions
  if (lowerMessage.includes('suggest') || lowerMessage.includes('recommend') || lowerMessage.includes('what should')) {
    const interests = context.trip.interests.join(', ')
    return `Based on your interests in ${interests}, I'd recommend exploring the local experiences in ${context.trip.destination}. Your current itinerary has ${context.itineraryDays.length} days planned. Would you like me to help you adjust any specific day?`
  }
  
  // Disruption handling
  if (lowerMessage.includes('delay') || lowerMessage.includes('disruption') || lowerMessage.includes('change') || lowerMessage.includes('problem')) {
    if (context.disruption.isActive) {
      return `I see there's an active ${context.disruption.type} disruption. The system has identified ${context.disruption.availableRecoveryStrategies.length} recovery strategies. Would you like me to apply one of them to adapt your schedule?`
    }
    return `Your trip currently has no active disruptions. Your journey flexibility is at ${context.flexibility.percentage}%, which gives you good buffer time (${context.flexibility.bufferFormatted}) for unexpected changes.`
  }
  
  // Budget questions
  if (lowerMessage.includes('budget') || lowerMessage.includes('cost') || lowerMessage.includes('spending')) {
    const remaining = context.trip.budget.remainingBuffer
    const total = context.trip.budget.estimatedCost
    return `Your estimated trip cost is ${total} with a remaining buffer of ${remaining}. Your budget status is ${context.trip.budget.isOverBudget ? 'over budget' : 'within budget'}. Would you like suggestions to optimize spending?`
  }
  
  // General help
  return `I'm here to help with your ${context.trip.destination} trip! I can assist with itinerary suggestions, handle disruptions, optimize your budget, or adjust your schedule based on your interests in ${context.trip.interests.join(', ')}. What would you like to explore?`
}

/**
 * Get quick suggestion prompts based on current trip state
 */
export function getQuickSuggestions(context) {
  const suggestions = []

  // Always show these core suggestions after message completion
  suggestions.push({
    text: "Suggest more adventure activities",
    icon: "compass",
    category: "interests"
  })

  suggestions.push({
    text: "Find local food experiences",
    icon: "utensils",
    category: "interests"
  })

  suggestions.push({
    text: "Help reduce trip cost",
    icon: "wallet",
    category: "budget"
  })

  suggestions.push({
    text: "Optimize my schedule",
    icon: "clock",
    category: "schedule"
  })

  // Disruption-based suggestions (add if active)
  if (context.disruption.isActive) {
    suggestions.push({
      text: "How to handle this disruption?",
      icon: "shield",
      category: "disruption"
    })
  }

  return suggestions.slice(0, 6)
}

/**
 * Analyze message intent for proactive suggestions
 */
export function analyzeMessageIntent(message) {
  const lowerMessage = message.toLowerCase()
  
  const intents = {
    itinerary: ['itinerary', 'schedule', 'plan', 'day', 'activities'],
    disruption: ['delay', 'cancel', 'disruption', 'change', 'problem', 'issue'],
    budget: ['budget', 'cost', 'price', 'expensive', 'cheap', 'money'],
    interests: ['interest', 'like', 'prefer', 'enjoy', 'love'],
    flexibility: ['flexible', 'change', 'modify', 'adjust', 'move'],
    transport: ['transport', 'travel', 'transfer', 'cab', 'taxi', 'bus']
  }
  
  for (const [intent, keywords] of Object.entries(intents)) {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      return intent
    }
  }
  
  return 'general'
}
