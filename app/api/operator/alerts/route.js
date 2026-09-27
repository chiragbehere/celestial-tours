import { NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { findCascadeEffects } from '@/lib/itinerary/dependency-graph';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const tourPlanId = searchParams.get('tour_plan_id');

    let disruptions = db.getAllDisruptions();
    if (tourPlanId) {
      disruptions = disruptions.filter(d => d.tour_plan_id === tourPlanId);
    }

    return NextResponse.json({
      success: true,
      alerts: disruptions,
      disruptions
    });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      title,
      destination = 'Goa',
      severity = 'critical',
      category = 'weather',
      description,
      tour_plan_id,
      affectedActivity
    } = body;

    // Target the requested tour or default to the destination's active tour
    const targetTourId = tour_plan_id || (
      destination?.toLowerCase() === 'manali' ? 'tour-manali-alpine' :
      destination?.toLowerCase() === 'rajasthan' ? 'tour-rajasthan-heritage' :
      destination?.toLowerCase() === 'kerala' ? 'tour-kerala-backwaters' :
      'tour-goa-signature'
    );

    const plan = db.getTourPlan(targetTourId) || db.getAllTourPlans()[0];
    const { items } = db.getItinerary(plan?.id || targetTourId);

    // Identify affected item in itinerary
    const affectedItem = items?.find(i => 
      i.status !== 'cancelled' && i.status !== 'replaced' && (
        i.type === 'activity' || 
        i.name?.toLowerCase().includes('scuba') || 
        i.name?.toLowerCase().includes('safari') ||
        i.name?.toLowerCase().includes(affectedActivity?.toLowerCase() || '')
      )
    ) || items?.[1] || items?.[0];

    const cascadeResult = affectedItem ? findCascadeEffects(affectedItem.id, items, description || title) : { cascadeItems: [] };

    const newDisruption = db.createDisruption({
      id: `disrupt-sim-${Date.now()}`,
      tour_plan_id: plan?.id || targetTourId,
      tour_name: plan?.tour_name || `${destination} Signature Tour`,
      source: category || 'weather',
      reason: description || title || `Severe weather squall warning detected across ${destination}`,
      severity,
      affected_item_id: affectedItem?.id || 'item-goa-act-scuba',
      affected_item_name: affectedItem?.name || affectedActivity || 'Coastal Marine Activity',
      affected_item_type: affectedItem?.type || 'activity',
      cascade_item_ids: cascadeResult.cascadeItems.map(c => c.item.id),
      cascade_details: cascadeResult.cascadeItems.map(c => ({
        id: c.item.id,
        name: c.item.name,
        type: c.item.type,
        impactReason: c.impactReason
      })),
      status: 'detected',
      created_at: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      message: 'Disruption successfully injected and synchronized with database.',
      disruption: newDisruption
    });
  } catch (error) {
    console.error('Error creating simulation alert:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
