import { NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { generateItineraryWithAI } from '@/lib/ai/gemini';

export async function POST(req) {
  try {
    const preferences = await req.json();

    const inventory = {
      destinations: db.getDestinations(),
      hotels: db.getAllHotels(),
      activities: db.getAllActivities(),
      transport: db.getAllTransport()
    };

    // Call Gemini 2.5 Flash + Validator
    const { itinerary, validation, generatedBy } = await generateItineraryWithAI(preferences, inventory);

    // Persist in DB
    const tourPlanId = `tour-${Date.now()}`;
    const newTourPlan = db.createTourPlan({
      id: tourPlanId,
      destinations: preferences.destinations || ["Goa"],
      duration_days: preferences.duration_days || 4,
      budget_total: preferences.budget_total || 30000,
      group_size: preferences.group_size || 2,
      accommodation_tier: preferences.accommodation_tier || "mid",
      transport_preference: preferences.transport_preference || "cab",
      interests: preferences.interests || ["relaxation"],
      pace: preferences.pace || "moderate",
      raw_preferences: preferences.raw_preferences || "",
      total_cost: validation.calculatedCost || 0,
      tour_name: itinerary.tour_name,
      summary: itinerary.summary,
      status: 'planned'
    });

    // Flatten days and items with dependency graph links
    const daysToSave = [];
    const itemsToSave = [];

    itinerary.days.forEach((day, dayIdx) => {
      const dayId = `day-${tourPlanId}-${day.day_number || dayIdx + 1}`;
      daysToSave.push({
        id: dayId,
        tour_plan_id: tourPlanId,
        day_number: day.day_number || dayIdx + 1,
        date_label: day.date_label || `Day ${dayIdx + 1}`,
        destination_id: day.destination_id,
        destination_name: day.destination_name,
        notes: day.notes
      });

      let prevItemId = null;
      if (Array.isArray(day.items)) {
        day.items.forEach((item, itemIdx) => {
          const itemId = `item-${dayId}-${item.slot_order || itemIdx + 1}`;
          const dependencies = [];
          if (prevItemId) {
            dependencies.push(prevItemId); // item sequence dependency
          }

          itemsToSave.push({
            id: itemId,
            itinerary_day_id: dayId,
            tour_plan_id: tourPlanId,
            slot_order: item.slot_order || itemIdx + 1,
            item_type: item.item_type,
            entity_id: item.entity_id,
            name: item.name,
            start_time: item.start_time,
            end_time: item.end_time,
            cost: item.cost || 0,
            notes: item.notes,
            depends_on: dependencies,
            status: 'planned'
          });

          prevItemId = itemId;
        });
      }
    });

    db.saveItinerary(tourPlanId, daysToSave, itemsToSave);

    return NextResponse.json({
      success: true,
      tour_plan_id: tourPlanId,
      tour_plan: newTourPlan,
      days: daysToSave,
      items: itemsToSave,
      validation,
      generatedBy
    });
  } catch (err) {
    console.error('Error generating itinerary:', err);
    return NextResponse.json({ error: 'Failed to generate itinerary', details: err.message }, { status: 500 });
  }
}
