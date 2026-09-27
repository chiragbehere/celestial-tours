import { NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { getLiveWeather } from '@/lib/weather/service';

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const tourPlan = db.getTourPlan(id);

    if (!tourPlan) {
      return NextResponse.json({ error: 'Tour plan not found' }, { status: 404 });
    }

    const { days, items } = db.getItinerary(id);
    const bookings = db.getBookingsByTourPlan(id);
    const disruptions = db.getDisruptionsByTourPlan(id);

    // Provide inventory for swapping
    const destId = days[0]?.destination_id || 'dest-goa';
    const destName = days[0]?.destination_name || (tourPlan.destinations && tourPlan.destinations[0]) || 'Goa';
    const liveWeather = await getLiveWeather(destName);

    const hotels = (db.getHotelsByDestination ? db.getHotelsByDestination(destId) : []) || [];
    const activities = (db.getActivitiesByDestination ? db.getActivitiesByDestination(destId) : []) || [];
    const transport = (db.getTransportByDestination ? db.getTransportByDestination(destId) : []) || [];

    // Return as array so any client bundle doing .map() works directly
    const availableAlternatives = [
      ...hotels.map(h => ({
        id: h.id,
        name: h.name,
        category: `${(h.tier || 'Hotel').toUpperCase()} Tier • Stay`,
        rating: h.rating || 4.8,
        price_per_night: h.price_per_night,
        cost: h.price_per_night,
        item_type: 'stay'
      })),
      ...activities.map(a => ({
        id: a.id,
        name: a.name,
        category: `${(a.category || 'Activity').toUpperCase()} • Experience`,
        rating: a.rating || 4.7,
        price_per_night: a.price,
        cost: a.price,
        item_type: 'activity'
      })),
      ...transport.map(t => ({
        id: t.id,
        name: t.provider || t.name,
        category: `${(t.mode || 'Cab').toUpperCase()} • Transit`,
        rating: t.rating || 4.9,
        price_per_night: t.price,
        cost: t.price,
        item_type: 'transport'
      }))
    ];

    return NextResponse.json({
      success: true,
      tour_plan: tourPlan,
      days,
      items,
      bookings,
      disruptions,
      availableAlternatives,
      weather: liveWeather,
      categorizedAlternatives: {
        hotels,
        activities,
        transport
      }
    });
  } catch (err) {
    console.error('Error fetching itinerary:', err);
    return NextResponse.json({ error: 'Failed to fetch itinerary' }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const { itemId, replacementEntityId, itemType } = await req.json();

    const { items } = db.getItinerary(id);
    const targetItem = items.find(i => i.id === itemId);

    if (!targetItem) {
      return NextResponse.json({ error: 'Itinerary item not found' }, { status: 404 });
    }

    let newName = targetItem.name;
    let newCost = targetItem.cost;
    let newNotes = targetItem.notes;

    if (itemType === 'stay') {
      const hotel = db.getHotelById(replacementEntityId);
      if (hotel) {
        newName = `${hotel.name} (Updated Stay)`;
        newCost = hotel.price_per_night;
        newNotes = `Confirmed stay • ${hotel.tier.toUpperCase()} Tier`;
      }
    } else if (itemType === 'activity') {
      const activity = db.getActivityById(replacementEntityId);
      if (activity) {
        newName = activity.name;
        newCost = activity.price;
        newNotes = `${activity.category.toUpperCase()} • ${activity.tags.slice(0, 2).join(', ')}`;
      }
    } else if (itemType === 'transport') {
      const transport = db.getTransportById(replacementEntityId);
      if (transport) {
        newName = `${transport.provider} (${transport.mode.toUpperCase()})`;
        newCost = transport.price;
        newNotes = `Departure times: ${transport.departure_times.join(', ')}`;
      }
    }

    // Update item in DB
    const updatedItem = db.updateItineraryItem(itemId, {
      entity_id: replacementEntityId,
      name: newName,
      cost: newCost,
      notes: newNotes
    });

    // Recompute total cost for tour plan
    const { items: allItems } = db.getItinerary(id);
    const newTotalCost = allItems
      .filter(i => i.status !== 'replaced' && i.status !== 'cancelled')
      .reduce((sum, i) => sum + (i.cost || 0), 0);

    db.updateTourPlan(id, { total_cost: newTotalCost });

    return NextResponse.json({
      success: true,
      updatedItem,
      newTotalCost
    });
  } catch (err) {
    console.error('Error updating itinerary item:', err);
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}
