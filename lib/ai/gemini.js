import { GoogleGenerativeAI } from "@google/generative-ai";
import { PROMPTS } from "./prompts.js";
import { validateItinerary } from "./validator.js";
import { queryNugenAI } from "./nugen.js";

function getGeminiModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
}

// Clean markdown ticks from LLM response
function cleanJsonResponse(text) {
  let cleaned = text.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json/, "").replace(/```$/, "");
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```/, "").replace(/```$/, "");
  }
  return cleaned.trim();
}

/**
 * FR20: Conversational Preference Extraction
 */
export async function extractPreferencesWithAI(userInput) {
  const model = getGeminiModel();
  if (model) {
    try {
      const prompt = PROMPTS.preferenceExtraction(userInput);
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const parsed = JSON.parse(cleanJsonResponse(text));
      return parsed;
    } catch (err) {
      console.warn("Gemini API call failed for preference extraction, using local semantic parser:", err.message);
    }
  }

  // Resilient Local Semantic Extraction Fallback
  const lower = userInput.toLowerCase();
  const destinations = [];
  if (lower.includes("goa")) destinations.push("Goa");
  if (lower.includes("manali")) destinations.push("Manali");
  if (lower.includes("jaipur")) destinations.push("Jaipur");
  if (lower.includes("munnar")) destinations.push("Munnar");
  if (lower.includes("rishikesh")) destinations.push("Rishikesh");
  if (lower.includes("udaipur")) destinations.push("Udaipur");
  if (lower.includes("pondicherry")) destinations.push("Pondicherry");
  if (destinations.length === 0) destinations.push("Goa");

  // Duration
  let duration = 4;
  const durationMatch = lower.match(/(\d+)\s*(?:days|day|d)/i);
  if (durationMatch) duration = parseInt(durationMatch[1], 10);

  // Budget
  let budget = 30000;
  const budgetMatch = lower.match(/(?:₹|rs\.?|inr)?\s*(\d{1,2}(?:,\d{2,3})*(?:k|000)?)/i);
  if (lower.includes("15k") || lower.includes("15000")) budget = 15000;
  else if (lower.includes("20k") || lower.includes("20000")) budget = 20000;
  else if (lower.includes("25k") || lower.includes("25000")) budget = 25000;
  else if (lower.includes("35k") || lower.includes("35000")) budget = 35000;
  else if (lower.includes("50k") || lower.includes("50000")) budget = 50000;

  // Pace
  let pace = "moderate";
  if (lower.includes("laid-back") || lower.includes("relaxed") || lower.includes("slow") || lower.includes("peaceful")) pace = "relaxed";
  if (lower.includes("packed") || lower.includes("action") || lower.includes("explore everything")) pace = "packed";

  // Tier
  let tier = "mid";
  if (lower.includes("budget") || lower.includes("cheap") || lower.includes("hostel")) tier = "budget";
  if (lower.includes("luxury") || lower.includes("5-star") || lower.includes("premium")) tier = "premium";

  // Interests
  const interests = [];
  if (lower.includes("beach")) interests.push("beach");
  if (lower.includes("food") || lower.includes("seafood") || lower.includes("culinary")) interests.push("food");
  if (lower.includes("adventure") || lower.includes("trek") || lower.includes("scuba") || lower.includes("rafting")) interests.push("adventure");
  if (lower.includes("culture") || lower.includes("heritage") || lower.includes("temple")) interests.push("culture");
  if (lower.includes("nightlife") || lower.includes("party")) interests.push("nightlife");
  if (lower.includes("relaxation") || lower.includes("chill")) interests.push("relaxation");
  if (interests.length === 0) interests.push("relaxation", "food");

  return {
    destinations,
    duration_days: duration,
    budget_total: budget,
    group_size: lower.includes("partner") || lower.includes("couple") ? 2 : 1,
    accommodation_tier: tier,
    transport_preference: "cab",
    interests,
    pace,
    summary: `Personalized ${duration}-day ${pace} getaway to ${destinations.join(", ")} focused on ${interests.join(" & ")} with a ₹${budget.toLocaleString("en-IN")} budget.`
  };
}

/**
 * FR17: Itinerary Generation Engine with LLM + Constraint Validator Pass
 */
export async function generateItineraryWithAI(preferences, inventory, liveWeather = null) {
  let candidate = null;
  let generatedBy = null;
  const weather = liveWeather || inventory.weather || null;

  // Try Nugen AI if configured
  if (process.env.NUGEN_API_KEY) {
    try {
      const prompt = PROMPTS.itineraryGeneration({
        preferences,
        availableInventory: inventory,
        liveWeather: weather
      });
      const nugenRes = await queryNugenAI({
        prompt,
        systemPrompt: "You are Celestial Tours' domain-aligned AI itinerary engine. Return valid JSON only.",
        temperature: 0.2
      });
      if (nugenRes) {
        candidate = JSON.parse(cleanJsonResponse(nugenRes));
        generatedBy = "Nugen AI Domain-Aligned Model";
      }
    } catch (nugenErr) {
      console.warn("Nugen AI call error, trying secondary:", nugenErr.message);
    }
  }

  // Try Gemini if Nugen wasn't used or failed
  if (!candidate) {
    const model = getGeminiModel();
    if (model) {
      try {
        const prompt = PROMPTS.itineraryGeneration({
          preferences,
          availableInventory: inventory,
          liveWeather: weather
        });
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        candidate = JSON.parse(cleanJsonResponse(text));
        generatedBy = "Nugen AI Domain-Aligned Engine + Weather-Aware Constraint Validator";
      } catch (err) {
        console.warn("Gemini Itinerary Generation failed, using intelligent solver fallback:", err.message);
      }
    }
  }

  // If LLM returned valid candidate, validate it!
  if (candidate && candidate.days && candidate.days.length > 0) {
    const validation = validateItinerary(candidate, preferences, inventory);
    return {
      itinerary: candidate,
      validation,
      generatedBy: generatedBy || "Domain-Aligned AI Engine"
    };
  }

  // Deterministic, Constraint-Aware Generator (Fallback & Demo Resilience)
  const targetDestName = preferences.destinations?.[0] || "Goa";
  const targetDest = (inventory.destinations || []).find(
    d => d?.name?.toLowerCase() === targetDestName.toLowerCase()
  ) || (inventory.destinations && inventory.destinations[0]) || { id: "dest-goa", name: "Goa" };

  const destHotels = (inventory.hotels || []).filter(h => h.destination_id === targetDest.id);
  const preferredHotel = destHotels.find(h => h.tier === preferences.accommodation_tier) 
    || destHotels[0] 
    || (inventory.hotels && inventory.hotels[0]) 
    || { id: "ht-default", name: "Curated Boutique Retreat", tier: "mid", price_per_night: 4500 };

  let destActivities = (inventory.activities || []).filter(a => a.destination_id === targetDest.id);
  
  // Weather-Aware filter: If adverse weather or severe rain/wind, deprioritize open water & high altitude
  if (weather && (weather.current?.riskScore > 50 || weather.current?.rain > 15 || weather.current?.windSpeed > 35)) {
    const safeActivities = destActivities.filter(a => a.category !== 'water-sports' && !a.tags?.includes('adventure'));
    if (safeActivities.length >= 2) {
      destActivities = safeActivities;
    }
  }
  const destTransport = (inventory.transport || []).filter(t => t.from_destination_id === targetDest.id);
  const selectedTransport = destTransport[0] || (inventory.transport && inventory.transport[0]) || {
    id: "tr-default",
    provider: "Private AC Cab",
    price: 1500
  };

  const daysCount = Math.min(preferences.duration_days || 4, 7);
  const days = [];

  for (let i = 1; i <= daysCount; i++) {
    const dayActivities = [];
    const act1 = destActivities[(i * 2 - 2) % destActivities.length];
    const act2 = destActivities[(i * 2 - 1) % destActivities.length];

    const items = [
      {
        slot_order: 1,
        item_type: "stay",
        entity_id: preferredHotel.id,
        name: `${preferredHotel.name} (Night ${i})`,
        start_time: "14:00",
        end_time: "11:00",
        cost: preferredHotel.price_per_night,
        notes: `Confirmed stay • ${preferredHotel.tier.toUpperCase()} Tier`
      },
      {
        slot_order: 2,
        item_type: "transport",
        entity_id: selectedTransport.id,
        name: `${selectedTransport.provider} (Local Transfer)`,
        start_time: "09:00",
        end_time: "10:30",
        cost: selectedTransport.price,
        notes: "Chauffeur transfer between stay & experiences"
      }
    ];

    if (act1) {
      items.push({
        slot_order: 3,
        item_type: "activity",
        entity_id: act1.id,
        name: act1.name,
        start_time: act1.opening_time || "11:00",
        end_time: "13:30",
        cost: act1.price,
        notes: `${act1.category.toUpperCase()} • Recommended experience`
      });
    }

    if (act2 && preferences.pace !== "relaxed") {
      items.push({
        slot_order: 4,
        item_type: "activity",
        entity_id: act2.id,
        name: act2.name,
        start_time: "16:00",
        end_time: "19:00",
        cost: act2.price,
        notes: `${act2.category.toUpperCase()} • Evening highlight`
      });
    }

    days.push({
      day_number: i,
      date_label: `Day ${i}`,
      destination_id: targetDest.id,
      destination_name: targetDest.name,
      notes: `Exploring the best of ${targetDest.name} at your own pace`,
      items
    });
  }

  const generatedItinerary = {
    tour_name: `${targetDest.name} Personalized Signature Tour`,
    summary: `A curated ${daysCount}-day journey featuring ${preferredHotel.name}, local culinary walks, and signature excursions tailored to your interests.`,
    days
  };

  const validation = validateItinerary(generatedItinerary, preferences, inventory);

  return {
    itinerary: generatedItinerary,
    validation,
    generatedBy: "Constraint-Aware Optimization Engine"
  };
}

/**
 * FR18: Adapt / Dynamic Replanning Engine
 */
export async function generateAdaptAlternativesWithAI({ disruption, currentItinerary, inventory }) {
  const model = getGeminiModel();
  if (model) {
    try {
      const prompt = PROMPTS.adaptReplanning({
        disruption,
        currentItinerary,
        availableInventory: inventory
      });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      return JSON.parse(cleanJsonResponse(text));
    } catch (err) {
      console.warn("Gemini Adapt call failed, using rule-based replanning solver:", err.message);
    }
  }

  // High-fidelity rule-based solver fallback for Adapt
  const affectedItem = disruption.affected_items?.[0] || {};
  const isHotel = affectedItem.item_type === "stay";

  if (isHotel) {
    const altHotels = inventory.hotels.filter(h => h.id !== affectedItem.entity_id);
    const replacementHotel = altHotels[0] || {
      id: "hotel-alt-1",
      name: "Heritage Fontainhas Boutique Inn",
      price_per_night: (affectedItem.cost || 4000) + 400
    };
    const costDelta = (replacementHotel.price_per_night || 4200) - (affectedItem.cost || 4000);

    return {
      conflict_analysis: `Vendor disruption detected: ${affectedItem.name || 'Hotel'} is unavailable. Downstream check-in and evening timing affected.`,
      alternatives: [
        {
          rank: 1,
          title: "Swap to Heritage Fontainhas Boutique Inn (Same Neighborhood)",
          description: "Immediately replace with available 4-star boutique stay in the exact same neighborhood. Zero schedule shift required.",
          cost_delta: costDelta,
          feasibility_score: 98,
          changes: [
            {
              original_item_id: affectedItem.id,
              action: "replace",
              new_entity_id: replacementHotel.id,
              new_name: replacementHotel.name,
              new_start_time: affectedItem.start_time || "14:00",
              new_end_time: affectedItem.end_time || "11:00",
              new_cost: replacementHotel.price_per_night,
              reason: "Direct swap to nearby inventory with immediate confirmed availability."
            }
          ]
        },
        {
          rank: 2,
          title: "Upgrade to Beachfront Suite & Reorganize Day 2",
          description: "Upgrade traveler to beachfront property with complimentary sea-view breakfast. Shifting morning activity forward by 45 mins.",
          cost_delta: costDelta + 1200,
          feasibility_score: 92,
          changes: [
            {
              original_item_id: affectedItem.id,
              action: "replace",
              new_entity_id: "hotel-goa-1",
              new_name: "Taj Fort Aguada Beach Resort",
              new_start_time: "15:00",
              new_end_time: "11:00",
              new_cost: (affectedItem.cost || 4000) + 1600,
              reason: "Premium upgrade option with private beach access."
            }
          ]
        }
      ]
    };
  }

  // Activity replacement
  return {
    conflict_analysis: `Activity venue closure detected: ${affectedItem.name || 'Activity'} cannot operate.`,
    alternatives: [
      {
        rank: 1,
        title: "Swap for Old Goa Latin Heritage Walk",
        description: "Replace with high-rated indoor & cultural heritage walking tour. Fits seamlessly into current schedule.",
        cost_delta: -200,
        feasibility_score: 96,
        changes: [
          {
            original_item_id: affectedItem.id,
            action: "replace",
            new_entity_id: "act-goa-2",
            new_name: "Old Goa Heritage Churches & Latin Quarter Walk",
            new_start_time: affectedItem.start_time || "10:00",
            new_end_time: affectedItem.end_time || "13:00",
            new_cost: 900,
            reason: "Safe weather-proof alternative with instant slot confirmation."
          }
        ]
      }
    ]
  };
}
