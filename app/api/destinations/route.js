import { NextResponse } from 'next/server';
import { db } from '@/lib/db/store';

export async function GET() {
  try {
    const destinations = db.getDestinations();
    const hotels = db.getAllHotels();
    const activities = db.getAllActivities();
    const transport = db.getAllTransport();

    return NextResponse.json({
      success: true,
      destinations,
      hotels,
      activities,
      transport
    });
  } catch (err) {
    console.error('Error fetching destinations:', err);
    return NextResponse.json({ error: 'Failed to fetch destinations' }, { status: 500 });
  }
}
