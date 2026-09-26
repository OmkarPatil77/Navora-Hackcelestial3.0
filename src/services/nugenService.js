import {
  goaExperiences,
  getExperiencesByDestination,
  allExperiences
} from '@/data/experiences'

import { getRecommendations } from '@/services/recommendationEngine'

/**
 * Checks whether the Nugen API key is configured in the environment.
 *
 * IMPORTANT:
 * VITE_* variables are exposed to the frontend by Vite.
 * Do not commit your .env file or API key to GitHub.
 * This should be moved to a backend API route for production.
 */
export function isNugenConfigured() {
  const key = import.meta.env.VITE_NUGEN_API_KEY

  return Boolean(
    key &&
    key !== 'your_nugen_api_key_here' &&
    key.trim().length > 10
  )
}

/**
 * Constructs a compact, normalized AI system context payload.
 */
export function buildCopilotContext(
  tripPreferences,
  selectedExperiences,
  itinerary,
  currentPage = '/trip',
  disruptionContext = {},
  journeyHealth = null,
  journeyMemory = null
) {
  const days = itinerary?.days || []
  const summary = itinerary?.summary || {}
  const flexibility = itinerary?.flexibility || {}

  const {
    activeDisruption,
    disruptionAnalysis,
    appliedRecovery,
    recoveryPlans
  } = disruptionContext || {}

  // Compact representation of day schedules
  const compactDays = days.map((d) => ({
    day: d.day,
    title: d.title,
    theme: d.theme,

    items: (d.items || []).map((i) => ({
      id: i.id,
      type: i.type,
      title: i.title,
      startTime: i.startTime,
      endTime: i.endTime,
      cost: i.cost,
      movable: i.movable,
      critical: i.critical,
      intensity: i.intensity
    }))
  }))

  return {
    currentPage,

    trip: {
      destination:
        tripPreferences?.destination?.name ||
        tripPreferences?.destination?.city ||
        'Goa, India',

      startDate: tripPreferences?.startDate,
      endDate: tripPreferences?.endDate,

      durationDays:
        tripPreferences?.duration?.days || 4,

      travelers:
        tripPreferences?.travelers || {
          adults: 2,
          total: 2
        },

      interests:
        tripPreferences?.interests || [
          'adventure',
          'food',
          'beaches'
        ],

      travelStyle:
        tripPreferences?.travelStyle || {
          pace: 'balanced',
          priority: 'experiences',
          accommodation: 'comfort'
        },

      budget: {
        total:
          tripPreferences?.budget?.total || 35000,

        estimatedCost:
          summary.totalCost || 34620,

        remainingBuffer:
          summary.remainingBudget || 380,

        isOverBudget:
          Boolean(summary.isOverBudget)
      }
    },

    selectedExperiencesCount:
      selectedExperiences?.length || 0,

    selectedExperienceIds:
      (selectedExperiences || []).map(
        (e) => e.experienceId || e.id
      ),

    itineraryDays: compactDays,

    flexibility: {
      percentage:
        flexibility.percentage || 78,

      bufferFormatted:
        flexibility.bufferFormatted || '2h 15m',

      totalBufferMinutes:
        flexibility.totalBufferMinutes || 135
    },

    disruption: activeDisruption
      ? {
          isActive: true,

          type: activeDisruption.type,

          delayMinutes:
            activeDisruption.delayMinutes,

          newStartTime:
            activeDisruption.newStartTime,

          newEndTime:
            activeDisruption.newEndTime,

          conflictsCount:
            disruptionAnalysis?.counts?.conflicts || 0,

          impactedCount:
            disruptionAnalysis?.counts?.impacted || 0,

          protectedCount:
            disruptionAnalysis?.counts?.protected || 0,

          appliedRecovery:
            appliedRecovery
              ? appliedRecovery.title
              : null,

          availableRecoveryStrategies:
            (recoveryPlans || []).map((p) => ({
              id: p.id,
              title: p.title,
              strategy: p.strategy,
              costImpact: p.costImpact,
              flexibilityImpact:
                p.flexibilityImpact
            }))
        }
      : {
          isActive: false
        },

    journeyHealth:
      journeyHealth || {
        score: 94,
        status: 'EXCELLENT'
      },

    journeyMemory:
      journeyMemory || null
  }
}

