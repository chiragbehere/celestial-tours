import { NextResponse } from 'next/server';
import { getLiveWeather, DESTINATION_COORDINATES } from '@/lib/weather/service';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const destination = searchParams.get('destination') || 'Goa';
    const weather = await getLiveWeather(destination);

    return NextResponse.json({
      success: true,
      weather,
      availableDestinations: Object.keys(DESTINATION_COORDINATES)
    });
  } catch (err) {
    console.error('Error in /api/weather:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
