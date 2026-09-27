/**
 * Dependency Graph Engine for CelestialTours
 * Models itinerary items as a directed acyclic graph (DAG) to determine
 * cascading impacts when an item is cancelled, delayed, or unavailable.
 */

export function buildItineraryGraph(items) {
  const nodes = new Map();
  const forwardAdj = new Map(); // id -> [dependent item ids]
  const reverseAdj = new Map(); // id -> [depends_on item ids]

  items.forEach((item) => {
    nodes.set(item.id, item);
    forwardAdj.set(item.id, []);
    reverseAdj.set(item.id, []);
  });

  // Implicit dependencies based on chronological slot_order and day
  const sorted = [...items].sort((a, b) => {
    if (a.day_number !== b.day_number) return a.day_number - b.day_number;
    return (a.slot_order || 0) - (b.slot_order || 0);
  });

  for (let i = 0; i < sorted.length; i++) {
    const current = sorted[i];
    
    // Explicit dependencies
    if (Array.isArray(current.depends_on)) {
      current.depends_on.forEach((depId) => {
        if (forwardAdj.has(depId)) {
          forwardAdj.get(depId).push(current.id);
          reverseAdj.get(current.id).push(depId);
        }
      });
    }

    // Temporal chain within the same day: later items depend on prior items
    if (i < sorted.length - 1) {
      const next = sorted[i + 1];
      if (next.day_number === current.day_number) {
        if (!forwardAdj.get(current.id).includes(next.id)) {
          forwardAdj.get(current.id).push(next.id);
          reverseAdj.get(next.id).push(current.id);
        }
      }
    }
  }

  return { nodes, forwardAdj, reverseAdj };
}

/**
 * Traverses downstream dependencies from a disrupted item ID
 * Returns the primary affected item and all cascading downstream items with reasons
 */
export function findCascadeEffects(disruptedItemId, items, reason = 'Vendor disruption') {
  const { nodes, forwardAdj } = buildItineraryGraph(items);
  const primaryItem = nodes.get(disruptedItemId);

  if (!primaryItem) {
    return {
      affectedItemId: disruptedItemId,
      primaryItem: null,
      cascadeItems: [],
      affectedCount: 0
    };
  }

  const visited = new Set();
  const cascadeItems = [];
  const queue = [...(forwardAdj.get(disruptedItemId) || [])];

  while (queue.length > 0) {
    const currentId = queue.shift();
    if (visited.has(currentId)) continue;
    visited.add(currentId);

    const downstreamItem = nodes.get(currentId);
    if (downstreamItem && downstreamItem.status !== 'cancelled' && downstreamItem.status !== 'replaced') {
      let impactReason = `Schedule buffer impacted by disruption in ${primaryItem.name}`;
      if (primaryItem.type === 'transport' && downstreamItem.type === 'activity') {
        impactReason = `Arrival delay prevents on-time entry to ${downstreamItem.name}`;
      } else if (primaryItem.type === 'stay' && downstreamItem.type === 'activity') {
        impactReason = `Relocation requires travel time adjustment to ${downstreamItem.name}`;
      }

      cascadeItems.push({
        item: downstreamItem,
        impactReason
      });

      // Continue breadth-first traversal
      const nextDependents = forwardAdj.get(currentId) || [];
      queue.push(...nextDependents);
    }
  }

  return {
    affectedItemId: disruptedItemId,
    primaryItem,
    cascadeItems,
    affectedCount: 1 + cascadeItems.length
  };
}
