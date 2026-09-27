import { NextResponse } from 'next/server';
import { db } from '@/lib/db/store';

export async function GET() {
  try {
    const disruptions = db.getAllDisruptions();
    return NextResponse.json({ success: true, disruptions });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { disruptionId, alternative } = body;

    if (!disruptionId || !alternative) {
      return NextResponse.json({ success: false, error: 'disruptionId and alternative are required' }, { status: 400 });
    }

    const result = db.resolveDisruptionWithAlternative(disruptionId, alternative);
    if (!result) {
      return NextResponse.json({ success: false, error: 'Disruption not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Disruption resolved and cascading schedule/bookings updated successfully',
      ...result
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
