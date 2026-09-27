export const PROMPTS = {
  // Conversational intake prompt (FR20)
  preferenceExtraction: (userInput) => `
You are an intelligent travel concierge specializing in Indian travel itineraries.
A traveler has provided free-text preferences for their upcoming trip:
"${userInput}"

Extract structured trip preferences as a clean JSON object with these exact keys:
- destinations: string[] (names of Indian destinations mentioned or best matching, e.g. ["Goa", "Manali", "Jaipur", "Munnar", "Rishikesh", "Udaipur", "Hampi", "Pondicherry", "Darjeeling", "Coorg", "Varanasi", "Alleppey"])
- duration_days: number (default to 4 if unspecified)
- budget_total: number in INR (reasonable estimate if not specified, e.g. 25000)
- group_size: number (default to 2 if unspecified)
- accommodation_tier: "budget" | "mid" | "premium"
- transport_preference: "cab" | "train" | "flight" | "scooter" | "bus"
- interests: string[] (e.g. ["beach", "food", "adventure", "culture", "relaxation", "nightlife"])
- pace: "relaxed" | "moderate" | "packed"
- summary: string (a warm, 1-sentence recap of what they're looking for)

OUTPUT ONLY RAW JSON, NO MARKDOWN TICKS, NO EXTRA TEXT.
`,

  // Itinerary Generation Engine prompt (FR17)
  itineraryGeneration: ({ preferences, availableInventory, liveWeather }) => `
You are an expert tour planning AI engine for CelestialTours.
Generate an optimal, realistic day-by-day itinerary respecting all constraints.

TRAVELER PREFERENCES:
${JSON.stringify(preferences, null, 2)}

LIVE REAL-TIME WEATHER METRICS (Open-Meteo Live API):
Destination: ${liveWeather?.destination || preferences.destinations?.[0] || 'Target Hub'}
Condition: ${liveWeather?.current?.condition || 'Fair'} (${liveWeather?.current?.temperature || 28}°C, Wind ${liveWeather?.current?.windSpeed || 12} km/h, Rain ${liveWeather?.current?.rain || 0} mm)
Safety Severity: ${liveWeather?.current?.severity || 'safe'} | Activity Risk Score: ${liveWeather?.current?.riskScore || 10}/100
Weather Outlook: ${liveWeather?.current?.description || 'Optimal conditions'}

AVAILABLE OPERATOR INVENTORY:
Destinations: ${JSON.stringify(availableInventory.destinations.map(d => ({ id: d.id, name: d.name, tags: d.tags })))}
Hotels: ${JSON.stringify(availableInventory.hotels.map(h => ({ id: h.id, dest: h.destination_id, name: h.name, tier: h.tier, price: h.price_per_night, rating: h.rating })))}
Activities: ${JSON.stringify(availableInventory.activities.map(a => ({ id: a.id, dest: a.destination_id, name: a.name, category: a.category, price: a.price, duration: a.duration_minutes, opening: a.opening_time, closing: a.closing_time })))}
Transport: ${JSON.stringify(availableInventory.transport.map(t => ({ id: t.id, dest: t.from_destination_id, provider: t.provider, mode: t.mode, price: t.price })))}

CRITICAL CONSTRAINTS TO RESPECT:
1. BUDGET: Total cost (Hotels * nights + Transport + Activities) must NOT exceed budget_total (INR ${preferences.budget_total || 30000}).
2. TIMING: Activities must fit within opening/closing hours. No overlapping slots. Allow 30-60 min travel buffer between activities.
3. WEATHER-AWARE ADAPTATION: If current or forecasted weather indicates heavy rain or high winds (>35km/h), prioritize sheltered indoor experiences, heritage architecture, and culinary visits over open-water or exposed alpine adventures.
4. PACING:
   - "relaxed": 1-2 activities per day, late morning start (~10:00).
   - "moderate": 2-3 activities per day.
   - "packed": 3-4 activities per day, early morning start.
5. DEPENDENCIES: Afternoon activities depend on morning hotel check-in or transport arrival.
6. REALISTIC SLOTS: Use slot_order (1, 2, 3...) for chronological sequence.

RETURN JSON WITH THIS EXACT STRUCTURE:
{
  "tour_name": string,
  "summary": string,
  "estimated_cost": number,
  "days": [
    {
      "day_number": 1,
      "date_label": "Day 1",
      "destination_id": string,
      "destination_name": string,
      "notes": string,
      "items": [
        {
          "slot_order": 1,
          "item_type": "stay" | "transport" | "activity",
          "entity_id": string (must match an id from Available Inventory),
          "name": string,
          "start_time": "HH:MM",
          "end_time": "HH:MM",
          "cost": number,
          "notes": string
        }
      ]
    }
  ]
}

OUTPUT ONLY RAW VALID JSON. NO MARKDOWN TICKS.
`,

  // Adapt / Replanning Engine prompt (FR18, Phase 3 headline)
  adaptReplanning: ({ currentItinerary, disruption, availableInventory }) => `
You are the CelestialTours Dynamic Replanning Engine.
A disruption has occurred on an active tour. Generate 2 to 3 distinct, ranked alternative resolutions to restore feasibility.

DISRUPTION DETAILS:
Source: ${disruption.source}
Description: ${disruption.description}
Affected Items: ${JSON.stringify(disruption.affected_items)}
Cascade Effect: ${disruption.cascade_reason || 'Downstream scheduling conflict'}

CURRENT TOUR ITINERARY:
${JSON.stringify(currentItinerary, null, 2)}

AVAILABLE SPARE INVENTORY:
Hotels: ${JSON.stringify(availableInventory.hotels.map(h => ({ id: h.id, dest: h.destination_id, name: h.name, price: h.price_per_night, tier: h.tier })))}
Activities: ${JSON.stringify(availableInventory.activities.map(a => ({ id: a.id, dest: a.destination_id, name: a.name, price: a.price, category: a.category, duration: a.duration_minutes })))}

PROPOSE 2-3 ALTERNATIVES RANKED FROM BEST TO WORST FIT.
Format as JSON:
{
  "conflict_analysis": string,
  "alternatives": [
    {
      "rank": 1,
      "title": string (e.g. "Seamless Hotel Swap with Zero Delay"),
      "description": string,
      "cost_delta": number (positive for increase, negative for savings, 0 for even),
      "feasibility_score": number (1-100),
      "changes": [
        {
          "original_item_id": string,
          "action": "replace" | "reschedule" | "cancel",
          "new_entity_id": string,
          "new_name": string,
          "new_start_time": "HH:MM",
          "new_end_time": "HH:MM",
          "new_cost": number,
          "reason": string
        }
      ]
    }
  ]
}

OUTPUT ONLY RAW VALID JSON.
`
};
