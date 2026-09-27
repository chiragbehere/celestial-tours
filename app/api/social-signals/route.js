import { NextResponse } from 'next/server';
import { getSocialSignals, addSocialSignal, analyzeSocialSignals } from '@/lib/social/signals';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const destination = searchParams.get('destination') || 'Goa';
    const signals = getSocialSignals(destination);
    const analysis = analyzeSocialSignals(signals);

    return NextResponse.json({
      success: true,
      destination,
      count: signals.length,
      signals,
      analysis
    });
  } catch (err) {
    console.error('Error in /api/social-signals GET:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    if (!body.content || typeof body.content !== 'string') {
      return NextResponse.json({ error: 'Report content is required' }, { status: 400 });
    }

    const created = addSocialSignal(body);
    const destination = body.destination || 'Goa';
    const allSignals = getSocialSignals(destination);
    const analysis = analyzeSocialSignals(allSignals);

    return NextResponse.json({
      success: true,
      signal: created,
      analysis
    });
  } catch (err) {
    console.error('Error in /api/social-signals POST:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
