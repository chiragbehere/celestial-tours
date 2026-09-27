import { NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { createSimulationDisruption } from '@/lib/itinerary/conflict-detector';

export async function POST(req) {
  try {
    const body = await req.json();
    const { tourPlanId, type, customMessage } = body;

    const targetTourId = tourPlanId || db.getAllTourPlans()[0]?.id;
    if (!targetTourId) {
      return NextResponse.json({ success: false, error: 'No active tour plan found to simulate on' }, { status: 400 });
    }

    const disruption = createSimulationDisruption({
      tourPlanId: targetTourId,
      type: type || 'weather_monsoon',
      customMessage
    });

    return NextResponse.json({
      success: true,
      message: 'Disruption simulation triggered successfully',
      disruption
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
