# TripSaathi - AI-Powered Travel Itinerary Platform

An intelligent travel planning platform with AI-powered itinerary suggestions and disruption adaptation.

## Features

- **Smart Itinerary Planning**: AI-driven trip recommendations based on user interests
- **Disruption Adaptation**: Dynamic trip adjustments for delays, cancellations, and changes
- **TripSaathi Chatbot**: AI assistant for real-time trip guidance and suggestions
- **Live Trip Monitoring**: Real-time journey health tracking and recovery options
- **Operator Portal**: Dedicated interface for tour operators to manage experiences

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Environment Configuration

The application uses Google Gemini API for AI-powered features. To enable the chatbot:

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Add your Gemini API key to the `.env` file:
```
VITE_GEMINI_API_KEY=your_actual_gemini_api_key_here
```

3. Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Running the Application

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

- `src/pages/` - Main application pages (Itinerary, Trip, PlanTrip, etc.)
- `src/components/` - Reusable UI components
- `src/services/` - Business logic and AI services
  - `chatbotService.js` - Chatbot logic for AI interactions
  - `geminiService.js` - Gemini API integration
  - `disruptionEngine.js` - Disruption detection and analysis
  - `recoveryEngine.js` - Trip recovery strategies
- `src/context/` - React context providers for state management
  - `ChatbotContext.jsx` - Chatbot conversation state
  - `TripPlanningContext.jsx` - Trip planning state

## TripSaathi Chatbot

The AI chatbot is available on the Itinerary and Trip pages. It provides:

- **Itinerary Suggestions**: Recommendations based on user interests
- **Disruption Handling**: Guidance when trip disruptions occur
- **Budget Optimization**: Suggestions to manage trip costs
- **Schedule Adjustments**: Help with modifying trip timing

The chatbot automatically adapts to:
- Active disruptions in the trip
- User interests and preferences
- Current budget status
- Journey flexibility and buffers

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the TS template for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
