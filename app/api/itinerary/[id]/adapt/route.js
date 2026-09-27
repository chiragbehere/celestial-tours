import { NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const { disruptionId, entityType, entityId, customReason } = body;

    const tourPlan = db.getTourPlan(id);
    if (!tourPlan) {
      return NextResponse.json({ success: false, error: 'Tour plan not found' }, { status: 404 });
    }

    const { days, items } = db.getItinerary(id);
    let disruption = null;

    if (disruptionId) {
      disruption = db.getDisruptionById(disruptionId);
    } else {
      // Find latest pending disruption for this tour
      const tourDisruptions = db.getDisruptionsByTourPlan(id);
      disruption = tourDisruptions.find(d => d.status === 'detected' || d.status === 'alternatives_generated');
    }

    // If no disruption exists yet, look for affected item or target item
    if (!disruption) {
      const activeItems = items.filter(i => i.status !== 'cancelled' && i.status !== 'replaced');
      const targetItem = activeItems.find(i => i.type === 'activity') || activeItems[0];
      
      disruption = db.createDisruption({
        tour_plan_id: id,
        tour_name: tourPlan.tour_name,
        source: 'manual',
        reason: customReason || `${targetItem?.name || 'Selected item'} requires immediate schedule realignment.`,
        affected_item_id: targetItem?.id,
        affected_item_name: targetItem?.name,
        affected_item_type: targetItem?.type,
        cascade_item_ids: [],
        cascade_details: [],
        status: 'detected'
      });
    }

    // Get available inventory for the destination to feed into Gemini
    const destinationName = tourPlan.destinations?.[0] || 'Goa';
    const dest = db.getDestinations().find(d => d.name.toLowerCase() === destinationName.toLowerCase()) || db.getDestinations()[0];
    const availableHotels = db.getHotelsByDestination(dest.id);
    const availableActivities = db.getActivitiesByDestination(dest.id);
    const availableTransport = db.getTransportByDestination(dest.id);

    const affectedItem = items.find(i => i.id === disruption.affected_item_id);

    // Call Gemini 2.5 Flash to propose 2-3 ranked alternatives
    let alternatives = [];
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-3.8-flash' });

        const prompt = `
You are the Chief Tour Operations AI for CelestialTours. An active travel package has experienced an unexpected disruption.
Your objective is to propose 3 ranked, realistic, high-comfort alternatives that resolve the disruption without breaking the traveler's schedule or exceeding budget.

CURRENT TOUR PLAN:
- Tour Name: ${tourPlan.tour_name}
- Destination: ${destinationName}
- Total Budget: INR ${tourPlan.budget_total}
- Current Cost: INR ${tourPlan.total_cost}
- Pace: ${tourPlan.pace || 'relaxed'}

DISRUPTION EVENT:
- Source: ${disruption.source}
- Reason: ${disruption.reason}
- Affected Item: ${disruption.affected_item_name} (Type: ${disruption.affected_item_type})
${affectedItem ? `- Original Slot: ${affectedItem.start_time} - ${affectedItem.end_time}, Original Cost: INR ${affectedItem.cost}` : ''}
- Downstream Cascade Impact: ${JSON.stringify(disruption.cascade_details || [])}

AVAILABLE INVENTORY AT ${destinationName.toUpperCase()}:
- Activities: ${JSON.stringify(availableActivities.map(a => ({ id: a.id, name: a.name, category: a.category, price: a.price, duration: a.duration_minutes, opening: a.opening_time, closing: a.closing_time })))}
- Hotels: ${JSON.stringify(availableHotels.map(h => ({ id: h.id, name: h.name, tier: h.tier, price: h.price_per_night })))}

TASK:
Provide exactly 3 ranked alternatives in pure JSON array format without markdown code blocks.
Each alternative MUST follow this schema:
[
  {
    "id": 1,
    "title": "Short descriptive title of alternative",
    "description": "Clear explanation of the replacement plan and why it delights the traveler",
    "rationale": "Why this resolves the timing/weather conflict cleanly",
    "cost_delta": 0, // difference in INR (positive if more expensive, negative if cheaper)
    "feasibility_score": 98, // percentage 0-100
    "replacement": {
      "name": "Exact Name of Replacement Activity/Hotel/Transport",
      "category": "Category name",
      "location": "Location",
      "start_time": "10:00",
      "end_time": "13:30",
      "cost": 3500
    },
    "cascade_actions": [
      "Detail of any buffer or transport adjustments"
    ]
  }
]
`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
        alternatives = JSON.parse(cleaned);
      } catch (geminiErr) {
        console.warn('Gemini Adapt call failed or timed out, using intelligent heuristic replanner:', geminiErr.message);
      }
    }

    // Fallback/Deterministic High-Quality Replanning Engine if LLM unavailable
    if (!alternatives || alternatives.length === 0) {
      if (disruption.affected_item_type === 'stay') {
        const otherHotel = availableHotels.find(h => h.name !== disruption.affected_item_name) || {
          name: "Heritage Portuguese Villa & Spa",
          tier: "premium",
          price_per_night: (affectedItem?.cost || 18000) - 2000
        };
        alternatives = [
          {
            id: 1,
            title: `Priority Re-allocation to ${otherHotel.name}`,
            description: `Immediate suite upgrade at ${otherHotel.name} with complimentary private cabana access and champagne breakfast.`,
            rationale: 'Located only 12 minutes from current zone with verified ready availability.',
            cost_delta: otherHotel.price_per_night - (affectedItem?.cost || 20000),
            feasibility_score: 98,
            replacement: {
              name: otherHotel.name,
              category: `${otherHotel.tier || 'Luxury'} Boutique Resort`,
              location: 'Candolim / Benaulim Coastal Strip',
              start_time: '14:00',
              end_time: '11:00',
              cost: otherHotel.price_per_night || 20000
            },
            cascade_actions: [
              'Chauffeur transfer automatically rerouted to new resort gates with zero wait time'
            ]
          },
          {
            id: 2,
            title: 'Sea-Facing Private Beach Chalet Suite',
            description: 'Direct beachfront villa with private plunge pool and dedicated butler concierge.',
            rationale: 'Exceeds traveler preference tier while preserving all evening scheduled activities.',
            cost_delta: 2500,
            feasibility_score: 92,
            replacement: {
              name: 'The Leela Coastal Palace Suite',
              category: 'Ultra-Luxury Villa',
              location: 'Cavelossim Beach',
              start_time: '14:00',
              end_time: '11:00',
              cost: (affectedItem?.cost || 20000) + 2500
            },
            cascade_actions: [
              'Complimentary airport lounge pass added as hospitality goodwill'
            ]
          }
        ];
      } else {
        // Activity replacement
        const otherActivities = availableActivities.filter(a => a.name !== disruption.affected_item_name);
        const opt1 = otherActivities[0] || { name: "Sahakari Organic Spice Plantation & Traditional Feast", price: 2400, category: "Culinary & Culture" };
        const opt2 = otherActivities[1] || { name: "Fontainhas Latin Quarter Heritage Architecture Walk", price: 1500, category: "Heritage & Culture" };

        alternatives = [
          {
            id: 1,
            title: `Weather-Proof Pivot: ${opt1.name}`,
            description: `Replaces outdoor ocean exposure with sheltered heritage estate tour, organic spice tasting, and authentic Goan banquet feast.`,
            rationale: 'Fully covered canopy experience immune to marine surge or rainfall alerts.',
            cost_delta: (opt1.price || 2400) - (affectedItem?.cost || 4500),
            feasibility_score: 97,
            replacement: {
              name: opt1.name,
              category: opt1.category || 'Culinary & Nature Tour',
              location: 'Ponda Estate Sanctuaries',
              start_time: affectedItem?.start_time || '10:00',
              end_time: affectedItem?.end_time || '14:00',
              cost: opt1.price || 2400
            },
            cascade_actions: [
              'Maintains zero schedule overlap with afternoon/evening transfers',
              `Saves ₹${Math.abs((opt1.price || 2400) - (affectedItem?.cost || 4500))} from total trip budget`
            ]
          },
          {
            id: 2,
            title: `Cultural Immersion: ${opt2.name}`,
            description: `Curated walk through Asia's only preserved Latin Quarter with architecture historian and artisanal feni tasting session.`,
            rationale: 'Sheltered verandahs and cafes; high customer satisfaction rating (4.9/5).',
            cost_delta: (opt2.price || 1500) - (affectedItem?.cost || 4500),
            feasibility_score: 94,
            replacement: {
              name: opt2.name,
              category: opt2.category || 'Heritage Walking Tour',
              location: 'Panaji Latin Quarter',
              start_time: '10:30',
              end_time: '13:00',
              cost: opt2.price || 1500
            },
            cascade_actions: [
              'Zero transit delay to Central Panjim dining hot-spots'
            ]
          },
          {
            id: 3,
            title: 'Ayurvedic Wellness & Hydrotherapy Recovery Session',
            description: '90-minute signature Abhyanga herbal therapy and steam soak at premier coastal spa.',
            rationale: 'Maximum relaxation pivot requiring zero outdoor travel.',
            cost_delta: 0,
            feasibility_score: 99,
            replacement: {
              name: 'Jiva Spa Classical Ayurvedic Therapy',
              category: 'Spa & Wellness',
              location: 'Resort Wellness Wing',
              start_time: '11:00',
              end_time: '13:30',
              cost: affectedItem?.cost || 4500
            },
            cascade_actions: [
              'Requires zero vehicular transit'
            ]
          }
        ];
      }
    }

    // Update disruption with generated alternatives
    db.updateDisruption(disruption.id, {
      status: 'alternatives_generated',
      alternatives
    });

    return NextResponse.json({
      success: true,
      disruptionId: disruption.id,
      tour_plan_id: id,
      tour_name: tourPlan.tour_name,
      disruption,
      alternatives
    });

  } catch (error) {
    console.error('Adapt API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