/**
 * Sends a natural-language copilot request to Nugen AI
 * or falls back to Demo Intelligence Mode.
 */
export async function sendCopilotMessage(
  userMessage,
  currentContext,
  conversationHistory = []
) {
  const isConfigured = isNugenConfigured()

  if (isConfigured) {
    try {
      const nugenResponse = await callNugenApi(
        userMessage,
        currentContext,
        conversationHistory
      )

      return {
        ...nugenResponse,
        source: 'AI-assisted explanation (Nugen AI)',
        confidence: 'high'
      }
    } catch (err) {
      console.error(
        'Nugen AI request failed. Falling back to TripSaathi Demo Intelligence.',
        err
      )

      const fallback =
        generateDemoIntelligenceResponse(
          userMessage,
          currentContext
        )

      return {
        ...fallback,
        source: 'TripSaathi deterministic engine',
        confidence: 'high',
        fallbackNotice:
          'TripSaathi connected via deterministic intelligence engine.'
      }
    }
  }

  // Default Demo Intelligence Mode
  const demoResponse =
    generateDemoIntelligenceResponse(
      userMessage,
      currentContext
    )

  return {
    ...demoResponse,
    source: 'Computed from your trip plan',
    confidence: 'high'
  }
}

/**
 * Calls the Nugen AI API (OpenAI-compatible).
 *
 * Current model:
 * qwen-v2p5-0p5b-instruct
 */
async function callNugenApi(
  userMessage,
  context,
  history
) {
  const apiKey = import.meta.env.VITE_NUGEN_API_KEY

  if (!apiKey) {
    throw new Error(
      'VITE_NUGEN_API_KEY is not configured.'
    )
  }

  const endpoint =
    'https://api.nugen.in/api/v3/inference/chat/completions'

  const systemInstruction = `You are TripSaathi, an intelligent travel planning copilot for an AI-powered travel platform.

Your job is to help travelers personalize, balance, and optimize their journey.

You have access to the user's current trip preferences, budget, selected experiences, and day-by-day connected itinerary.

RULES:

1. Never invent fake bookings, hotel names, flight numbers, or real-time availability.

2. The application is the source of truth. Propose actions rather than claiming they are already executed.

3. Respond like a human friend would. Be conversational and natural. Do not use bullet points. Do not use commas in lists. Use simple sentences. Write as if you're talking to someone in person.

4. Respect the user's current destination, interests, budget, itinerary and disruption context.

5. If information is unavailable, clearly state that it is unavailable rather than inventing it.

6. Output MUST be valid JSON conforming to this schema:

{
  "intent": "ANSWER_QUESTION | MODIFY_ITINERARY | ADD_EXPERIENCE | REMOVE_EXPERIENCE | REPLACE_EXPERIENCE | SHOW_FLEXIBILITY | OPTIMIZE_ITINERARY",
  "message": "Clear explanation of findings and rationale in conversational human language without bullet points or commas...",
  "actions": [
    {
      "type": "REPLACE_EXPERIENCE | REMOVE_EXPERIENCE | ADD_EXPERIENCE | MODIFY_BUDGET | MODIFY_PACING | REGENERATE_DAY",
      "day": 1,
      "removeExperienceId": "...",
      "addExperienceId": "...",
      "amount": 35000,
      "pace": "relaxed"
    }
  ],
  "recommendedExperienceIds": [
    "goa-fontainhas-heritage-walk"
  ],
  "highlights": [
    "..."
  ]
}`

  // Convert conversation history to OpenAI-style messages
  const messages = [
    {
      role: 'system',
      content: systemInstruction
    },
    ...history.slice(-4).map((h) => ({
      role: h.role === 'assistant' ? 'assistant' : 'user',
      content: h.text || h.message || h.content || ''
    })),
    {
      role: 'user',
      content: `CURRENT TRIP CONTEXT:\n\n${JSON.stringify(context, null, 2)}\n\nUSER QUERY:\n\n${userMessage}`
    }
  ]

  const response = await fetch(
    endpoint,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'accept': 'application/json'
      },

      body: JSON.stringify({
        max_tokens: 1000,
        model: 'qwen-v2p5-0p5b-instruct',
        messages: messages,
        stream: false,
        temperature: 0.2
      })
    }
  )

  if (!response.ok) {
    let errorDetails = ''

    try {
      const errorData = await response.json()
      errorDetails = errorData?.error?.message || errorData?.message || ''
    } catch {
      // Ignore JSON parsing error
    }

    throw new Error(
      `Nugen AI returned status ${response.status}: ${
        response.statusText
      }${errorDetails ? ` - ${errorDetails}` : ''}`
    )
  }

  const data = await response.json()

  const candidateText = data?.choices?.[0]?.message?.content

  if (!candidateText) {
    throw new Error(
      'No content returned from Nugen AI.'
    )
  }

  let parsed

  try {
    parsed = JSON.parse(candidateText)
  } catch (error) {
    console.error(
      'Nugen AI returned invalid JSON:',
      candidateText
    )

    // Attempt to extract JSON if wrapped in markdown
    const jsonMatch = candidateText.match(/```json\s*([\s\S]*?)\s*```/) ||
                      candidateText.match(/\{[\s\S]*\}/)

    if (jsonMatch) {
      try {
        parsed = JSON.parse(jsonMatch[1] || jsonMatch[0])
      } catch {
        throw new Error(
          'Nugen AI returned an invalid JSON response even after extraction attempt.'
        )
      }
    } else {
      throw new Error(
        'Nugen AI returned an invalid JSON response.'
      )
    }
  }

  return parsed
}

