import { NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { detectConflictsForEntity } from '@/lib/itinerary/conflict-detector';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type'); // 'hotels', 'activities', 'transport'
    const destId = searchParams.get('destination_id');

    let hotels = db.getAllHotels();
    let activities = db.getAllActivities();
    let transport = db.getAllTransport();

    if (destId) {
      hotels = hotels.filter(h => h.destination_id === destId);
      activities = activities.filter(a => a.destination_id === destId);
      transport = transport.filter(t => t.from_destination_id === destId);
    }

    return NextResponse.json({
      success: true,
      hotels,
      activities,
      transport,
      destinations: db.getDestinations()
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const body = await req.json();
    const { type, id, available, reason } = body;

    let updatedItem = null;
    if (type === 'hotel') {
      updatedItem = db.updateHotel(id, { available });
    } else if (type === 'activity') {
      updatedItem = db.updateActivity(id, { available });
    } else if (type === 'transport') {
      updatedItem = db.updateTransport(id, { available });
    } else {
      return NextResponse.json({ success: false, error: 'Invalid entity type' }, { status: 400 });
    }

    let detectedEvents = [];
    // If an item was toggled to unavailable (vendor outage/cancellation), automatically run conflict detection across tours
    if (available === false) {
      detectedEvents = detectConflictsForEntity({
        entityType: type,
        entityId: id,
        reason: reason || `${updatedItem?.name || 'Inventory item'} was marked unavailable by operator`
      });
    }

    return NextResponse.json({
      success: true,
      updatedItem,
      conflictsDetected: detectedEvents.length,
      detectedEvents
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { type, data } = body;

    let createdItem = null;
    if (type === 'hotel') {
      createdItem = db.addHotel(data);
    } else if (type === 'activity') {
      createdItem = db.addActivity(data);
    } else if (type === 'transport') {
      createdItem = db.addTransport(data);
    } else {
      return NextResponse.json({ success: false, error: 'Invalid item type' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      item: createdItem,
      message: `${type.toUpperCase()} successfully added to regional inventory pool.`
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

