import { findCascadeEffects } from './dependency-graph';
import { db } from '../db/store';

/**
 * Conflict Detector Service (FR18)
 * Detects conflicts across active tours when an inventory vendor becomes unavailable
 * or when an operational disruption occurs.
 */
export function detectConflictsForEntity({ entityType, entityId, reason, source = 'vendor_cancel' }) {
  const tourPlans = db.getAllTourPlans();
  const detectedEvents = [];

  tourPlans.forEach((plan) => {
    const { items } = db.getItinerary(plan.id);
    const affectedItem = items.find((item) => {
      if (item.status === 'cancelled' || item.status === 'replaced') return false;
      if (entityType === 'hotel' && item.hotel_id === entityId) return true;
      if (entityType === 'transport' && item.transport_id === entityId) return true;
      if (entityType === 'activity' && item.activity_id === entityId) return true;
      return false;
    });

    if (affectedItem) {
      const cascadeResult = findCascadeEffects(affectedItem.id, items, reason);
      const disruption = {
        id: `disrupt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        tour_plan_id: plan.id,
        tour_name: plan.tour_name,
        source,
        reason: reason || `${affectedItem.name} became unavailable`,
        affected_item_id: affectedItem.id,
        affected_item_name: affectedItem.name,
        affected_item_type: affectedItem.type,
        cascade_item_ids: cascadeResult.cascadeItems.map(c => c.item.id),
        cascade_details: cascadeResult.cascadeItems.map(c => ({
          id: c.item.id,
          name: c.item.name,
          type: c.item.type,
          impactReason: c.impactReason
        })),
        status: 'detected',
        created_at: new Date().toISOString()
      };

      db.createDisruption(disruption);
      detectedEvents.push(disruption);
    }
  });

  return detectedEvents;
}

/**
 * Creates a simulated disruption for demo purposes
 */
export function createSimulationDisruption({ tourPlanId, type = 'hotel_unavailable', customMessage }) {
  const { items } = db.getItinerary(tourPlanId);
  const plan = db.getTourPlan(tourPlanId);

  if (!plan || !items || items.length === 0) {
    throw new Error('Tour plan or itinerary items not found');
  }

  let targetItem = null;
  let reason = '';
  let source = 'vendor_cancel';

  if (type === 'hotel_unavailable') {
    targetItem = items.find(i => i.type === 'stay' && i.status !== 'cancelled' && i.status !== 'replaced');
    reason = customMessage || `${targetItem?.name || 'Selected Resort'} reported an unexpected plumbing line burst and cancelled all bookings.`;
    source = 'vendor_cancel';
  } else if (type === 'weather_monsoon') {
    targetItem = items.find(i => i.type === 'activity' && i.status !== 'cancelled' && i.status !== 'replaced');
    reason = customMessage || `India Meteorological Dept issued a Red Coastal Alert. ${targetItem?.name || 'Water sports'} temporarily suspended.`;
    source = 'weather';
  } else if (type === 'transport_delay') {
    targetItem = items.find(i => i.type === 'transport' && i.status !== 'cancelled' && i.status !== 'replaced');
    reason = customMessage || `Highway congestion and landslide clearance on NH-66 delayed ${targetItem?.name || 'Private Transit'} by 3.5 hours.`;
    source = 'delay';
  } else {
    targetItem = items.find(i => i.status !== 'cancelled' && i.status !== 'replaced');
    reason = customMessage || `Operational variance reported for ${targetItem?.name}.`;
    source = 'manual';
  }

  if (!targetItem) {
    targetItem = items[0];
  }

  const cascadeResult = findCascadeEffects(targetItem.id, items, reason);

  const disruption = {
    id: `disrupt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    tour_plan_id: plan.id,
    tour_name: plan.tour_name,
    source,
    reason,
    affected_item_id: targetItem.id,
    affected_item_name: targetItem.name,
    affected_item_type: targetItem.type,
    cascade_item_ids: cascadeResult.cascadeItems.map(c => c.item.id),
    cascade_details: cascadeResult.cascadeItems.map(c => ({
      id: c.item.id,
      name: c.item.name,
      type: c.item.type,
      impactReason: c.impactReason
    })),
    status: 'detected',
    created_at: new Date().toISOString()
  };

  return db.createDisruption(disruption);
}