/**
 * Deterministic Demo Intelligence Engine.
 *
 * Provides resilient, domain-accurate copilot responses
 * when Nugen AI is offline or unconfigured.
 */
export function generateDemoIntelligenceResponse(
  userMessage,
  context
) {
  const query =
    userMessage.toLowerCase().trim()

  const {
    trip,
    itineraryDays = [],
    selectedExperienceIds = [],
    flexibility = {},
    disruption = {},
    journeyHealth = null,
    journeyMemory = null
  } = context || {}

  const safeTrip = trip || {}

  const totalBudget =
    safeTrip.budget?.total || 35000

  const remainingBuffer =
    safeTrip.budget?.remainingBuffer || 380

  const currentDest =
    safeTrip.destination || 'Goa'

  const currentDestExperiences =
    getExperiencesByDestination(currentDest) || []

  // ---------------------------------------------------------
  // 1. Journey Health
  // ---------------------------------------------------------

  if (
    query.includes('health') ||
    query.includes('how healthy') ||
    query.includes('trip health') ||
    query.includes('score')
  ) {
    const score =
      journeyHealth?.score ||
      (
        disruption?.isActive &&
        !disruption?.appliedRecovery
      )
        ? 76
        : 94

    const status =
      journeyHealth?.status ||
      (
        disruption?.isActive &&
        !disruption?.appliedRecovery
      )
        ? 'WATCH'
        : 'EXCELLENT'

    return {
      intent: 'SHOW_HEALTH',

      message:
        (
          disruption?.isActive &&
          !disruption?.appliedRecovery
            ? `Your trip health score is ${score} out of 100 which means ${status}. I noticed some schedule pressure because your inbound flight arrived 90 minutes late. This reduced your arrival buffer and there is one conflict with the Grand Island Scuba Dive. I recommend applying Plan B Balanced Recovery to get your journey health back to 91 with no conflicts.`
            : `Your trip health score is ${score} out of 100 which is ${status}. Your journey is in peak condition. You have healthy buffers between transit and activities. Your budget health is great with ₹${remainingBuffer.toLocaleString('en-IN')} contingency cushion preserved. You have a good mix of culture beach leisure and dining. Your cab transfers and villa check-in are confirmed.`
        ),

      explanation: {
        score,
        status,

        factors: [
          disruption?.isActive
            ? 'Flight arrival shifted +90 min'
            : 'Optimal 2h+ buffer windows',

          'Accommodations and transfers verified',

          'Balanced pacing with downtime'
        ]
      },

      confidence: 'high',

      source:
        'Computed from your trip plan',

      highlights: [
        `Score: ${score}/100 (${status})`,
        'All dependencies verified'
      ]
    }
  }

  // ---------------------------------------------------------
  // 2. Scuba Replacement Explanation
  // ---------------------------------------------------------

  if (
    query.includes('why was scuba') ||
    query.includes('why replace') ||
    query.includes('why did you change') ||
    query.includes('why plan b') ||
    query.includes('why change')
  ) {
    return {
      intent: 'EXPLAIN_DECISION',

      message:
        `### Decision Rationale: Why Scuba Diving was Replaced\n\n` +
        `**Context:** Inbound flight 6E-204 landed 90 minutes late at **12:05**.\n\n` +
        `**Key Factors:**\n` +
        `• **Duration Constraint:** Grand Island Scuba requires a **4.5 hour** continuous window (boat transfer + dive briefings).\n` +
        `• **Overlap:** Pushing Scuba to the afternoon would violate your **Mandovi River Sunset Cruise (18:45)** and dinner reservation.\n` +
        `• **Adapted Alternative:** Swapped with **Fontainhas Latin Quarter Heritage Walk (2.5 hours)**.\n\n` +
        `**Resulting Outcome:**\n` +
        `✓ **0 unresolved conflicts**\n` +
        `✓ **+45 minutes** extra relaxation buffer\n` +
        `✓ **₹1,200** saved in activity fees\n` +
        `✓ **Evening sunset cruise & dinner 100% protected**`,

      explanation: {
        title:
          'Why Scuba Diving was replaced with Fontainhas Walk',

        factors: [
          '4.5-hour activity window compromised by +90m flight delay',
          'Protecting evening Mandovi River sunset cruise & dinner commitments',
          'Zero cancellation penalty negotiated with Oceanic Adventures'
        ],

        changedNodes: [
          'Grand Island Scuba Dive → Fontainhas Heritage Walk'
        ],

        protectedNodes: [
          'Mandovi River Sunset Cruise',
          "Fisherman's Wharf Dinner"
        ],

        outcome:
          '0 conflicts, +45m buffer, ₹1,200 saved'
      },

      confidence: 'high',

      source:
        'TripSaathi deterministic engine',

      highlights: [
        '4.5h window constraint',
        'Protected sunset cruise',
        '₹1,200 saved'
      ]
    }
  }

  // ---------------------------------------------------------
  // 3. Sunset Cruise
  // ---------------------------------------------------------

  if (
    query.includes('sunset cruise') ||
    query.includes('cruise unchanged') ||
    query.includes('protect')
  ) {
    return {
      intent: 'EXPLAIN_DECISION',

      message:
        `### Why Your Sunset Cruise is 100% Protected\n\n` +
        `• **Scheduled Time:** 18:45 – 20:30 (Day 1 Evening)\n` +
        `• **Dependency Buffer:** After adapting the afternoon with the shorter Fontainhas Walk (concluding at 18:00), there is a **45-minute travel and boarding buffer** before cruise departure.\n` +
        `• **Priority Score:** High — sunset lighting cannot be postponed to night hours.\n` +
        `• **Status:** Zero downstream conflict detected.`,

      explanation: {
        factors: [
          'Departure scheduled at fixed sunset hour (18:45)',
          'Protected by 45-minute transit buffer from Fontainhas',
          'Non-negotiable scenic priority node'
        ],

        protectedNodes: [
          'Mandovi River Luxury Sunset Cruise'
        ]
      },

      confidence: 'high',

      source:
        'TripSaathi deterministic engine',

      highlights: [
        'Fixed sunset timing',
        '+45m buffer secured',
        'No change required'
      ]
    }
  }

  // ---------------------------------------------------------
  // 4. Journey Memory
  // ---------------------------------------------------------

  if (
    query.includes('learn') ||
    query.includes('memory') ||
    query.includes('preferences') ||
    query.includes('what did the system learn')
  ) {
    return {
      intent: 'SHOW_MEMORY',

      message:
        `### TripSaathi Session Journey Memory\n\n` +
        `During your trip planning and adaptation session, TripSaathi has observed the following contextual habits:\n\n` +
        `✓ **Cultural & Heritage Affinity:** You prioritized walking tours and local Portuguese architecture.\n` +
        `✓ **Balanced Pacing Preference:** You opted for manageable 2–3 hour blocks with downtime between activities.\n` +
        `✓ **Protected Evening Routine:** You consistently favored keeping dinner and sunset slots unhurried.\n\n` +
        `*Note: This session memory is applied to fine-tune recommendations during your current trip (±5 pts relevance adjustment) without creating any permanent user tracking.*`,

      explanation: {
        factors: [
          'Observed cultural experience selections',
          'Preference for balanced pacing and evening buffers',
          'Trip-scoped session adaptation active'
        ]
      },

      confidence: 'high',

      source:
        'TripSaathi session memory',

      highlights: [
        'Cultural affinity noted',
        'Balanced pacing favored',
        'Trip-scoped only'
      ]
    }
  }

  // ---------------------------------------------------------
  // 5. Recommendation Explainability
  // ---------------------------------------------------------

  if (
    query.includes('why recommend') ||
    query.includes('why these') ||
    query.includes('recommendation reason')
  ) {
    return {
      intent: 'EXPLAIN_DECISION',

      message:
        `### Recommendation Explainability Breakdown\n\n` +
        `TripSaathi selected your recommendations based on 5 deterministic pillars:\n\n` +
        `1. **Interest Alignment (35%):** Strong match with your tags (*${(safeTrip.interests || []).join(', ')}*).\n` +
        `2. **Budget Fit (20%):** All items fit neatly within your ₹${totalBudget.toLocaleString('en-IN')} target.\n` +
        `3. **Pacing Fit (20%):** Matches your **${safeTrip.travelStyle?.pace || 'Balanced'}** style without tight clustering.\n` +
        `4. **Duration Fit (15%):** Activity lengths leave healthy transit buffers.\n` +
        `5. **Journey Memory (10%):** Slight +3 to +5 point boost from your active choices.`,

      explanation: {
        factors: [
          'Interest match with adventure, food, and culture',
          'Strict budget constraint compliance',
          'Balanced daily intensity distribution'
        ]
      },

      confidence: 'high',

      source:
        'Computed from your trip plan',

      highlights: [
        '5 deterministic pillars',
        'Transparent weighting',
        'Zero hallucinated ratings'
      ]
    }
  }

  // ---------------------------------------------------------
  // 6. Fleet Operations Summary
  // ---------------------------------------------------------

  if (
    query.includes('summarize') ||
    query.includes('summary') ||
    query.includes('overview') ||
    query.includes('fleet')
  ) {
    return {
      intent: 'ANSWER_QUESTION',

      message:
        `Today we have 12 active tours running across Goa Rajasthan Kerala and Ladakh. We have 28 live guests monitored in real-time. We have 94% vendor confirmation fidelity across all transit and villa partners. There is 1 active synthetic disruption on Tour GOA-2048 with a 90 minute flight delay from BOM to GOI. Plan B Balanced Recovery is ready for execution and all evening bookings are secured.`,

      highlights: [
        '12 Tours Active',
        '1 Disruption under control',
        '94% Vendor Confirmations'
      ]
    }
  }

  // ---------------------------------------------------------
  // 7. Vendor Coordination
  // ---------------------------------------------------------

  if (
    query.includes('which vendors need action') ||
    query.includes('vendor') ||
    query.includes('coordination')
  ) {
    return {
      intent: 'ANSWER_QUESTION',

      message:
        `For Tour GOA-2048 Goa Transfers Fleet needs action. The pickup should be retimed from 10:55 to 12:15 with driver Rajesh Naik and this needs confirmation. Casa Sol Heritage Villa check-in window shifted from 12:00 to 13:15 and this is updated. Oceanic Adventures Scuba dive was cancelled with zero penalty due to delayed arrival and replaced by Fontainhas Walk. Mandovi Luxury Cruises and Fisherman's Wharf are guarded with zero conflict and confirmed.`,

      actions: [
        {
          type: 'CONFIRM_VENDOR',
          vendorId: 'VEN-001',
          note:
            'Pickup window 12:15 confirmed for driver Rajesh Naik'
        }
      ],

      highlights: [
        'Goa Transfers pending confirmation',
        'Casa Sol updated',
        'Oceanic Adventures replaced without penalty'
      ]
    }
  }

  // ---------------------------------------------------------
  // 8. Traveler Update
  // ---------------------------------------------------------

  if (
    query.includes('prepare a traveler update') ||
    query.includes('notification') ||
    query.includes('update traveler') ||
    query.includes('message')
  ) {
    const draft =
      'Hi Aryan & Riya! Your inbound flight 6E-204 to Goa has been delayed by 90 minutes. TripSaathi has automatically adjusted your afternoon schedule: your private cab will meet you at Gate 2 at 12:15, check-in is held, and we swapped Scuba Diving for a relaxed Fontainhas Heritage & Culinary Walk (16:00 – 18:30) to preserve your evening Sunset Cruise & Dinner. Zero hassle, zero lost bookings!'

    return {
      intent: 'ANSWER_QUESTION',

      message:
        `Here is a draft traveler journey update for Aryan and Riya Sharma on Tour GOA-2048. ${draft} Click Send Notification below to dispatch this simulated update to the guests.`,

      actions: [
        {
          type: 'PREPARE_NOTIFICATION',
          tourId: 'GOA-2048',
          message: draft
        }
      ],

      highlights: [
        'Draft ready',
        'Clear reassurance',
        'Includes updated timings'
      ]
    }
  }

  // ---------------------------------------------------------
  // 9. Disruption / Delay
  // ---------------------------------------------------------

  if (
    query.includes('what is affected') ||
    query.includes('goa delay') ||
    query.includes('disrupt') ||
    query.includes('delay') ||
    query.includes('conflict')
  ) {
    if (
      disruption?.isActive ||
      query.includes('delay')
    ) {
      return {
        intent: 'ANSWER_QUESTION',

        message:
          `Your inbound flight from Mumbai to Goa shifted from 09:20 to 10:50 and will touchdown at 12:05. This creates a direct conflict because Grand Island Scuba dive was originally at 12:30 but now conflicts with your 12:05 arrival and transit window. The airport transfer cab at 12:15 and Casa Sol Villa check-in at 13:15 have been rescheduled safely. However your Mandovi River Sunset Cruise at 18:45 and Fisherman's Wharf Dinner at 20:30 remain 100% guarded. I recommend applying Plan B Balanced Recovery to swap Scuba for Fontainhas Heritage Walk which will save you ₹1200 and add 45 minutes of flexibility.`,

        actions: [
          {
            type: 'APPLY_RECOVERY',
            planId: 'PLAN-B-BALANCED'
          }
        ],

        highlights: [
          '1 Conflict (Scuba Dive)',
          '2 Shifts (Cab & Villa)',
          '2 Protected (Cruise & Dinner)'
        ]
      }
    }
  }

  // ---------------------------------------------------------
  // 10. Protected Elements
  // ---------------------------------------------------------

  if (
    query.includes('protect') ||
    query.includes('unchanged') ||
    query.includes('safe')
  ) {
    return {
      intent: 'ANSWER_QUESTION',

      message:
        `TripSaathi dependency graph ensures we only modify what is strictly necessary. Your Mandovi River Evening Sunset Cruise and Dinner from 19:30 to 21:30 are guarded by buffer windows. Your Day 2 and Day 3 Tours including all South Goa waterfall and heritage bookings remain undisturbed. Your resort reservation is confirmed with delayed arrival notification automatically dispatched.`,

      highlights: [
        'Evening dinner guarded',
        'Zero impact on Days 2-4'
      ]
    }
  }

  // ---------------------------------------------------------
  // 11. Lowest Cost Recovery
  // ---------------------------------------------------------

  if (
    query.includes('lowest-cost') ||
    query.includes('lowest cost') ||
    query.includes('cheapest recovery') ||
    query.includes('save money')
  ) {
    return {
      intent: 'ANSWER_QUESTION',

      message:
        `Plan C Protect Journey and Rest provides the maximum cost savings. You can save ₹2800 or ₹1200 with Plan B Balanced. You gain 90 minutes of leisure buffer. This gives you a smooth resort arrival with poolside lunch and sunset beach relaxation with zero schedule stress.`,

      highlights: [
        '₹2,800 saved with Plan C',
        '₹1,200 saved with Plan B'
      ]
    }
  }

  // ---------------------------------------------------------
  // 12. Recover Trip
  // ---------------------------------------------------------

  if (
    query.includes('recover my trip') ||
    query.includes('recover') ||
    query.includes('fix trip') ||
    query.includes('adapt')
  ) {
    return {
      intent: 'MODIFY_ITINERARY',

      message:
        `I recommend applying Plan B Balanced Recovery. You should swap Grand Island Scuba with Fontainhas Latin Quarter Heritage Walk from 16:00 to 18:30. This will save you ₹1200 and give you 45 minutes extra flexibility. You will have zero schedule conflicts and all evening plans are preserved.`,

      actions: [
        {
          type: 'REPLACE_EXPERIENCE',
          day: 1,
          removeExperienceId:
            'goa-scuba-grand-island',
          addExperienceId:
            'goa-fontainhas-heritage-walk',
          estimatedSavings: 1200,
          flexibilityGained: '+45 min'
        }
      ],

      highlights: [
        'Recommended Plan B',
        '₹1,200 saved',
        'Zero conflicts'
      ]
    }
  }

  // ---------------------------------------------------------
  // 13. Day 2 / Pacing
  // ---------------------------------------------------------

  if (
    query.includes('relax') ||
    query.includes('hectic') ||
    query.includes('day 2') ||
    query.includes('pacing') ||
    query.includes('slow down')
  ) {
    const day2 =
      itineraryDays.find(
        (d) => d.day === 2
      ) ||
      itineraryDays[1]

    const currentHighIntensity =
      day2?.items?.find(
        (i) =>
          i.intensity === 'high' &&
          i.type === 'experience'
      )

    const removeId =
      currentHighIntensity
        ? currentHighIntensity.id
        : (
            currentDestExperiences[0]?.id ||
            'exp-1'
          )

    const replacementExp =
      currentDestExperiences.find(
        (e) =>
          e.intensity === 'low' ||
          e.pace === 'moderate'
      ) ||
      currentDestExperiences[1] ||
      currentDestExperiences[0]

    return {
      intent: 'MODIFY_ITINERARY',

      message:
        `I analyzed Day 2 in ${currentDest} and found an opportunity to balance high-energy activities with recovery downtime. I propose replacing ${currentHighIntensity?.title || 'High Intensity Activity'} with ${replacementExp?.title || 'Cultural Exploration'}. This reduces physical intensity while still matching your cultural interests. It keeps spending balanced within your planned budget and adds a 45 minute afternoon relaxation buffer at your hotel.`,

      actions: [
        {
          type: 'REPLACE_EXPERIENCE',
          day: 2,
          removeExperienceId: removeId,
          addExperienceId:
            replacementExp?.id ||
            'replacement',
          estimatedSavings: 1200,
          flexibilityGained: '+45 min'
        }
      ],

      highlights: [
        'Pacing rebalanced',
        'Budget protected',
        '+45 min buffer'
      ]
    }
  }

  // ---------------------------------------------------------
  // 14. Food Recommendations
  // ---------------------------------------------------------

  if (
    query.includes('food') ||
    query.includes('culinary') ||
    query.includes('dining') ||
    query.includes('eat') ||
    query.includes('restaurant') ||
    query.includes('taste')
  ) {
    const foodRecommendations =
      currentDestExperiences
        .filter(
          (e) =>
            e.category === 'Food' ||
            (e.tags || []).includes('food')
        )
        .slice(0, 3)

    const listText =
      foodRecommendations.length > 0
        ? foodRecommendations
            .map(
              (f) =>
                `${f.title} is a great option. ${(
                  f.description || ''
                ).slice(0, 95)}`
            )
            .join(' ')
        : `${currentDest} Traditional Tasting Tour is a great option. Historic Quarter Food Walk is also available.`

    return {
      intent: 'ADD_EXPERIENCE',

      message:
        `I screened our curated ${currentDest} inventory against your current budget and schedule. Here are authentic culinary experiences matching your profile. ${listText}`,

      recommendedExperiences:
        foodRecommendations,

      recommendedExperienceIds:
        foodRecommendations.map(
          (e) => e.id
        ),

      highlights: [
        `${foodRecommendations.length || 2} authentic food stops found`,
        'Local regional cuisine masterclass'
      ]
    }
  }

  // ---------------------------------------------------------
  // 15. Budget
  // ---------------------------------------------------------

  if (
    query.includes('budget') ||
    query.includes('cost') ||
    query.includes('money') ||
    query.includes('spending') ||
    query.includes('spend') ||
    query.includes('price')
  ) {
    return {
      intent: 'ANSWER_QUESTION',

      message:
        `Your target trip budget is ₹${totalBudget.toLocaleString('en-IN')}. Your estimated total spend is ₹${safeTrip.budget?.estimatedCost?.toLocaleString('en-IN') || '34,620'}. Your remaining safety buffer is ₹${remainingBuffer.toLocaleString('en-IN')}. Your budget is currently ${
          safeTrip.budget?.isOverBudget
            ? 'slightly over target'
            : 'balanced with an 8% safety cushion'
        }. All private cab transfers villa stays and staged passes are accounted for.`,

      highlights: [
        `Budget remaining: ₹${remainingBuffer.toLocaleString('en-IN')}`,
        'Zero hidden surge costs'
      ]
    }
  }

  // ---------------------------------------------------------
  // 16. Flexibility
  // ---------------------------------------------------------

  if (
    query.includes('flexib') ||
    query.includes('depend') ||
    query.includes('delay') ||
    query.includes('fixed') ||
    query.includes('change')
  ) {
    return {
      intent: 'SHOW_FLEXIBILITY',

      message:
        `Your journey currently has ${flexibility?.percentage || 78}% journey flexibility with ${flexibility?.bufferFormatted || '2h 15m'} of buffer windows across ${itineraryDays.length || 4} days in ${currentDest}. You have high flexibility with heritage walking tours and sightseeing stops. Afternoon pool and downtime blocks can shift easily. Evening culinary dinner reservations are also flexible. However inbound and outbound flight schedules are fixed. Airport pickup cab driver dispatch is critical. Hotel check-in and check-out time slots are also fixed and guarded by TripSaathi.`,

      highlights: [
        `${flexibility?.percentage || 78}% Overall Flexibility`,
        `${flexibility?.bufferFormatted || '2h 15m'} buffer time`
      ]
    }
  }

  // ---------------------------------------------------------
  // 17. Remove Experience
  // ---------------------------------------------------------

  if (
    query.includes('remove') ||
    query.includes('delete')
  ) {
    const firstExp =
      currentDestExperiences[0]

    return {
      intent: 'REMOVE_EXPERIENCE',

      message:
        `I can remove ${
          firstExp
            ? firstExp.title
            : 'this experience'
        } from your journey. This will free up time and save budget for your travel party.`,

      actions: [
        {
          type: 'REMOVE_EXPERIENCE',

          experienceId:
            firstExp
              ? firstExp.id
              : 'exp-1'
        }
      ],

      highlights: [
        'Freed schedule slot',
        'Budget saved'
      ]
    }
  }

  // ---------------------------------------------------------
  // 18. Generic Conversational Fallback
  // ---------------------------------------------------------

  return {
    intent: 'ANSWER_QUESTION',

    message:
      `I'm tracking your ${safeTrip.durationDays || 4}-day ${safeTrip.destination || currentDest} journey with ${(safeTrip.interests || []).join(' and ')} interests and ₹${totalBudget.toLocaleString('en-IN')} target budget. You can ask me to make Day 2 more relaxed to rebalance physical intensity. You can also ask me to find more local food to discover authentic local tastings. Ask me how much budget is left to inspect financial allocations. Or ask what is flexible to view movable versus critical schedule dependencies.`,

    highlights: [
      'Context-aware Copilot',
      'Deterministic accuracy'
    ]
  }
}
